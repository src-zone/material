//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetToolbarComponent)}],
    //snip:endskip
    selector: 'blox-snippet-toolbar',
    templateUrl: './snippet.toolbar.component.html'
})
export class SnippetToolbarComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.toolbar.component.html'),
          'typescript': require('!raw-loader!./snippet.toolbar.component.ts')
        });
    }
    //snip:endskip
}
