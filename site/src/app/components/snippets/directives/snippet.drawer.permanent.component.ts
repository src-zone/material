import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetDrawerPermanentComponent)}],
    //snip:endskip
    selector: 'blox-snippet-drawer-permanent',
    templateUrl: './snippet.drawer.permanent.component.html',
    styleUrls: ['./snippet.drawer.permanent.component.scss']
})
export class SnippetDrawerPermanentComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    headerType = 'spacer';
    //snip:skip
    constructor() {
        super({
            'html': require('!raw-loader!./snippet.drawer.permanent.component.html'),
            'scss': require('!raw-loader!./snippet.drawer.permanent.component.scss'),
            'typescript': require('!raw-loader!./snippet.drawer.permanent.component.ts')
        });
    }
    //snip:endskip

    get toolbarSpacer() { return this.headerType === 'spacer'; }
    get toolbarHeader() { return this.headerType === 'header'; }
}
