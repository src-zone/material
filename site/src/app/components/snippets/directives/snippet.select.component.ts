//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetSelectComponent)}],
    //snip:endskip
    selector: 'blox-snippet-select',
    templateUrl: './snippet.select.component.html',
    styleUrls: ['./snippet.select.component.scss']
})
export class SnippetSelectComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    value: string;
    disabled = false;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.select.component.html'),
          'scss': require('!raw-loader!./snippet.select.component.scss'),
          'typescript': require('!raw-loader!./snippet.select.component.ts')
        });
    }
    //snip:endskip

    clear() {
        this.value = null;
    }
}
