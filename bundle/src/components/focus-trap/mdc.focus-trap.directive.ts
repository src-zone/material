import { ContentChildren, Directive, ElementRef, Input, OnDestroy, QueryList, forwardRef } from '@angular/core';
import { focusTrap } from '@material/dom';
import { AbstractMdcFocusTrap, AbstractMdcFocusInitial, FocusTrapHandle } from './abstract.mdc.focus-trap';

/**
 * When placed on a child element of an <code>mdcFocusTrap</code>, the focus trap
 * will try to move focus to this element when the focus trap is activated.
 */
@Directive({
    selector: '[mdcFocusInitial]',
    providers: [{provide: AbstractMdcFocusInitial, useExisting: forwardRef(() => MdcFocusInitialDirective) }]
})
export class MdcFocusInitialDirective extends AbstractMdcFocusInitial {
    /** @docs-private */ readonly priority = 100;

    constructor(public _elm: ElementRef) {
        super();
    }
}

let activeTrap: FocusTrapHandleImpl = null;

/** @docs-private */
class FocusTrapHandleImpl implements FocusTrapHandle {
    private _active = true;
    private trap: focusTrap.FocusTrap;

    constructor(public _elm: ElementRef, focusElm: HTMLElement, skipFocus: boolean) {
        if (activeTrap)
            // Stacking focus tracks (i.e. changing to another focus trap, and returning
            // to the previous on deactivation) is not supported:
            throw new Error('An mdcFocusTrap is already active.');
        this.trap = new focusTrap.FocusTrap(_elm.nativeElement, {
            initialFocusEl: focusElm,
            skipInitialFocus: skipFocus
        });
        this.trap.trapFocus();
        activeTrap = this;
    }

    untrap() {
        this._active = false;
        if (activeTrap === this) {
            activeTrap = null;
            this.trap.releaseFocus();
        }
    }

    get active() {
        return this._active;
    }
}

/**
 * Directive for trapping the tab key focus within an element. To be used
 * for e.g. modal dialogs, where focus must be constrained for an accesssible experience.
 * 
 * This will only trap the keyboard focus (when using tab or shift+tab). It will not prevent the focus from moving
 * out of the trapped region due to mouse interaction. You can use a background scrim element that overlays
 * the window to achieve that. (Like `mdcDialog` does).
 *
 * Use `mdcFocusInitial` on a child element if a specific element needs to get
 * focus upon activation of the trap. In the absense of an `mdcFocusInitial`,
 * or when that element can't be focused, the focus trap will activate the first tabbable
 * child element of the focus trap.
 */
@Directive({
    selector: '[mdcFocusTrap],[mdcDialog],[mdcDrawer]',
    providers: [{provide: AbstractMdcFocusTrap, useExisting: forwardRef(() => MdcFocusTrapDirective) }]
})
export class MdcFocusTrapDirective extends AbstractMdcFocusTrap implements OnDestroy {
    @ContentChildren(AbstractMdcFocusInitial, {descendants: true}) _focusInitial: QueryList<AbstractMdcFocusInitial>;
    private trap: FocusTrapHandle = null;
    
    constructor(private _elm: ElementRef) {
        super();
    }

    ngOnDestroy() {
        // if this element is destroyed, it must not leave the trap in activated state:
        if (this.trap)
            this.trap.untrap();
        this.trap = null;
    }

    /** @docs-private */
    trapFocus(): FocusTrapHandle {
        let focusInitial: AbstractMdcFocusInitial = null;
        this._focusInitial.forEach(focus => focusInitial = (focusInitial == null || focusInitial.priority <= focus.priority) ? focus : focusInitial);
        this.trap = new FocusTrapHandleImpl(this._elm, focusInitial?._elm.nativeElement, false);
        return this.trap;
    }
}

export const FOCUS_TRAP_DIRECTIVES = [
    MdcFocusInitialDirective, MdcFocusTrapDirective
];
