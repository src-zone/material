import { Injectable, Optional, Renderer2, SkipSelf } from '@angular/core';
import { getCorrectEventName } from '@material/animation';
import { MDCSnackbar, MDCSnackbarFoundation } from '@material/snackbar';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { filter } from 'rxjs/operators/filter';
import { take } from 'rxjs/operators/take';
import { MdcSnackbarAdapter } from './mdc.snackbar.adapter';
import { MdcSnackbarMessage } from './mdc.snackbar.message';

const CLASS_ACTIVE = 'mdc-snackbar--active';
const CLASS_ALIGN_START = 'mdc-snackbar--align-start';

/**
 * This class provides information about a posted snackbar message.
 * It can also be used to subscribe to action clicks.
 */
export class MdcSnackbarRef {
    constructor(private _action: Subject<void>) {}

    /**
     * Subscribe to this observable to be informed when a user clicks the action
     * for the shown snackbar. Note that the observable will complete when the snackbar
     * disappears from screen, so there is no need to unsubscribe.
     */
    action(): Observable<void> {
        return this._action.asObservable();
    }
}

/**
 * A service for showing spec-aligned material design snackbar/toast messages.
 */
@Injectable()
export class MdcSnackbarService {
    private snackbar: MDCSnackbar = null;
    private root: HTMLElement = null;
    private isActive = false;
    private postedMessages = 0;
    private lastActivated = -1;
    private lastDismissed = -1;
    
    private closeMessage: Subject<number> = new Subject<number>();

    constructor() {
    }

    private initHtml() {
        if (!this.snackbar) {
            this.root = document.createElement('div');
            this.root.classList.add('mdc-snackbar');
            this.root.setAttribute('aria-live', 'assertive');
            this.root.setAttribute('aria-atomic', 'true');
            this.root.setAttribute('aria-hidden', 'true');
            let snackbarText = document.createElement('div');
            snackbarText.classList.add('mdc-snackbar__text');
            this.root.appendChild(snackbarText);
            let snackbarAction = document.createElement('div');
            snackbarAction.classList.add('mdc-snackbar__action-wrapper');
            this.root.appendChild(snackbarAction);
            let snackbarActionButton = document.createElement('button');
            snackbarActionButton.classList.add('mdc-snackbar__action-button');
            snackbarActionButton.setAttribute('type', 'button');
            snackbarAction.appendChild(snackbarActionButton);
            document.body.appendChild(this.root);
            this.snackbar = new MDCSnackbar(this.root, this.getFoundation(this.root));
        }
    }

    private getFoundation(root: HTMLElement): MDCSnackbarFoundation {
        const textEl = root.querySelector('.mdc-snackbar__text');
        const buttonEl = <HTMLElement>root.querySelector('.mdc-snackbar__action-button');
        const adapter: MdcSnackbarAdapter = {
            addClass: (className) => {
                if (className === CLASS_ACTIVE)
                    this.activateNext();                
                root.classList.add(className);
            },
            removeClass: (className) => {
                if (className === 'mdc-snackbar--active')
                    this.deactivateLast();
                root.classList.remove(className);
            },
            setAriaHidden: () => root.setAttribute('aria-hidden', 'true'),
            unsetAriaHidden: () => root.removeAttribute('aria-hidden'),
            setActionAriaHidden: () => buttonEl.setAttribute('aria-hidden', 'true'),
            unsetActionAriaHidden: () => buttonEl.removeAttribute('aria-hidden'),
            setActionText: (text) => { buttonEl.textContent = text; },
            setMessageText: (text) => { textEl.textContent = text; },
            setFocus: () => buttonEl.focus(),
            visibilityIsHidden: () => document.hidden,
            registerCapturedBlurHandler: (handler) => buttonEl.addEventListener('blur', handler, true),
            deregisterCapturedBlurHandler: (handler) => buttonEl.removeEventListener('blur', handler, true),
            registerVisibilityChangeHandler: (handler) => document.addEventListener('visibilitychange', handler),
            deregisterVisibilityChangeHandler: (handler) => document.removeEventListener('visibilitychange', handler),
            registerCapturedInteractionHandler: (evt, handler) => document.body.addEventListener(evt, handler, true),
            deregisterCapturedInteractionHandler: (evt, handler) => document.body.removeEventListener(evt, handler, true),
            registerActionClickHandler: (handler) => buttonEl.addEventListener('click', handler),
            deregisterActionClickHandler: (handler) => buttonEl.removeEventListener('click', handler),
            registerTransitionEndHandler: (handler) => root.addEventListener(getCorrectEventName(window, 'transitionend'), handler),
            deregisterTransitionEndHandler: (handler) => root.removeEventListener(getCorrectEventName(window, 'transitionend'), handler)
        }
        return new MDCSnackbarFoundation(adapter);
    }

