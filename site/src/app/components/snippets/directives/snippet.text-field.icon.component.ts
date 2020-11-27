import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTextFieldIconComponent)}],
  //snip:endskip
  selector: 'blox-snippet-text-field-icon',
  templateUrl: './snippet.text-field.icon.component.html'
})
export class SnippetTextFieldIconComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    outlined = false;
    disabled = false;
    required = false;
    persistent = false;
    field1: string;
    field2: string;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.text-field.icon.component.html'),
          'typescript': require('!raw-loader!./snippet.text-field.icon.component.ts')
        });
    }
    //snip:endskip

    clearField2() {
        this.field2 = null;
    }
}
