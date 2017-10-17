import { ElementRef } from '@angular/core';

export abstract class AbstractMdcLabel {
    abstract for: string;
    abstract _elm: ElementRef;
}
