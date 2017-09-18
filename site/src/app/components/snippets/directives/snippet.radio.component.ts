//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetRadioComponent)}],
  //snip:endskip
  selector: 'blox-snippet-radio',
  templateUrl: './snippet.radio.component.html'
})
export class SnippetRadioComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    alignEnd = false;
    disabled = false;
    value: string;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.radio.component.html'),
          'typescript': require('!raw-loader!./snippet.radio.component.ts')
        });
    }
    //snip:endskip

    toggleAlignEnd() {
        this.alignEnd = !this.alignEnd;
    }

    toggleDisabled() {
        this.disabled = !this.disabled;
    }
}
