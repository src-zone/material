import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, forwardRef } from '@angular/core';
import { MDCRipple } from '@material/ripple';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';

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

    @HostBinding('class.mdc-button--compact') @Input()
    get mdcCompact() {
        return this._compact;
    }

    set mdcCompact(val: any) {
        this._compact = asBoolean(val);
    }

    @HostBinding('class.mdc-button--dense') @Input()
    get mdcDense() {
        return this._dense;
    }

    set mdcDense(val: any) {
        this._dense = asBoolean(val);
    }

    @HostBinding('class.mdc-button--stroked') @Input()
    get mdcStroked() {
        return this._stroked;
    }

    set mdcStroked(val: any) {
        this._stroked = asBoolean(val);
    }

    @HostBinding('class.mdc-button--raised') @Input()
    get mdcRaised() {
        return this._raised;
    }

    set mdcRaised(val: any) {
        this._raised = asBoolean(val);
    }

    activateInputRipple() {
        if (this._ripple)
            this._ripple.activate();
    }
    
    deactivateInputRipple() {
        if (this._ripple)
            this._ripple.deactivate();
    }
}
