import { AfterContentInit, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, Input,
    OnDestroy, OnInit, Optional, Output, QueryList, Renderer2, Self, Inject, HostListener, forwardRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MDCDialogFoundation, MDCDialogAdapter, util, cssClasses } from '@material/dialog';
import { matches } from '@material/dom/ponyfill'
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { MdcButtonDirective } from '../button/mdc.button.directive';
import { AbstractMdcFocusInitial, AbstractMdcFocusTrap, FocusTrapHandle } from '../focus-trap/abstract.mdc.focus-trap';
import { HasId } from '../abstract/mixin.mdc.hasid';
import { applyMixins } from '../../utils/mixins';

class MdcDialogTitleDirectiveBase {}
interface MdcDialogTitleDirectiveBase extends HasId {}
applyMixins(MdcDialogTitleDirectiveBase, [HasId]);
/**
 * Directive for the title of an `mdcDialog`.
 * A title is optional. If used, it should be the first child of an `mdcDialogSurface`.
 * Please note that there should be no whitespace separating the start/end tag and the title
 * itself. (The easiest way to achieve this is to *not* set the `preserveWhitespaces` option to
 * `true` the `angularCompilerOptions`).
 */
@Directive({
    selector: '[mdcDialogTitle]'
})
export class MdcDialogTitleDirective extends MdcDialogTitleDirectiveBase implements OnInit {
    @HostBinding('class.mdc-dialog__title') _cls = true;

    ngOnInit() {
        this.initId();
    }
}

class MdcDialogContentDirectiveBase {}
interface MdcDialogContentDirectiveBase extends HasId {}
applyMixins(MdcDialogContentDirectiveBase, [HasId]);
/**
 * Directive for the content part of an `mdcDialog`.
 * This should be added as a child element of an `mdcDialogSurface`.
 */
@Directive({
    selector: '[mdcDialogContent]'
})
export class MdcDialogContentDirective extends MdcDialogContentDirectiveBase implements OnInit {
    @HostBinding('class.mdc-dialog__content') _cls = true;

    constructor(public _elm: ElementRef) {
        super();
    }

    ngOnInit() {
        this.initId();
    }
}

/**
 * Directive for the actions (footer) of an `mdcDialog`.
 * This is an (optional) last child of the `mdcDialogSurface` directive.
 * This directive should contain buttons, for that should use the `mdcButton`
 * directive.
 * 
 * Action buttons should typically close the dialog, and should therefore
 * also set a value for the `mdcDialogTrigger` directive.
 */
@Directive({
    selector: '[mdcDialogActions]',
})
export class MdcDialogActionsDirective implements AfterContentInit {
    @HostBinding('class.mdc-dialog__actions') _cls = true;
    @ContentChildren(MdcButtonDirective, {descendants: true}) _buttons: QueryList<MdcButtonDirective>;

    constructor(private _rndr: Renderer2) {
    }

    ngAfterContentInit() {
        this.initButtons();
        this._buttons.changes.subscribe(() => {
            this.initButtons();
        });
    }

    private initButtons() {
        this._buttons.forEach(btn => {
            this._rndr.addClass(btn._elm.nativeElement, 'mdc-dialog__button');
        });
    }
}

/**
 * Any element within a dialog may include this directive (and assigne a non empty value to it)
 * to indicate that interacting with it should close the dialog with the specified action.
 * 
 * This action is then reflected via the `action` field in the `closing` and `closed` events of
 * the dialog. A value of `close` will also trigger the `cancel` event of the dialog, and a value of
 * `accept` will trigger the `accept` event.
 * 
 * Any action buttons within the dialog that equate to a dismissal with no further action should
 * use set `mdcDialogTrigger="close"`. This will make it easy to handle all such interactions consistently
 * (via either the `cancel`, `closing`, or `closed` events), while separately handling other actions.
 */
@Directive({
    selector: '[mdcDialogTrigger]'
})
export class MdcDialogTriggerDirective {
    constructor(public _elm: ElementRef) {
    }

    /**
     * Set the `action` value that should be send to `closing` and `closed` events when a user
     * interacts with this element. (When set to an empty string the button/element will not be wired
     * to close the dialog).
     */
    @Input() readonly mdcDialogTrigger: string;
}

/**
 * This directive can be used to mark one of the dialogs action buttons as the default action.
 * This action will then be triggered by pressing the enter key while the dialog has focus.
 * The default action also will receive focus when the dialog is opened. Unless another
 * element within the dialog has the `mdcFocusInitial` directive.
 */
@Directive({
    selector: '[mdcDialogDefault]',
    providers: [{provide: AbstractMdcFocusInitial, useExisting: forwardRef(() => MdcDialogDefaultDirective) }]
})
export class MdcDialogDefaultDirective extends AbstractMdcFocusInitial {
    /** @docs-private */ readonly priority = 0; // must be lower than prio of MdcFocusInitialDirective

