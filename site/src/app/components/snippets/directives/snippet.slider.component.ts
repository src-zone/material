import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip

@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetSliderComponent)}],
    //snip:endskip
    selector: 'blox-snippet-slider',
    templateUrl: './snippet.slider.component.html'
})
export class SnippetSliderComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    disabled = false;
    min = 0;
    max = 100;
    step = 0;
    discrete = false;
    markers = false;
    value = 0;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.slider.component.html'),
          'typescript': require('!raw-loader!./snippet.slider.component.ts')
        });
    }
    //snip:endskip
}
