import { Component, HostListener, ViewChild } from '@angular/core';
import { MdcFocusTrapDirective, FocusTrapHandle } from '@blox/material';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetFocusTrapComponent)}],
    //snip:endskip
    selector: 'blox-snippet-focus-trap',
    templateUrl: './snippet.focus-trap.component.html',
    styleUrls: ['./snippet.focus-trap.component.scss']
})
export class SnippetFocusTrapComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    @ViewChild(MdcFocusTrapDirective) _focusTrapper: MdcFocusTrapDirective;
    private _focusTrap: FocusTrapHandle = null;
    
    //snip:skip
    constructor() {
        super({
            'html': require('!raw-loader!./snippet.focus-trap.component.html'),
            'scss': require('!raw-loader!./snippet.focus-trap.component.scss'),
            'typescript': require('!raw-loader!./snippet.focus-trap.component.ts')
        });
    }
    //snip:endskip

    get focusTrap() {
        return !!this._focusTrap?.active;
    }

    set focusTrap(val: boolean) {
        let trapping = this.focusTrap;
        if (trapping !== !!val) {
            if (trapping)
                this._focusTrap.untrap();
            else
                this._focusTrap = this._focusTrapper.trapFocus();
        }
    }

    @HostListener('document:keydown', ['$event']) onKeydown(event: KeyboardEvent) {
        // when the ESC key is pressed, we'll release the focus trap:
        const key = event.key || event.keyCode;
        if (this.focusTrap && (key === 'Escape' || key === 'Esc' || key === 27))
            this.focusTrap = false;
    }
}
