import { ElementRef } from '@angular/core';

/** @docs-private */
export abstract class AbstractMdcLabel {
    /** @internal */
    abstract for: string | null;
    /** @internal */
    abstract _elm: ElementRef;
}
