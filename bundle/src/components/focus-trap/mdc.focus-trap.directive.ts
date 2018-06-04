import { ContentChildren, Directive, ElementRef, HostBinding,
    Input, OnDestroy, QueryList, forwardRef } from '@angular/core';
import createFocusTrap from 'focus-trap';
import { Options, FocusTrap } from "focus-trap";
import { asBoolean, asBooleanOrNull } from '../../utils/value.utils';
import { AbstractMdcFocusTrap, AbstractMdcFocusInitial, FocusTrapHandle } from './abstract.mdc.focus-trap';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

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

/** @docs-private */
class FocusTrapHandleImpl implements FocusTrapHandle {
    private _active = true;
    private trap: FocusTrap;

    constructor(public _elm: ElementRef, options: Options) {
        options.onActivate = () => { this._active = true; activeTrap = this; };
        options.onDeactivate = () => { this._active = false; activeTrap = null; };
        this.trap = createFocusTrap(_elm.nativeElement, options);
        this.trap.activate();
    }

    untrap() {
        this.trap.deactivate();
    }

    get active() {
        return this._active;
    }
}

let activeTrap: FocusTrapHandleImpl = null;

/**
 * Directive for trapping focus (by key and/or mouse input) inside an element. To be used
 * for e.g. modal dialogs, where focus must be constrained for an accesssible experience.
 * Use <code>mdcFocusInitial</code> on a child element if a specific element needs to get
 * focus upon activation of the trap. In the absense of an <code>mdcFocusInitial</code>,
 * or when that element can't be focused, the focus trap will activate the first tabbable
 * child element of the focus trap.
 */
@Directive({
    selector: '[mdcFocusTrap]',
    providers: [{provide: AbstractMdcFocusTrap, useExisting: forwardRef(() => MdcFocusTrapDirective) }]
})
export class MdcFocusTrapDirective extends AbstractMdcFocusTrap implements OnDestroy {
    private _untrapOnOutsideClick = false;
    private _ignoreEscape = false;
    @ContentChildren(AbstractMdcFocusInitial, {descendants: true}) _focusInitial: QueryList<AbstractMdcFocusInitial>;
    
    constructor(private _elm: ElementRef) {
        super();
    }

    ngOnDestroy() {
        // if this element is destroyed, it must not leave the trap in activated state:
        if (activeTrap && activeTrap._elm.nativeElement === this._elm.nativeElement)
            activeTrap.untrap();
    }

    /** @docs-private */
    trapFocus(): FocusTrapHandle {
        if (activeTrap)
            // Currently stacking focus tracks (i.e. changing to another focus trap, and returning
            // to the previous on deactivation) is not yet supported. Will be in a future release:
            throw new Error('An mdcFocusTrap is already active.');
        let options: Options = {
            clickOutsideDeactivates: this._untrapOnOutsideClick,
            escapeDeactivates: !this._ignoreEscape,
        };
        if (this._focusInitial.length > 0) {
            let fi: AbstractMdcFocusInitial = null;
            this._focusInitial.forEach(focus => fi = (fi == null || fi.priority <= focus.priority) ? focus : fi);
            if (fi)
                options.initialFocus = fi._elm.nativeElement;
        }
        return new FocusTrapHandleImpl(this._elm, options);
    }

    /**
     * Set this property to have clicks outside the focus area untrap the focus.
     * The value is taken when the trap is activated. Thus changing the value
     * while a focus trap is active does not affect the behavior of that focus trap.
     */
    @Input() get untrapOnOutsideClick() {
        return this._untrapOnOutsideClick;
    }

    set untrapOnOutsideClick(value: any) {
        this._untrapOnOutsideClick = asBoolean(value);
    }

    /**
     * Set this property to ignore the escape key. The default is to deactivate the
     * trap when a user presses the escape key.
     * The value is taken when the trap is activated. Thus changing the value
     * while a focus trap is active does not affect the behavior of that focus trap.
     */
    @Input() get ignoreEscape() {
        return this._ignoreEscape;
    }

    set ignoreEscape(value: any) {
        this._ignoreEscape = asBoolean(value);
    }
}

export const FOCUS_TRAP_DIRECTIVES = [
    MdcFocusInitialDirective, MdcFocusTrapDirective
];
