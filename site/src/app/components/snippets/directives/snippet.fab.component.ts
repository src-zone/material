import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetFabComponent) }],
  //snip:endskip
  selector: 'blox-snippet-fab',
  templateUrl: './snippet.fab.component.html',
  styleUrls: ['./snippet.fab.component.scss']
})
export class SnippetFabComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    exit: false;
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.fab.component.html'),
          'scss': require('!raw-loader!./snippet.fab.component.scss'),
          'typescript': require('!raw-loader!./snippet.fab.component.ts')
        });
    }
    //snip:endskip
}
