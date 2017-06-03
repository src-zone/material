import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, forwardRef } from '@angular/core';
import { MDCRipple } from '@material/ripple';
import { asBoolean } from '../../utils';
import { AbstractMdcRipple } from '../ripple';

@Directive({
    selector: '[mdcFabIcon]'
})
export class MdcFabIconDirective {
    @HostBinding('class.mdc-fab__icon') _hasHostClass = true;
}

@Directive({
    selector: '[mdcFab]',
    providers: [{provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcFabDirective) }]
})
export class MdcFabDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-fab') _hasHostClass = true;
    private _mini = false;
    private _plain = false;
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

    @HostBinding('class.mdc-fab--mini') @Input()
    get mdcMini() {
        return this._mini;
    }

    set mdcMini(val: any) {
        this._mini = asBoolean(val);
    }

    @HostBinding('class.mdc-fab--plain') @Input()
    get mdcPlain() {
        return this._mini;
    }

    set mdcPlain(val: any) {
        this._mini = asBoolean(val);
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