    private activateNext() {
        while (this.lastDismissed < this.lastActivated)
            // since this activates a new message, all messages before will logically be closed:
            this.closeMessage.next(++this.lastDismissed);
        ++this.lastActivated;
        this.isActive = true;
    }

    private deactivateLast() {
        if (this.isActive) {
            ++this.lastDismissed;
            this.isActive = false;
            this.closeMessage.next(this.lastDismissed);
        }
    }

    /**
     * Show a snackbar/toast message. If a snackbar message is already showing, the new
     * message will be queued to show after earlier message have been shown.
     * The returned <code>MdcSnackbarRef</code> provides methods to subscribe to action clicks.
     * 
     * @param message Queue a snackbar message to show.
     */
    show(message: MdcSnackbarMessage): MdcSnackbarRef {
        // make sure data passes precondition checks in foundation,
        // or our counters will not be right after snackbar.show throws exception:
        if (!message)
            throw new Error('snackbar message called with no data');
        if (!message.message)
            throw new Error('snackbar message is missing the actual message text');            

        this.initHtml();
        let messageNr = this.postedMessages++;
        let data: any = {
            message: message.message,
            actionText: message.actionText,
            multiline: message.multiline,
            actionOnBottom: message.actionOnBottom,
            timeout: message.timeout
        };

        // provide a means to subscribe to an action click:
        let action = new Subject<void>();
        if (message.actionText)
            data.actionHandler = function() {action.next(); };
        // make sure the action Subject will complete after the snackbar is removed from screen,
        // so that callers never have to unsubscribe:
        this.closeMessage.asObservable().pipe(
            filter(nr => nr === messageNr),
            take(1)
        ).subscribe(nr => {
            action.complete();
        });

        // show the actual snackbar:
        this.snackbar.show(data);

        return new MdcSnackbarRef(action);
    }

    /**
     * Set this property to true to show snackbars start-aligned instead of center-aligned. Desktop and tablet only.
     */
    get startAligned(): boolean {
        return this.snackbar ? this.root.classList.contains(CLASS_ALIGN_START) : false;
    }

    set startAligned(value: boolean) {
        this.initHtml();
        if (value)
            this.root.classList.add(CLASS_ALIGN_START);
        else
            this.root.classList.remove(CLASS_ALIGN_START);
    }

    /**
     * By default the snackbar will be dimissed when the user presses the action button.
     * If you want the snackbar to remain visible until the timeout is reached (regardless of
     * whether the user pressed the action button or not) you can set the dismissesOnAction
     * property to false.
     */
    get dismissesOnAction(): boolean {
        return this.snackbar ? this.snackbar.dismissesOnAction : true;
    }

    set dismissesOnAction(value: boolean) {
        this.initHtml();
        this.snackbar.dismissesOnAction = value;
    }
}

/** @docs-private */
export function MDC_SNACKBAR_PROVIDER_FACTORY(parent: MdcSnackbarService) {
    return parent || new MdcSnackbarService();
}

/** @docs-private */
export const MDC_SNACKBAR_PROVIDER = {
    provide: MdcSnackbarService,
    deps: [[new Optional(), new SkipSelf(), MdcSnackbarService]],
    useFactory: MDC_SNACKBAR_PROVIDER_FACTORY
};
