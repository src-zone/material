import { ElementRef } from '@angular/core';

/** @docs-private */
export abstract class AbstractMdcInput {
    abstract id: string;
    abstract _elm: ElementRef;
}
