import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, forwardRef } from '@angular/core';
import { MDCRipple } from '@material/ripple';
import { asBoolean } from '../../utils';
import { AbstractMdcRipple } from '../ripple';

@Directive({
    selector: 'button[mdcButton],a[mdcButton]',
    providers: [{provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcButtonDirective) }]
})
export class MdcButtonDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-button') _hasHostClass = true;
    private _compact = false;
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

    activateInputRipple() {
        if (this._ripple)
            this._ripple.activate();
    }
    
    deactivateInputRipple() {
        if (this._ripple)
            this._ripple.deactivate();
    }
}
