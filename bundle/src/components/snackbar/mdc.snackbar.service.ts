import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { MDCSnackbarAdapter, MDCSnackbarFoundation, numbers } from '@material/snackbar';
import { announce } from '@material/snackbar/util';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MdcSnackbarMessage } from './mdc.snackbar.message';

const CLASS_LEADING = 'mdc-snackbar--leading';
const CLASS_STACKED = 'mdc-snackbar--stacked';


/**
 * This class provides information about a posted snackbar message.
 * It can also be used to subscribe to action clicks.
 */
export abstract class MdcSnackbarRef {
    /**
     * Subscribe to this observable to be informed when a user clicks the action
     * for the shown snackbar. Note that the observable will complete when the snackbar
     * disappears from screen, so there is no need to unsubscribe.
     */
    abstract action(): Observable<void>;

    /**
     * Subscribe to this observable to be informed when the message is displayed.
     * Note that the observable will complete when the snackbar disappears from screen,
     * so there is no need to unsubscribe.
     */
    abstract afterOpened(): Observable<void>;

    /**
     * Subscribe to this observable to be informed when the message has disappeared.
     * Note that the observable will complete immediately afterwards, so there is
     * no need to unsubscribe.
     * The observed value is the `reason` string that was provided for closing the snackbar.
     */
    abstract afterClosed(): Observable<string>;
}

// internal representation of the snackbar
class MdcSnackbarInfo extends MdcSnackbarRef {
    /** @internal */
    public _action: Subject<void> = new Subject();
    /** @internal */
    public _opened: Subject<void> = new Subject();
    /** @internal */
    public _closed: Subject<string> = new Subject();

    constructor(public message: MdcSnackbarMessage) {
        super();
    }

    action(): Observable<void> {
        return this._action.asObservable();
    }

    afterOpened(): Observable<void> {
        return this._opened.asObservable();
    }

    afterClosed(): Observable<string> {
        return this._closed.asObservable();
    }
}

/**
 * A service for showing spec-aligned material design snackbar/toast messages.
 */
@Injectable({
    providedIn: 'root'
})
export class MdcSnackbarService {
    private onDestroy$: Subject<any> = new Subject();
    private closed: Subject<string> = new Subject<string>();
    private root: HTMLElement | null = null;
    private label: HTMLElement | null = null;
    private actionButton: HTMLElement | null = null;
    private actionLabel: HTMLElement | null = null;
    private adapter: MDCSnackbarAdapter = {
        addClass: (name) => this.root!.classList.add(name),
        announce: () => announce(this.label!, this.label!),
        notifyClosed: (reason) => this.closed.next(reason),
        notifyClosing: () => {},
        notifyOpened: () => this.current?._opened.next(),
        notifyOpening: () => {},
        removeClass: (name) => this.root!.classList.remove(name)
    };
    private handleActionClick = (evt: MouseEvent) => {
        try {
            (this.queue.length > 0) && this.queue[0]._action.next();
        } finally {
            this.foundation!.handleActionButtonClick(evt);
        }
    };
    private handleKeyDown = (evt: KeyboardEvent) => this.foundation!.handleKeyDown(evt);
    private foundation: MDCSnackbarFoundation | null = null;
    private queue: MdcSnackbarInfo[] = [];
    private document: Document;

    constructor(@Inject(DOCUMENT) doc: any) {
        this.document = doc as Document;
    }

