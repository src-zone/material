import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetChipsFilterComponent)}],
    //snip:endskip
    selector: 'blox-snippet-chips-filter',
    templateUrl: './snippet.chips.filter.component.html'
})
export class SnippetChipsFilterComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.chips.filter.component.html'),
          'typescript': require('!raw-loader!./snippet.chips.filter.component.ts')
        });
    }
    //snip:endskip
}
