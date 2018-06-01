import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetChipsInputComponent)}],
    //snip:endskip
    selector: 'blox-snippet-chips-input',
    templateUrl: './snippet.chips.input.component.html'
})
export class SnippetChipsInputComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    chips = [ 'claire', 'pete', 'anne' ];
    newChip: string;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.chips.input.component.html'),
          'typescript': require('!raw-loader!./snippet.chips.input.component.ts')
        });
    }
    //snip:endskip

    addChip() {
        if (this.newChip) {
            let value = this.newChip.trim();
            if (value.length)
                this.chips.push(value);
        }
        this.newChip = null;
    }

    removeChip(index: number) {
        this.chips.splice(index, 1);
    }
}
