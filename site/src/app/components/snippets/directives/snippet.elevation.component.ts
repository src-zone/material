//snip:skip
import { Component, forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetElevationComponent)}],
  //snip:endskip
  selector: 'blox-snippet-elevation',
  templateUrl: './snippet.elevation.component.html',
  styleUrls: ['./snippet.elevation.component.scss']
})
export class SnippetElevationComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    elevation = 4;
    animate = true;
    
    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.elevation.component.html'),
          'scss': require('!raw-loader!./snippet.elevation.component.scss'),
          'typescript': require('!raw-loader!./snippet.elevation.component.ts')
        });
    }
    //snip:endskip
}
