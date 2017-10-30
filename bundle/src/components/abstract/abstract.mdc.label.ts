import { ElementRef } from '@angular/core';

/** @docs-private */
export abstract class AbstractMdcLabel {
    abstract for: string;
    abstract _elm: ElementRef;
}
