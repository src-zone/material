import { AfterContentInit, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, Input,
    OnDestroy, Optional, Output, QueryList, Renderer2, Self, forwardRef } from '@angular/core';
import { MDCDialogFoundation } from '@material/dialog';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { asBoolean } from '../../utils/value.utils';
import { MdcButtonDirective } from '../button/mdc.button.directive';
import { AbstractMdcFocusInitial, AbstractMdcFocusTrap, FocusTrapHandle } from '../focus-trap/abstract.mdc.focus-trap';
import { MdcDialogAdapter } from './mdc.dialog.adapter';

// Note: class mdc-dialog__action not used, since it currently doesn't do anything in MCW anyway:
//  the CSS-rules for this in dialog.scss have lower specifity than those of mdc_button itself,
//  so the secondary color never gets applied.

/**
 * Directive for the title of a dialog (<code>mdcDialog</code>).
 * This should be used for the child of an element with the <code>mdcDialogHeader</code>
 * directive.
 */
@Directive({
    selector: '[mdcDialogHeaderTitle]'
})
export class MdcDialogHeaderTitleDirective {
    @HostBinding('class.mdc-dialog__header__title') _cls = true;
}

/**
 * Directive for the header of a dialog (<code>mdcDialog</code>).
 * This should be used on the first child element of an <code>mdcDialogSurface</code>
 * directive. Add the title of the dialog in a child element with the
 * <code>mdcDialogHeaderTitle</code> directive.
 */
@Directive({
    selector: '[mdcDialogHeader]'
})
export class MdcDialogHeaderDirective {
    @HostBinding('class.mdc-dialog__header') _cls = true;
}

/**
 * Directive for the body part of a dialog (<code>mdcDialog</code>).
 * This should be added to a child element of an <code>mdcDialogSurface</code>
 * directive.
 */
@Directive({
    selector: '[mdcDialogBody]'
})
export class MdcDialogBodyDirective {
    @HostBinding('class.mdc-dialog__body') _cls = true;
    private _scrollable = false;

    constructor(public _elm: ElementRef) {
    }

    /**
     * Set this property to true for dialog content that won't be able to fit the screen
     * without scrolling. It will give the body a max-height, and thus (when necessary) will
     * make the content scrollable.
     * The <code>max-height</code> value that is applied can be overridden via the
     * <code>.mdc-dialog__body--scrollable</code> selector in CSS.
     */
    @HostBinding('class.mdc-dialog__body--scrollable') @Input()
    get scrollable() {
        return this._scrollable;
    }

    set scrollable(val: any) {
        this._scrollable = asBoolean(val);
    }
}

/**
 * Directive for footer of a dialog (<code>mdcDialog</code>).
 * This should be added to a child element of an <code>mdcDialogSurface</code>
 * directive.
 * The footer typically contains buttons, for which the <code>mdcButton</code>
 * directive should be used. Cancel and accept buttons should also be marked
 * with an <code>mdcDialogCancel</code> or <code>mdcDialogAccept</code>
 * directive.
 */
@Directive({
    selector: '[mdcDialogFooter]',
})
export class MdcDialogFooterDirective implements AfterContentInit {
    @HostBinding('class.mdc-dialog__footer') _cls = true;
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
            this._rndr.addClass(btn._elm.nativeElement, 'mdc-dialog__footer__button');
        });
    }
}

/**
 * Directive to mark the accept button of a <code>mdcDialog</code>. This directive should
 * be used in combination with the <code>mdcButton</code> directive. Accept button presses
 * trigger the <code>accept</code> event on the dialog.
 * </p><p>
 * When the dialog is marked with the <code>mdcFocusTrap</code> directive, the focus trap will
 * focus this button when activated. If you want to focus another element in the dialog
 * instead, add the <code>mdcFocusInitial</code> directive to that element.
 */
@Directive({
    selector: '[mdcDialogAccept]',
    providers: [{provide: AbstractMdcFocusInitial, useExisting: forwardRef(() => MdcDialogAcceptDirective) }]
})
export class MdcDialogAcceptDirective extends AbstractMdcFocusInitial {
    readonly priority = 1;
    @HostBinding('class.mdc-dialog__footer__button--accept') _cls = true;

    constructor(public _elm: ElementRef) {
        super();
    }
}

/**
 * Directive to mark the cancel button of a <code>mdcDialog</code>. This directive should
 * be used in combination with the <code>mdcButton</code> directive. Cancel button presses
 * trigger the <code>cancel</code> event on the dialog.
 */
