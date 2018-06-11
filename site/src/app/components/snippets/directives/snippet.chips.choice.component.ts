import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetChipsChoiceComponent)}],
    //snip:endskip
    selector: 'blox-snippet-chips-choice',
    templateUrl: './snippet.chips.choice.component.html'
})
export class SnippetChipsChoiceComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.chips.choice.component.html'),
          'typescript': require('!raw-loader!./snippet.chips.choice.component.ts')
        });
    }
    //snip:endskip
}
