import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTabSimpleComponent) }],
  //snip:endskip
  selector: 'blox-snippet-tab-simple',
  templateUrl: './snippet.tab.simple.component.html'
})
export class SnippetTabSimpleComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    tabs = [
      {
        name: 'Tab 1',
        content: 'First tab'
      },
      {
        name: 'Tab Two',
        content: 'Second tab'        
      },
      {
        name: 'Tab 3',
        content: 'Third tab'
      },
      {
        name: 'Tab IV',
        content: 'Fourth tab'        
      }
    ];
    active = 0;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.tab.simple.component.html'),
          'typescript': require('!raw-loader!./snippet.tab.simple.component.ts')
        });
    }
    //snip:endskip

    activate(index: number) {
      this.active = index;
    }
}
