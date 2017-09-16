//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetCheckboxComponent)}],
  //snip:endskip
  selector: 'blox-snippet-checkbox',
  templateUrl: './snippet.checkbox.component.html'
})
export class SnippetCheckboxComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    alignEnd = false;
    disabled = false;
    value: boolean;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.checkbox.component.html'),
          'typescript': require('!raw-loader!./snippet.checkbox.component.ts')
        });
    }
    //snip:endskip

    makeIndeterminate() {
        this.value = null;
    }

    toggleAlignEnd() {
        this.alignEnd = !this.alignEnd;
    }

    toggleDisabled() {
        this.disabled = !this.disabled;
    }

    get indeterminate() {
        return this.value == null;
    }

    get printableValue() {
        if (this.value == null)
            return 'indeterminate';
        return this.value;
    }
}
