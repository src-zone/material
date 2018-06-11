import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetSwitchComponent)}],
  //snip:endskip
  selector: 'blox-snippet-switch',
  templateUrl: './snippet.switch.component.html'
})
export class SnippetSwitchComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    disabled = false;
    value = false;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.switch.component.html'),
          'typescript': require('!raw-loader!./snippet.switch.component.ts')
        });
    }
    //snip:endskip
}
