import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetLinearProgressComponent)}],
    //snip:endskip
    selector: 'blox-snippet-linear-progress',
    templateUrl: './snippet.linear-progress.component.html'
})
export class SnippetLinearProgressComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    progress = 0;
    buffer = 0;
    closed = false;
    indeterminate = true;
    reversed = false;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.linear-progress.component.html'),
          'typescript': require('!raw-loader!./snippet.linear-progress.component.ts')
        });
    }
    //snip:endskip
}