    constructor(public _elm: ElementRef) {
        super();
    }
}

/**
 * Directive for the surface of a dialog. The surface contains the actual content of a dialog,
 * wrapped in elements with the `mdcDialogHeader`, `mdcDialogContent`, and `mdcDialogActions`
 * directives.
 * 
 * # Accessibility
 * * The role attribute will be set to `alertdialog` by default
 * * The `aria-modal` attribute will be set to `true` by default
 * * If there is an `mdcDialogTitle`, the `aria-labelledBy` attribute will be set to the id
 *   of that element (and a unique id will be assigned to it, if none was provided)
 * * If there is an `mdcDialogContent`, the `aria-describedby` attribute will be set to the
 *   id of that element (and a unique id will be assigned to it, if none was provided)
 */
@Directive({
    selector: '[mdcDialogSurface]'
})
export class MdcDialogSurfaceDirective {
    @HostBinding('class.mdc-dialog__surface') _cls = true;
    @HostBinding('attr.role') _role = 'alertdialog';
    @HostBinding('attr.aria-modal') _modal = 'true';
    @HostBinding('attr.aria-labelledby') _labelledBy = null;
    @HostBinding('attr.aria-describedby') _describedBy = null;
    @ContentChildren(MdcDialogTitleDirective) _titles: QueryList<MdcDialogTitleDirective>;
    @ContentChildren(MdcDialogContentDirective) _contents: QueryList<MdcDialogContentDirective>;

    ngAfterContentInit() {
        this._titles.changes.subscribe(() => this.setAriaLabels());
        this._contents.changes.subscribe(() => this.setAriaLabels());
        this.setAriaLabels();
    }

    private setAriaLabels() {
        this._labelledBy = this._titles?.first?.id;
        this._describedBy = this._contents?.first?.id;
    }
}

/**
 * This directive should be the first child of an `mdcDialog`, and contains the `mdcDialogSurface`.
 */
@Directive({
    selector: '[mdcDialogContainer]'
})
export class MdcDialogContainerDirective {
    @HostBinding('class.mdc-dialog__container') _cls = true;
}

/**
 * Directive for the backdrop of a dialog. The backdrop provides the styles for overlaying the
 * page content when the dialog is opened. This guides user attention to the dialog.
 */
@Directive({
    selector: '[mdcDialogScrim]'
})
export class MdcDialogScrimDirective {
    @HostBinding('class.mdc-dialog__scrim') _cls = true;
}

/**
 * Directive for creating a modal dialog with Material Design styling. The dialog should have two
 * child elements: a surface (marked with the <code>mdcDialogSurface</code> directive), and a
 * backdrop (marked with the <code>mdcDialogBackdrop</code> directive).
 * 
 * When the dialog is opened, it will activate a focus trap on the elements within the dialog,
 * so that the surface behind the dialog is not accessible. See `mdcFocusTrap` for more information.
 */
