import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetToolbarFlexibleComponent)}],
    //snip:endskip
    selector: 'blox-snippet-toolbar-flexible',
    templateUrl: './snippet.toolbar.flexible.component.html',
    styleUrls: ['./snippet.toolbar.flexible.component.scss']
})
export class SnippetToolbarFlexibleComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    waterfall = true;
    expansionRatio: number;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.toolbar.flexible.component.html'),
          'scss': require('!raw-loader!./snippet.toolbar.flexible.component.scss'),
          'typescript': require('!raw-loader!./snippet.toolbar.flexible.component.ts')
        });
    }
    //snip:endskip

    updateExpansionRatio(ratio: number) {
        this.expansionRatio = ratio;
    }
}
