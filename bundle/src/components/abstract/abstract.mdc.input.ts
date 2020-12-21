import { ElementRef } from '@angular/core';

/** @docs-private */
export abstract class AbstractMdcInput {
    /** @internal */
    abstract id: string | null;
    /** @internal */
    abstract _elm: ElementRef;
}
