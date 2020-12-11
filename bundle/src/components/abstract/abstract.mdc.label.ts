import { ElementRef } from '@angular/core';

/** @docs-private */
export abstract class AbstractMdcLabel {
    abstract for: string | null;
    abstract _elm: ElementRef;
}
