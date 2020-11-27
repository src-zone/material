import { Component, SimpleChanges } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTextFieldComponent)}],
  //snip:endskip
  selector: 'blox-snippet-text-field',
  templateUrl: './snippet.text-field.component.html'
})
export class SnippetTextFieldComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    outlined = false;
    rtl = false;
    disabled = false;
    required = false;
    persistent = false;
    field1: string;
    field2: string;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.text-field.component.html'),
          'typescript': require('!raw-loader!./snippet.text-field.component.ts')
        });
    }
    //snip:endskip

    get dir() {
        return this.rtl ? "rtl" : null;
    }
}
