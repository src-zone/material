import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTopAppBarComponent)}],
    //snip:endskip
    selector: 'blox-snippet-top-app-bar',
    templateUrl: './snippet.top-app-bar.component.html',
    styleUrls: ['./snippet.top-app-bar.component.scss']
})
export class SnippetTopAppBarComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    type = 'default';
    prominent = false;
    dense = false;


    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.top-app-bar.component.html'),
          'scss': require('!raw-loader!./snippet.top-app-bar.component.scss'), // why? it's already in the default stylesheet...
          'typescript': require('!raw-loader!./snippet.top-app-bar.component.ts')
        });
    }
    //snip:endskip
}
