import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetDrawerComponent)}],
    //snip:endskip
    selector: 'blox-snippet-drawer',
    templateUrl: './snippet.drawer.component.html',
    styleUrls: ['./snippet.drawer.component.scss']
})
export class SnippetDrawerComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    open = false;
    drawerType = 'dismissible';
    header = true;
    //snip:skip
    constructor() {
        super({
            'html': require('!raw-loader!./snippet.drawer.component.html'),
            'scss': require('!raw-loader!./snippet.drawer.component.scss'),
            'typescript': require('!raw-loader!./snippet.drawer.component.ts')
        });
    }
    //snip:endskip

    toggleDrawer() {
        this.open = !this.open;
    }

    get changeTypeDisabled() {
        return this.drawerType !== 'permanent' && this.open;
    }
}