    private init() {
        if (!this.foundation) {
            this.root = this.document.createElement('div');
            this.root.classList.add('mdc-snackbar');
            let surface = this.document.createElement('div');
            surface.classList.add('mdc-snackbar__surface');
            this.root.appendChild(surface);
            this.label = this.document.createElement('div');
            this.label.setAttribute('role', 'status');
            this.label.setAttribute('aria-live', 'polite');
            this.label.classList.add('mdc-snackbar__label');
            surface.appendChild(this.label);
            let actions = this.document.createElement('div');
            actions.classList.add('mdc-snackbar__actions');
            surface.appendChild(actions);
            this.actionButton = this.document.createElement('button');
            this.actionButton.classList.add('mdc-button');
            this.actionButton.classList.add('mdc-snackbar__action');
            this.actionButton.setAttribute('type', 'button');
            actions.appendChild(this.actionButton);
            let ripple = this.document.createElement('div');
            ripple.classList.add('mdc-button__ripple');
            this.actionButton.appendChild(ripple);
            this.actionLabel = this.document.createElement('span');
            this.actionLabel.classList.add('mdc-button__label');
            this.actionButton.appendChild(this.actionLabel);
            this.document.body.appendChild(this.root);
            this.foundation = new MDCSnackbarFoundation(this.adapter);

            this.actionButton.addEventListener('click', this.handleActionClick);
            this.root.addEventListener('keydown', this.handleKeyDown);

            this.closed.pipe(takeUntil(this.onDestroy$)).subscribe(reason => this.closeCurrent(reason));
        }
    }

    /** @internal */
    onDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        if (this.foundation) {
            this.actionButton!.removeEventListener('click', this.handleActionClick);
            this.root!.removeEventListener('keydown', this.handleKeyDown);
            this.foundation.destroy();
            this.root!.parentElement!.removeChild(this.root!);
            this.root = null;
            this.label = null;
            this.actionButton = null;
            this.actionLabel = null;
        }
    }

    /**
     * Show a snackbar/toast message. If a snackbar message is already showing, the new
     * message will be queued to show after earlier message have been shown.
     * The returned `MdcSnackbarRef` provides methods to subscribe to opened, closed, and 
     * action click events.
     * 
     * @param message Queue a snackbar message to show.
     */
    show(message: MdcSnackbarMessage): MdcSnackbarRef {
        if (!message)
            throw new Error('message parameter is not set in call to MdcSnackbarService.show');
        this.init();
        const ref = new MdcSnackbarInfo(message);
        this.queue.push(ref);
        if (this.queue.length === 1) {
            // showing needs to be triggered after snackbarRef is returned to caller,
            // so that caller can subscribe to `afterShow` before it is triggered:
            Promise.resolve().then(() => {
                this.showNext();
            });
        }
        return ref;
    }

    private showNext() {
        if (this.queue.length === 0)
            return;
        const info = this.queue[0];
        this.label!.textContent = info.message.message || '';
        this.actionLabel!.textContent = info.message.actionText || '';
        if (info.message.stacked)
            this.root!.classList.add(CLASS_STACKED);
        else
            this.root!.classList.remove(CLASS_STACKED);
        try {
            this.foundation!.setTimeoutMs(info.message.timeout || numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS);
        } catch (error) {
            console.warn(error.message);
            this.foundation!.setTimeoutMs(numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS);
        }
        this.foundation!.open();
    }

    private closeCurrent(reason: string) {
        const info = this.queue.shift();
        info!._closed.next(reason);
        info!._opened.complete();
        info!._action.complete();
        info!._closed.complete();
        if (this.queue.length > 0)
            this.showNext();
    }

    private get current() {
        return this.queue.length > 0 ? this.queue[0] : null;
    }

    /**
     * Set this property to true to show snackbars start-aligned instead of center-aligned. Desktop and tablet only.
     */
    get leading(): boolean {
        return this.foundation ? this.root!.classList.contains(CLASS_LEADING) : false;
    }

    set leading(value: boolean) {
        this.init();
        if (value)
            this.root!.classList.add(CLASS_LEADING);
        else
            this.root!.classList.remove(CLASS_LEADING);
    }

    /**
     * By default the snackbar closes when the user presses ESC, while it's focused. Set this to
     * false to not close the snackbar when the user presses ESC.
     */
    get closeOnEscape(): boolean {
        return this.foundation ? this.foundation.getCloseOnEscape() : true;
    }

    set closeOnEscape(value: boolean) {
        this.init();
        this.foundation!.setCloseOnEscape(!!value);
    }
}
