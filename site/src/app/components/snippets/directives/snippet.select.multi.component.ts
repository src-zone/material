//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetSelectMultiComponent)}],
    //snip:endskip
    selector: 'blox-snippet-select-multi',
    templateUrl: './snippet.select.multi.component.html'
})
export class SnippetSelectMultiComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    value: string[] = [];
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.select.multi.component.html'),
          'typescript': require('!raw-loader!./snippet.select.multi.component.ts')
        });
    }
    //snip:endskip

    get valueAsString() {
        return this.value ? this.value.join(', '): '';
    }
}
