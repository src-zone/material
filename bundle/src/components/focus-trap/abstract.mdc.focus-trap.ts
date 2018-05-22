import { ElementRef } from '@angular/core';

/** @docs-private */
export interface FocusTrapHandle {
    readonly active: boolean;
    untrap();
}

/** @docs-private */
export abstract class AbstractMdcFocusInitial {
    readonly priority: number;
    readonly _elm: ElementRef;
}

/** @docs-private */
export abstract class AbstractMdcFocusTrap {
    constructor() {}

    abstract trapFocus(): FocusTrapHandle;
}
