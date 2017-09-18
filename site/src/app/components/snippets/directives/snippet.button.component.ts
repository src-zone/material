//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetButtonComponent)}],
  //snip:endskip
  selector: 'blox-snippet-button',
  templateUrl: './snippet.button.component.html'
})
export class SnippetButtonComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    disabled = false;
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.button.component.html'),
          'typescript': require('!raw-loader!./snippet.button.component.ts')
        });
    }
    //snip:endskip
}
