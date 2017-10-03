//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTextfieldTextareaComponent)}],
  //snip:endskip
  selector: 'blox-snippet-textfield-textarea',
  templateUrl: './snippet.textfield.textarea.component.html'
})
export class SnippetTextfieldTextareaComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    rtl = false;
    disabled = false;
    required = false;
    persistent = false;
    dense = false;
    field1: string;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.textfield.textarea.component.html'),
          'typescript': require('!raw-loader!./snippet.textfield.textarea.component.ts')
        });
    }
    //snip:endskip

    get dir() {
        return this.rtl ? "rtl" : null;
    }
}
