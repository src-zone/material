import { ElementRef } from '@angular/core';

/** @docs-private */
export interface FocusTrapHandle {
    readonly active: boolean;
    untrap(): void;
}

/** @docs-private */
export abstract class AbstractMdcFocusInitial {
    /** @docs-private */ readonly priority: number | null = null;
    /** @docs-private */ readonly _elm: ElementRef | null = null;
}

/** @docs-private */
export abstract class AbstractMdcFocusTrap {
    constructor() {}

    abstract trapFocus(): FocusTrapHandle;
}
