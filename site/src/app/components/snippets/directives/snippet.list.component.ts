//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetListComponent)}],
    //snip:endskip
    selector: 'blox-snippet-list',
    templateUrl: './snippet.list.component.html',
    styleUrls: ['./snippet.list.component.scss']
})
export class SnippetListComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    startDetail = true;
    endDetail = true;
    avatar = false;
    dense = false;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.list.component.html'),
          'scss': require('!raw-loader!./snippet.list.component.scss'),
          'typescript': require('!raw-loader!./snippet.list.component.ts')
        });
    }
    //snip:endskip
}
