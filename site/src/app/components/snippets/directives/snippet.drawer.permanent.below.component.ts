//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetDrawerPermanentBelowComponent)}],
    //snip:endskip
    selector: 'blox-snippet-drawer-permanent-below',
    templateUrl: './snippet.drawer.permanent.below.component.html',
    styleUrls: ['./snippet.drawer.permanent.below.component.scss']
})
export class SnippetDrawerPermanentBelowComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    headerType = 'spacer';
    //snip:skip
    constructor() {
        super({
            'html': require('!raw-loader!./snippet.drawer.permanent.below.component.html'),
            'scss': require('!raw-loader!./snippet.drawer.permanent.below.component.scss'),
            'typescript': require('!raw-loader!./snippet.drawer.permanent.below.component.ts')
        });
    }
    //snip:endskip

    get toolbarSpacer() { return this.headerType === 'spacer'; }
    get toolbarHeader() { return this.headerType === 'header'; }
}
