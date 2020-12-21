import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
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
    srcAvatar1 = require('!file-loader!../../../../assets/img/mdc-demos/animal1.svg').default; // TODO stackblitz, see SnippetCardComponent?
    srcAvatar2 = require('!file-loader!../../../../assets/img/mdc-demos/animal2.svg').default;
    startDetail = true;
    endDetail = true;
    avatar = false;
    dense = false;
    interactive = true;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.list.twoline.component.html'),
          'scss': require('!raw-loader!./snippet.list.twoline.component.scss'),
          'typescript': require('!raw-loader!./snippet.list.twoline.component.ts')
        }, {
            '../../../../assets/img/mdc-demos/animal1.svg': require('!file-loader!../../../../assets/img/mdc-demos/animal1.svg').default,
            '../../../../assets/img/mdc-demos/animal2.svg': require('!file-loader!../../../../assets/img/mdc-demos/animal2.svg').default
        });
    }
    //snip:endskip
}
