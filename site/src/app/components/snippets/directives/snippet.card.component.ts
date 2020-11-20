import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetCardComponent)}],
  //snip:endskip
  selector: 'blox-snippet-card',
  templateUrl: './snippet.card.component.html',
  styleUrls: ['./snippet.card.component.scss']
})
export class SnippetCardComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    rtl = false;
    outlined = false;
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.card.component.html'),
          'scss': require('!raw-loader!./snippet.card.component.scss'),
          'typescript': require('!raw-loader!./snippet.card.component.ts')
        }, {
          '../../../../assets/img/mdc-demos/16-9.jpg': require('!file-loader!../../../../assets/img/mdc-demos/16-9.jpg').default,
          '../../../../assets/img/mdc-demos/1-1.jpg': require('!file-loader!../../../../assets/img/mdc-demos/1-1.jpg').default
        });
    }
    //snip:endskip

    get dir() {
      return this.rtl ? "rtl" : null;
    }
}
