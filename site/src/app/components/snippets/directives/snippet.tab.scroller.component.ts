import { Component, OnInit } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTabScrollerComponent) }],
  //snip:endskip
  selector: 'blox-snippet-tab-scroller',
  templateUrl: './snippet.tab.scroller.component.html'
})
export class SnippetTabScrollerComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ implements OnInit{
    tabs = [];
    active = 0;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.tab.scroller.component.html'),
          'typescript': require('!raw-loader!./snippet.tab.scroller.component.ts')
        });
    }
    //snip:endskip

    ngOnInit() {
        for (let i = 1; i <= 20; ++i)
            this.tabs.push({name: 'Tab ' + i, content: 'Content of tab ' + i});
    }

    activate(index: number) {
        this.active = index;
    }
}
