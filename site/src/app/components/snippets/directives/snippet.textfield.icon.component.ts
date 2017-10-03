//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTextfieldIconComponent)}],
  //snip:endskip
  selector: 'blox-snippet-textfield-icon',
  templateUrl: './snippet.textfield.icon.component.html'
})
export class SnippetTextfieldIconComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    field1: string;
    field2: string;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.textfield.icon.component.html'),
          'typescript': require('!raw-loader!./snippet.textfield.icon.component.ts')
        });
    }
    //snip:endskip

    clearField2() {
        this.field2 = null;
    }
}