@Directive({
    selector: '[mdcDialogCancel]'
})
export class MdcDialogCancelDirective {
    @HostBinding('class.mdc-dialog__footer__button--cancel') _cls = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * Directive for the backdrop of a dialog. The backdrop provides the styles for overlaying the
 * page content when the dialog is opened. This guides user attention to the dialog.
 */
@Directive({
    selector: '[mdcDialogBackdrop]'
})
export class MdcDialogBackdropDirective {
    @HostBinding('class.mdc-dialog__backdrop') _cls = true;
}

/**
 * Directive for the surface of a dialog. The surface contains the actual comtent of a dialog,
 * wrapped in elements with the <code>mdcDialogHeader</code>, <code>mdcDialogBody</code>,
 * and <code>mdcDialogFooter</code> directives.
 */
@Directive({
    selector: '[mdcDialogSurface]'
})
export class MdcDialogSurfaceDirective {
    @HostBinding('class.mdc-dialog__surface') _cls = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * Directive for creating a modal dialog with Material Design styling. The dialog should have two
 * child elements: a surface (marked with the <code>mdcDialogSurface</code> directive), and a
 * backdrop (marked with the <code>mdcDialogBackdrop</code> directive).
 * </p><p>
 * For an accessible user experience, the surface behind the dialog should not be accessible.
 * This can be achieved by adding the <code>mdcFocusTrap</code> directive to the dialog element
 * as well.
 */
@Directive({
    selector: '[mdcDialog]',
    exportAs: 'mdcDialog'
})
export class MdcDialogDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-dialog') _cls = true;
    @ContentChild(MdcDialogSurfaceDirective) _surface: MdcDialogSurfaceDirective;
    @ContentChildren(MdcDialogAcceptDirective, {descendants: true}) _accept: QueryList<MdcDialogAcceptDirective>;
    @ContentChildren(MdcDialogCancelDirective, {descendants: true}) _cancel: QueryList<MdcDialogCancelDirective>;
    /**
     * Event emitted when the user accepts the dialog, e.g. by clicking the accept (<code>mdcDialogAccept</code>)
     * button.
     */
    @Output() accept: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted when the user cancels the dialog, e.g. by clicking the cancel (<code>mdcDialogCancel</code>)
     * button, or by pressing the Escape key (for dialogs with a focus-trap that is configured to close on Escape)
     */
    @Output() cancel: EventEmitter<void> = new EventEmitter();
    private _initialized = false;
    private focusTrapHandle: FocusTrapHandle;
    private mdcAdapter: MdcDialogAdapter = {
        addClass: (className: string) => this._rndr.addClass(this._elm.nativeElement, className),
        removeClass: (className: string) => this._rndr.removeClass(this._elm.nativeElement, className),
        addBodyClass: (className: string) => this._rndr.addClass(document.body, className),
        removeBodyClass: (className: string) => this._rndr.removeClass(document.body, className),
        eventTargetHasClass: (target: HTMLElement, className: string) => {
            if (className === 'mdc-dialog__footer__button--accept')
                return this._accept.find((e) => e._elm.nativeElement === target) != null;
            else if (className === 'mdc-dialog__footer__button--cancel')
                return this._cancel.find((e) => e._elm.nativeElement === target) != null;
            return target.classList.contains(className);
        },
        registerInteractionHandler: (evt: string, handler: EventListener) => this._registry.listen(this._rndr, evt, handler, this._elm),
        deregisterInteractionHandler: (evt: string, handler: EventListener) => this._registry.unlisten(evt, handler),
        registerSurfaceInteractionHandler: (evt: string, handler: EventListener) => {
            if (this._surface)
                this._registry.listen(this._rndr, evt, handler, this._surface._elm);

        },
        deregisterSurfaceInteractionHandler: (evt: string, handler: EventListener) => this._registry.unlisten(evt, handler),
        registerDocumentKeydownHandler: (handler: EventListener) => this._registry.listenElm(this._rndr, 'keydown', handler, document.body),
        deregisterDocumentKeydownHandler: (handler: EventListener) => this._registry.unlisten('keydown', handler),
        registerTransitionEndHandler: (handler: EventListener) => {
            if (this._surface)
                this._registry.listen(this._rndr, 'transitionend', handler, this._surface._elm);
        },
        deregisterTransitionEndHandler: (handler: EventListener) => this._registry.unlisten('transitionend', handler),
        notifyAccept: () => this.accept.emit(),
        notifyCancel: () => this.cancel.emit(),
        trapFocusOnSurface: () => this.trapFocus(),
        untrapFocusOnSurface: () => this.untrapFocus(),
        isDialog: (el: Element) => this._surface && el === this._surface._elm.nativeElement
    };
    private foundation: {
        init: Function,
        destroy: Function,
        open: Function,
        close: Function,
        isOpen: () => boolean,
        accept(shouldNotify: boolean),
        cancel(shouldNotify: boolean)
    } = new MDCDialogFoundation(this.mdcAdapter);

    constructor(private _elm: ElementRef, private _rndr: Renderer2, private _registry: MdcEventRegistry,
        @Optional() @Self() private _focusTrap: AbstractMdcFocusTrap) {
    }

    ngAfterContentInit() {
        this.foundation.init();
        this._initialized = true;        
    }

    ngOnDestroy() {
        this._initialized = false;
        this.foundation.destroy();
    }

    /**
     * Call this method to open the dialog.
     */
    open() {
        this.foundation.open();
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
}

export const DIALOG_DIRECTIVES = [
    MdcDialogDirective, MdcDialogHeaderTitleDirective, MdcDialogHeaderDirective, MdcDialogBodyDirective,
    MdcDialogFooterDirective, MdcDialogAcceptDirective, MdcDialogCancelDirective, MdcDialogBackdropDirective, MdcDialogSurfaceDirective,
];
