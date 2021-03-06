import { AfterContentInit, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding,
    Input, OnDestroy, Output, QueryList, Renderer2, Inject, Optional, Self, HostListener } from '@angular/core';
import { MDCDismissibleDrawerFoundation, MDCModalDrawerFoundation, MDCDrawerAdapter } from '@material/drawer';
import { asBoolean } from '../../utils/value.utils';
import { DOCUMENT } from '@angular/common';
import { AbstractMdcFocusTrap, FocusTrapHandle } from '../focus-trap/abstract.mdc.focus-trap';
import { MdcListItemDirective } from '../list/mdc.list.directive';

/**
 * Directive for the title of a drawer. The use of this directive is optional.
 * If used, it should be placed as first element inside an `mdcDrawerHeader`
 */
@Directive({
    selector: '[mdcDrawerTitle]'
})
export class MdcDrawerTitleDirective {
    /** @internal */
    @HostBinding('class.mdc-drawer__title') readonly _cls = true;
}

/**
 * Directive for the subtitle of a drawer. The use of this directive is optional.
 * If used, it should be placed as a sibling element of `mdcDrawerTitle`
 * inside an `mdcDrawerHeader`
 */
@Directive({
    selector: '[mdcDrawerSubtitle]'
})
export class MdcDrawerSubtitleDirective {
    /** @internal */
    @HostBinding('class.mdc-drawer__subtitle') readonly _cls = true;
}

/**
 * A toolbar header is an optional first child of an `mdcDrawer`.
 * The header will not scroll with the rest of the drawer content, so is a
 * good place to place titles and account switchers.
 * 
 * Directives that are typically used inside an `mdcDrawerHeader`:
 * `mdcDrawerTitle`, and `mdcDrawerSubTitle`
 */
@Directive({
    selector: '[mdcDrawerHeader]'
})
export class MdcDrawerHeaderDirective {
    /** @internal */
    @HostBinding('class.mdc-drawer__header') readonly _cls = true;
}

/**
 * Directive for the drawer content. You would typically also apply the `mdcList`
 * or `mdcListGroup` directive to the drawer content (see the examples).
 */
@Directive({
    selector: '[mdcDrawerContent]'
})
export class MdcDrawerContentDirective {
    /** @internal */
    @HostBinding('class.mdc-drawer__content') readonly _cls = true;
}

@Directive({
    selector: '[mdcDrawerScrim]'
})
export class MdcDrawerScrimDirective {
    /** @internal */
    @HostBinding('class.mdc-drawer-scrim') readonly _cls = true;
}

/**
 * Directive for a (navigation) drawer. The following drawer types are
 * supported:
 * * `permanent`: the default type if none was specified.
 * * `dismissible`: the drawer is hidden by default, and can slide into view.
 *   Typically used when navigation is not common, and the main app content is
 *   prioritized.
 * * `modal`: the drawer is hidden by default. When activated, the drawer is elevated
 *   above the UI of the app. It uses a scrim to block interaction with the rest of
 *   the app with a scrim.
 * 
 * Drawers may contain an `mdcDrawerHeader`, and should contain an `mdcDrawerContent`
 * directive.
 */
