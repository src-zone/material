import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTabIconsComponent) }],
  //snip:endskip
  selector: 'blox-snippet-tab-icons',
  templateUrl: './snippet.tab.icons.component.html'
})
export class SnippetTabIconsComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
  showText = true;
  tabs = [
    {
      name: 'Tab 1',
      content: 'First tab',
      icon: 'phone'
    },
    {
      name: 'Tab Two',
      content: 'Second tab',
      icon: 'favorite'
    }
  ];
  active = 0;

  //snip:skip
  constructor() {
      super({
        'html': require('!raw-loader!./snippet.tab.icons.component.html'),
        'typescript': require('!raw-loader!./snippet.tab.icons.component.ts')
      });
  }
  //snip:endskip

  activate(index: number) {
    this.active = index;
  }
}
