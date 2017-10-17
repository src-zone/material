import { ElementRef } from '@angular/core';

export abstract class AbstractMdcInput {
    abstract id: string;
    abstract _elm: ElementRef;
}
