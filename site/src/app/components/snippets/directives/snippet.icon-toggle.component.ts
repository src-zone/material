//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetIconToggleComponent)}],
    //snip:endskip
    selector: 'blox-snippet-icon-toggle',
    templateUrl: './snippet.icon-toggle.component.html',
    styleUrls: ['./snippet.icon-toggle.component.scss']
})
export class SnippetIconToggleComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    disabled = false;
    favorite = false;
    like = true;
    closed = false;
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.icon-toggle.component.html'),
          'scss': require('!raw-loader!./snippet.icon-toggle.component.scss'),
          'typescript': require('!raw-loader!./snippet.icon-toggle.component.ts')
        });
    }
    //snip:endskip

    toggleAll() {
        this.favorite = !this.favorite;
        this.like = !this.like;
        this.closed = !this.closed;
    }
}
