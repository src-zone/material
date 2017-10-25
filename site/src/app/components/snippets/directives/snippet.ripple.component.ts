//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetRippleComponent) }],
  //snip:endskip
  selector: 'blox-snippet-ripple',
  templateUrl: './snippet.ripple.component.html',
  styleUrls: ['./snippet.ripple.component.scss']
})
export class SnippetRippleComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    disabled: boolean = null;
    unbounded = false;
    dimension = false;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.ripple.component.html'),
          'scss': require('!raw-loader!./snippet.ripple.component.scss'),
          'typescript': require('!raw-loader!./snippet.ripple.component.ts')
        });
    }
    //snip:endskip
}
