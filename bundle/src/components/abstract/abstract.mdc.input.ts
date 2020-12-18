import { ElementRef } from '@angular/core';

/** @docs-private */
export abstract class AbstractMdcInput {
    abstract id: string | null;
    abstract _elm: ElementRef;
}
