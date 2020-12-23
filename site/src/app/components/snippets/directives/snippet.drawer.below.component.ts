import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetDrawerBelowComponent)}],
    //snip:endskip
    selector: 'blox-snippet-drawer-below',
    templateUrl: './snippet.drawer.below.component.html',
    styleUrls: ['./snippet.drawer.below.component.scss']
})
export class SnippetDrawerBelowComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    open = false;
    drawerType: 'dismissible' | 'permanent' | 'modal' = 'dismissible';
    header = true;
    //snip:skip
    constructor() {
        super({
            'html': require('!raw-loader!./snippet.drawer.below.component.html'),
            'scss': require('!raw-loader!./snippet.drawer.below.component.scss'),
            'typescript': require('!raw-loader!./snippet.drawer.below.component.ts')
        }, {}, 'typescript', {noBodyMargins: true});
    }
    //snip:endskip

    toggleDrawer() {
        this.open = !this.open;
    }

    get changeTypeDisabled() {
        return this.drawerType !== 'permanent' && this.open;
    }
}
