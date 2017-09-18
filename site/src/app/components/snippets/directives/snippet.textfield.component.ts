//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTextfieldComponent)}],
  //snip:endskip
  selector: 'blox-snippet-textfield',
  templateUrl: './snippet.textfield.component.html'
})
export class SnippetTextfieldComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    box = false;
    rtl = false;
    disabled = false;
    required = false;
    persistent = false;
    dense = false;
    field1: string;
    field2: string;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.textfield.component.html'),
          'typescript': require('!raw-loader!./snippet.textfield.component.ts')
        });
    }
    //snip:endskip

    get dir() {
        return this.rtl ? "rtl" : null;
    }
}
