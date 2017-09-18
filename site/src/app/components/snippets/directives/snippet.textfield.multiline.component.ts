//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTextfieldMultilineComponent)}],
  //snip:endskip
  selector: 'blox-snippet-textfield-multiline',
  templateUrl: './snippet.textfield.multiline.component.html'
})
export class SnippetTextfieldMultilineComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    rtl = false;
    disabled = false;
    required = false;
    persistent = false;
    dense = false;
    field1: string;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.textfield.multiline.component.html'),
          'typescript': require('!raw-loader!./snippet.textfield.multiline.component.ts')
        });
    }
    //snip:endskip

    get dir() {
        return this.rtl ? "rtl" : null;
    }
}
