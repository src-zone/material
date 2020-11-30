import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTabRoutingComponent) }],
  //snip:endskip
  selector: 'blox-snippet-tab-routing',
  templateUrl: './snippet.tab.routing.component.html'
})
export class SnippetTabRoutingComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.tab.routing.component.html'),
          'typescript': require('!raw-loader!./snippet.tab.routing.component.ts'),
          'app.module.ts': require('!raw-loader!./snippet.tab.routing.module.ts'),
          'page1.ts': require('!raw-loader!./snippet.tab.routing.page1.ts'),
          'page2.ts': require('!raw-loader!./snippet.tab.routing.page2.ts')
        });
    }
    //snip:endskip
}
