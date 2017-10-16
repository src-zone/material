import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, Renderer2, forwardRef } from '@angular/core';
import { MDCRipple } from '@material/ripple';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

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
    private _exited = false;

    constructor(private elementRef: ElementRef, renderer: Renderer2, registry: MdcEventRegistry) {
        super(elementRef, renderer, registry);
    }

    ngAfterContentInit() {
        this.initRipple();
    }

    ngOnDestroy() {
        this.destroyRipple();
    }

    @HostBinding('class.mdc-fab--mini') @Input()
    get mdcMini() {
        return this._mini;
    }

    set mdcMini(val: any) {
        this._mini = asBoolean(val);
    }

    @HostBinding('class.mdc-fab--exited') @Input()
    get mdcExited() {
        return this._exited;
    }

    set mdcExited(val: any) {
        this._exited = asBoolean(val);
    }
}
