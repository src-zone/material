import { Directive, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/** @docs-private */
@Directive()
export abstract class AbstractMdcIcon extends AbstractMdcRipple {
    constructor(public _elm: ElementRef, renderer: Renderer2, registry: MdcEventRegistry, @Inject(DOCUMENT) doc: any) {
        super(_elm, renderer, registry, doc as Document);
    }
}
