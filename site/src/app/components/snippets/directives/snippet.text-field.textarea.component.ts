import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTextFieldTextareaComponent)}],
  //snip:endskip
  selector: 'blox-snippet-text-field-textarea',
  templateUrl: './snippet.text-field.textarea.component.html'
})
export class SnippetTextFieldTextareaComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    rtl = false;
    disabled = false;
    required = false;
    persistent = false;
    field1: string;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.text-field.textarea.component.html'),
          'typescript': require('!raw-loader!./snippet.text-field.textarea.component.ts')
        });
    }
    //snip:endskip

    get dir() {
        return this.rtl ? "rtl" : null;
    }
}
