import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/** @docs-private */
@Directive()
export abstract class AbstractMdcIcon extends AbstractMdcRipple {
    constructor(public _elm: ElementRef, renderer: Renderer2, registry: MdcEventRegistry) {
        super(_elm, renderer, registry);
    }
}
