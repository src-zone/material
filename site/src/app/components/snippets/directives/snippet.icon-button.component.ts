import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetIconButtonComponent)}],
    //snip:endskip
    selector: 'blox-snippet-icon-button',
    templateUrl: './snippet.icon-button.component.html',
    styleUrls: ['./snippet.icon-button.component.scss']
})
export class SnippetIconButtonComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    disabled = false;
    favorite = false;
    like = true;
    closed = false;
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.icon-button.component.html'),
          'scss': require('!raw-loader!./snippet.icon-button.component.scss'),
          'typescript': require('!raw-loader!./snippet.icon-button.component.ts')
        });
    }
    //snip:endskip

    toggleAll() {
        this.favorite = !this.favorite;
        this.like = !this.like;
        this.closed = !this.closed;
    }
}
