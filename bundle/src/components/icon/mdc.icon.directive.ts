import { AfterContentInit, Directive, ElementRef, forwardRef, HostBinding, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractMdcIcon } from './abstract.mdc.icon';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

@Directive({
    selector: '[mdcIcon]',
    providers: [{provide: AbstractMdcIcon, useExisting: forwardRef(() => MdcIconDirective) }]
})
export class MdcIconDirective extends AbstractMdcIcon implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-ripple-surface') _surface = true;

    constructor(_elm: ElementRef, renderer: Renderer2, registry: MdcEventRegistry) {
        super(_elm, renderer, registry);
    }

    ngAfterContentInit() {
        this.initRipple();
    }

    ngOnDestroy() {
        this.destroyRipple();
    }

    protected isRippleUnbounded() {
        return false;
    }
}
