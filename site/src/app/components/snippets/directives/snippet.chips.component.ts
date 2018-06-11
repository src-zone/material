import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetChipsComponent)}],
    //snip:endskip
    selector: 'blox-snippet-chips',
    templateUrl: './snippet.chips.component.html'
})
export class SnippetChipsComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.chips.component.html'),
          'typescript': require('!raw-loader!./snippet.chips.component.ts')
        });
    }
    //snip:endskip
}
