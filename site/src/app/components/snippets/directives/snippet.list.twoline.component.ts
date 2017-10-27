//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetListTwolineComponent)}],
    //snip:endskip
    selector: 'blox-snippet-list-twoline',
    templateUrl: './snippet.list.twoline.component.html',
    styleUrls: ['./snippet.list.twoline.component.scss']
})
export class SnippetListTwolineComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    startDetail = true;
    endDetail = true;
    avatar = false;
    dense = false;
    ripple = false;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.list.twoline.component.html'),
          'scss': require('!raw-loader!./snippet.list.twoline.component.scss'),
          'typescript': require('!raw-loader!./snippet.list.twoline.component.ts')
        });
    }
    //snip:endskip
}
