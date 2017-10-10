import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, forwardRef } from '@angular/core';
import { MDCRipple } from '@material/ripple';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';

/**
 * Material design button. Anchors can also be styled as buttons with this directive.
 * Defaults to a button that is flushed with the surface.
 * Use the input modifiers to alter the styling, or create your own style
 * based on the provided sass-mixins.
 */
@Directive({
    selector: 'button[mdcButton],a[mdcButton]',
    providers: [{provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcButtonDirective) }]
})
export class MdcButtonDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-button') _hasHostClass = true;
    private _compact = false;
    private _dense = false;
    private _primary = false;
    private _accent = false;
    private _raised = false;
    private _stroked = false;
    private _ripple: { destroy: Function, activate: Function, deactivate: Function };

    constructor(private elementRef: ElementRef) {
        super();
    }

    ngAfterContentInit() {
        this._ripple = MDCRipple.attachTo(this.elementRef.nativeElement);
    }

    ngOnDestroy() {
        if (this._ripple)
            this._ripple.destroy();
    }

    /**
     * When this input is defined and does not have value false, the button will be elevated
     * upon the surface.
     */
    @HostBinding('class.mdc-button--raised') @Input()
    get mdcRaised() {
        return this._raised;
    }

    set mdcRaised(val: any) {
        this._raised = asBoolean(val);
    }

    /**
     * When this input is defined and does not have value false, the button will be styled 
     * flush with the surface and have a visible border.
     */
    @HostBinding('class.mdc-button--stroked') @Input()
    get mdcStroked() {
        return this._stroked;
    }

    set mdcStroked(val: any) {
        this._stroked = asBoolean(val);
    }

    /**
     * When this input is defined and does not have value false, the amount of horizontal padding
     * in the button will be reduced.
     */
    @HostBinding('class.mdc-button--compact') @Input()
    get mdcCompact() {
        return this._compact;
    }

    set mdcCompact(val: any) {
        this._compact = asBoolean(val);
    }

    /**
     * When this input is defined and does not have value false, the button text is compressed
     * to make it slightly smaller.
     */
    @HostBinding('class.mdc-button--dense') @Input()
    get mdcDense() {
        return this._dense;
    }

    set mdcDense(val: any) {
        this._dense = asBoolean(val);
    }

    /** @docs-private TODO not stable */
    activateInputRipple() {
        if (this._ripple)
            this._ripple.activate();
    }
    
    /** @docs-private TODO not stable */
    deactivateInputRipple() {
        if (this._ripple)
            this._ripple.deactivate();
    }
}
