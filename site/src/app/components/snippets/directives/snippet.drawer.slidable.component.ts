import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetDrawerSlidableComponent)}],
    //snip:endskip
    selector: 'blox-snippet-drawer-slidable',
    templateUrl: './snippet.drawer.slidable.component.html',
    styleUrls: ['./snippet.drawer.slidable.component.scss']
})
export class SnippetDrawerSlidableComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    open = false;
    drawerType = 'persistent';
    headerType = 'spacer';
    //snip:skip
    constructor() {
        super({
            'html': require('!raw-loader!./snippet.drawer.slidable.component.html'),
            'scss': require('!raw-loader!./snippet.drawer.slidable.component.scss'),
            'typescript': require('!raw-loader!./snippet.drawer.slidable.component.ts')
        });
    }
    //snip:endskip

    toggleDrawer() {
        this.open = !this.open;
    }

    get toolbarSpacer() { return this.headerType === 'spacer'; }
    get toolbarHeader() { return this.headerType === 'header'; }
}