@Directive({
    selector: '[mdcDialog]',
    exportAs: 'mdcDialog'
})
export class MdcDialogDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-dialog') _cls = true;
    @ContentChild(MdcDialogSurfaceDirective) _surface: MdcDialogSurfaceDirective;
    @ContentChildren(MdcDialogTriggerDirective, {descendants: true}) _triggers: QueryList<MdcDialogTriggerDirective>;
    @ContentChildren(MdcDialogContentDirective, {descendants: true}) _contents: QueryList<MdcDialogContentDirective>;
    @ContentChildren(MdcDialogActionsDirective, {descendants: true}) _footers: QueryList<MdcDialogActionsDirective>;
    @ContentChildren(MdcDialogDefaultDirective, {descendants: true}) _defaultActions: QueryList<MdcDialogDefaultDirective>;
    /**
     * Event emitted when the user accepts the dialog, e.g. by pressing enter or clicking the button
     * with `mdcDialogTrigger="accept"`.
     */
    @Output() accept: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted when the user cancels the dialog, e.g. by clicking outside the dialog, pressing the escape key,
     * or clicking an element with `mdcDialogTrigger="close"`.
     */
    @Output() cancel: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted when the dialog starts opening.
     */
    @Output() opening: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted when the dialog is opened.
     */
    @Output() opened: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted when the dialog starts closing. The 'action' field contains the reason for closing, see
     * `mdcDialogTrigger` for more information.
     */
    @Output() closing: EventEmitter<{action: string}> = new EventEmitter();
    /**
     * Event emitted when the dialog is closed. The 'action' field contains the reason for closing, see
     * `mdcDialogTrigger` for more information.
     */
    @Output() closed: EventEmitter<{action: string}> = new EventEmitter();
    private _onDocumentKeydown = (event) => this.onDocumentKeydown(event);
    private focusTrapHandle: FocusTrapHandle;
    private mdcAdapter: MDCDialogAdapter = {
        addClass: (className: string) => this._rndr.addClass(this._elm.nativeElement, className),
        removeClass: (className: string) => this._rndr.removeClass(this._elm.nativeElement, className),
        addBodyClass: (className: string) => this._rndr.addClass(this.document.body, className),
        removeBodyClass: (className: string) => this._rndr.removeClass(this.document.body, className),
        areButtonsStacked: () => this._footers?.first ? util.areTopsMisaligned(this._footers.first?._buttons.map(b => b._elm.nativeElement)) : false,
        clickDefaultButton: () => this._defaultActions?.first?._elm.nativeElement.click(),
        eventTargetMatches: (target, selector) => target ? matches(target as Element, selector) : false,
        getActionFromEvent: (evt: Event) => {
            const action = this.closest(evt.target as Element, this._triggers.toArray());
            return action?.mdcDialogTrigger;
        },
        getInitialFocusEl: () => null, // ignored in our implementation. mdcFocusTrap determines this by itself
        hasClass: (className) => {
            if (className === cssClasses.STACKED)
                return false; // currently not supporting (auto-)stacking of buttons
            return this._elm.nativeElement.classList.contains(className);
        },
        isContentScrollable: () => util.isScrollable(this._content?._elm.nativeElement),
        notifyClosed: (action) => {
            this.closed.emit({action});
        },
        notifyClosing: (action) => {
            this.document.removeEventListener('keydown', this._onDocumentKeydown);
            this.closing.emit({action});
            if (action === 'accept')
                this.accept.emit();
            else if (action === 'close')
                this.cancel.emit();
        },
        notifyOpened: () => {
            this.opened.emit();
        },
        notifyOpening: () => {
            this.document.addEventListener('keydown', this._onDocumentKeydown);
            this.opening.emit();
        },
        releaseFocus: () => this.untrapFocus(),
        // we're currently not supporting auto-stacking, cause we can't just reverse buttons in the dom
        // and expect that to not break stuff in angular:
        reverseButtons: () => undefined,
        trapFocus: () => this.trapFocus()
    };
    private foundation: MDCDialogFoundation;
    private document: Document;

    constructor(private _elm: ElementRef, private _rndr: Renderer2, private _registry: MdcEventRegistry,
        @Optional() @Self() private _focusTrap: AbstractMdcFocusTrap,
        @Inject(DOCUMENT) doc: any) {
            this.document = doc as Document; // work around ngc issue https://github.com/angular/angular/issues/20351
    }

    ngAfterContentInit() {
        this.foundation = new MDCDialogFoundation(this.mdcAdapter);
        this.foundation.init();
        this.foundation.setAutoStackButtons(false); // currently not supported
    }

    ngOnDestroy() {
        this.document.removeEventListener('click', this._onDocumentKeydown);
        this.foundation.destroy();
        this.foundation = null;
    }

    /**
     * Call this method to open the dialog.
     */
    open() {
        this.foundation.open();
    }

    /**
     * Call this method to close the dialog with the specified action, e.g. `accept` to indicate an acceptance action
     * (and trigger the `accept` event), or `close` to indicate dismissal (and trigger the `cancel` event).
     */
    close(action = 'close') {
        this.foundation.close(action);
    }

    /**
     * Recalculates layout and automatically adds/removes modifier classes (for instance to detect if the dialog content
     * should be scrollable)
     */
    layout() {
        this.foundation.layout();
    }

    private trapFocus() {
        this.untrapFocus();
        if (this._focusTrap)
            this.focusTrapHandle = this._focusTrap.trapFocus();
    }

    private untrapFocus() {
        if (this.focusTrapHandle && this.focusTrapHandle.active) {
            this.focusTrapHandle.untrap();
            this.focusTrapHandle = null;
        }
    }

    /** @docs-private */
    @HostListener('click', ['$event']) onClick(event: MouseEvent) {
        this.foundation?.handleClick(event);
    }

    /** @docs-private */
    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
        this.foundation?.handleKeydown(event);
    }

    /** @docs-private */
    onDocumentKeydown(event: KeyboardEvent) {
        this.foundation?.handleDocumentKeydown(event);
    }

    private get _content() {
        return this._contents.first;
    }

    private closest(elm: Element, choices: MdcDialogTriggerDirective[]) {
        let match: Element | null = elm;
        while (match && match !== this._elm.nativeElement) {
            for (let i = 0; i != choices.length; ++i) {
                if (choices[i]._elm.nativeElement === match)
                    return choices[i];
            }
            match = match.parentElement;
        }
        return null;
    }
}

export const DIALOG_DIRECTIVES = [
    MdcDialogDirective, MdcDialogTitleDirective, MdcDialogContentDirective, MdcDialogSurfaceDirective, MdcDialogContainerDirective,
    MdcDialogActionsDirective, MdcDialogTriggerDirective, MdcDialogDefaultDirective, MdcDialogScrimDirective
];