@Directive({
    selector: '[mdcDrawer]'
})
export class MdcDrawerDirective implements AfterContentInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-drawer') readonly _cls = true;
    /** @internal */
    @ContentChildren(MdcListItemDirective, {descendants: true}) _items?: QueryList<MdcListItemDirective>;
    private _onDocumentClick = (event: MouseEvent) => this.onDocumentClick(event);
    private focusTrapHandle: FocusTrapHandle | null = null;
    private type: 'permanent' | 'dismissible' | 'modal' = 'permanent';
    private previousFocus: Element | HTMLOrSVGElement | null = null;
    private _open: boolean | null = null;
    private document: Document;
    private mdcAdapter: MDCDrawerAdapter = {
        addClass: (className) =>  this._rndr.addClass(this._elm.nativeElement, className),
        removeClass: (className) => this._rndr.removeClass(this._elm.nativeElement, className),
        hasClass: (className) => this._elm.nativeElement.classList.contains(className),
        elementHasClass: (element, className) => element.classList.contains(className),
        saveFocus: () => this.previousFocus = this.document.activeElement,
        restoreFocus: () => {
            const prev = this.previousFocus as HTMLOrSVGElement | null;
            if (prev && prev.focus && this._elm.nativeElement.contains(this.document.activeElement))
                prev.focus();
        },
        focusActiveNavigationItem: () => {
            const active = this._items!.find(item => item.active);
            active?._elm.nativeElement.focus();
        },
        notifyClose: () => {
            this.fixOpenClose(false);
            this.afterClosed.emit();
            this.document.removeEventListener('click', this._onDocumentClick);
        },
        notifyOpen: () => {
            this.fixOpenClose(true);
            this.afterOpened.emit();
            if (this.type === 'modal')
                this.document.addEventListener('click', this._onDocumentClick);
        },
        trapFocus: () => this.trapFocus(),
        releaseFocus: () => this.untrapFocus()
    };
    private foundation: MDCDismissibleDrawerFoundation | null = null; // MDCModalDrawerFoundation extends MDCDismissibleDrawerFoundation
    /**
     * Event emitted when the drawer is opened or closed. The event value will be
     * `true` when the drawer is opened, and `false` when the
     * drawer is closed. (When this event is triggered, the drawer is starting to open/close,
     * but the animation may not have fully completed yet)
     */
    @Output() readonly openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    /**
     * Event emitted after the drawer has fully opened. When this event is emitted the full
     * opening animation has completed, and the drawer is visible.
     */
    @Output() readonly afterOpened: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted after the drawer has fully closed. When this event is emitted the full
     * closing animation has completed, and the drawer is not visible anymore.
     */
    @Output() readonly afterClosed: EventEmitter<void> = new EventEmitter();
    
    constructor(public _elm: ElementRef, protected _rndr: Renderer2, @Inject(DOCUMENT) doc: any,
        @Optional() @Self() private _focusTrap: AbstractMdcFocusTrap) {
        this.document = doc as Document; // work around ngc issue https://github.com/angular/angular/issues/20351
    }

    ngAfterContentInit() {
        this.initDrawer();
    }

    ngOnDestroy() {
        this.destroyDrawer();
    }

    private destroyDrawer() {
        // when foundation is reconstructed and then .open() is called,
        // if these classes are still available the foundation assumes open was already called,
        // and it won't do anything:
        this._rndr.removeClass(this._elm.nativeElement, 'mdc-drawer--animate');
        this._rndr.removeClass(this._elm.nativeElement, 'mdc-drawer--closing');
        this._rndr.removeClass(this._elm.nativeElement, 'mdc-drawer--open');
        this._rndr.removeClass(this._elm.nativeElement, 'mdc-drawer--opening');
        if (this.foundation) {
            this.document.removeEventListener('click', this._onDocumentClick);
            this.foundation.destroy();
            this.foundation = null;
        }
    }

    private initDrawer() {
        this.destroyDrawer();
        let newFoundation: MDCDismissibleDrawerFoundation | null = null;
        const thiz = this;
        if (this.type === 'dismissible')
            newFoundation = new class extends MDCDismissibleDrawerFoundation{
                close() {
                    const emit = thiz._open;
                    thiz._open = false;
                    super.close();
                    emit ? thiz.openChange.emit(thiz._open) : undefined;
                }
                open() {
                    const emit = !thiz._open;
                    thiz._open = true;
                    super.open();
                    emit ? thiz.openChange.emit(thiz._open) : undefined;
                }
            }(this.mdcAdapter);
        else if (this.type === 'modal')
            newFoundation = new class extends MDCModalDrawerFoundation{
                close() {
                    const emit = thiz._open;
                    thiz._open = false;
                    super.close();
                    emit ? thiz.openChange.emit(thiz._open) : undefined;
                }
                open() {
                    const emit = !thiz._open;
                    thiz._open = true;
                    super.open();
                    emit ? thiz.openChange.emit(thiz._open) : undefined;
                }
            }(this.mdcAdapter);
        // else: permanent drawer -> doesn't need a foundation, just styling
        if (newFoundation) {
            this.foundation = newFoundation;
            newFoundation.init();
            if (this._open)
                newFoundation.open();
        }
    }

    /** @internal */
    @HostBinding('class.mdc-drawer--modal') get _isModal() {
        return this.type === 'modal';
    }

    /** @internal */
    @HostBinding('class.mdc-drawer--dismissible') get _isDismisible() {
        return this.type === 'dismissible';
    }

    /**
     * Set the type of drawer. Either `permanent`, `dismissible`, or `modal`.
     * The default type is `permanent`.
     */
    @Input() get mdcDrawer(): 'permanent' | 'dismissible' | 'modal' {
        return this.type;
    }

    set mdcDrawer(value: 'permanent' | 'dismissible' | 'modal') {
        if (value !== 'dismissible' && value !== 'modal')
            value = 'permanent';
        if (value !== this.type) {
            this.type = value;
            this.initDrawer();
        }
    }

    static ngAcceptInputType_mdcDrawer: 'permanent' | 'dismissible' | 'modal' | '';

    /**
     * Input to open (assign value `true`) or close (assign value `false`)
     * the drawer.
     */
    @Input() get open() {
        return !!this._open;
    }

    set open(value: boolean) {
        let newValue = asBoolean(value);
        if (newValue !== this._open) {
            if (this.foundation) {
                newValue ? this.foundation.open() : this.foundation.close();
            } else {
                this._open = newValue;
                this.openChange.emit(newValue);
            }
        }
    }

    static ngAcceptInputType_open: boolean | '';

    private fixOpenClose(open: boolean) {
        // the foundation ignores calls to open/close while an opening/closing animation is running.
        // so when the animation ends, we're just going to try again
        // (needs to be done in the next micro cycle, because otherwise foundation will still think it's
        // running the opening/closing animation):
        Promise.resolve().then(() => {
            if (this._open !== open) {
                if (this._open)
                    this.foundation!.open();
                else
                    this.foundation!.close();
            }
        });
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

    /** @internal */
    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
        this.foundation?.handleKeydown(event);
    }

    /** @internal */
    @HostListener('transitionend', ['$event']) handleTransitionEnd(event: TransitionEvent) {
        this.foundation?.handleTransitionEnd(event);
    }

    /** @internal */
    onDocumentClick(event: MouseEvent) {
        if (this.type === 'modal') {
            // instead of listening to click event on mdcDrawerScrim (which would require wiring between
            // mdcDrawerScrim and mdcDrawer), we just listen to document clicks.
            let el: Element | null = event.target as Element;
            while (el) {
                if (el === this._elm.nativeElement)
                    return;
                el = el.parentElement;
            }
            (this.foundation as MDCModalDrawerFoundation)?.handleScrimClick();
        }
    }
}

/**
 * Use this directive for marking the sibling element after a dismissible `mdcDrawer`.
 * This will apply styling so that the open/close animations work correctly.
 */
@Directive({
    selector: '[mdcDrawerAppContent]'
})
export class MdcDrawerAppContent {
    /** @internal */
    @HostBinding('class.mdc-drawer-app-content') _cls = true;

    /**
     * Set this to false to disable the styling for sibbling app content of a dismissible drawer.
     * This is typically only used when your `mdcDrawer` type is dynamic. In those cases you can
     * disable the `mdcDrawerAppContent` when you set your drawer type to anything other than
     * `dismissible`.
     */
    @Input() get mdcDrawerAppContent() {
        return this._cls;
    }

    set mdcDrawerAppContent(value: boolean) {
        this._cls = asBoolean(value);
    }

    static ngAcceptInputType_mdcDrawerAppContent: boolean | '';
}

export const DRAWER_DIRECTIVES = [
    MdcDrawerTitleDirective,
    MdcDrawerSubtitleDirective,
    MdcDrawerHeaderDirective,
    MdcDrawerContentDirective,
    MdcDrawerScrimDirective,
    MdcDrawerDirective,
    MdcDrawerAppContent
];
