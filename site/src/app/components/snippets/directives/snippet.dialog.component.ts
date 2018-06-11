import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetDialogComponent)}],
    //snip:endskip
    selector: 'blox-snippet-dialog',
    templateUrl: './snippet.dialog.component.html'
})
export class SnippetDialogComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    //snip:skip
    constructor() {
        super({
            'html': require('!raw-loader!./snippet.dialog.component.html'),
            'typescript': require('!raw-loader!./snippet.dialog.component.ts')
        });
    }
    //snip:endskip
}
