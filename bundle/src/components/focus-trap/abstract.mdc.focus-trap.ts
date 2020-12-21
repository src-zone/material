import { ElementRef } from '@angular/core';

/** @docs-private */
export interface FocusTrapHandle {
    readonly active: boolean;
    untrap(): void;
}

/** @docs-private */
export abstract class AbstractMdcFocusInitial {
    /** @internal */ readonly priority: number | null = null;
    /** @internal */ readonly _elm: ElementRef | null = null;
}

/** @docs-private */
export abstract class AbstractMdcFocusTrap {
    constructor() {}

    abstract trapFocus(): FocusTrapHandle;
}
