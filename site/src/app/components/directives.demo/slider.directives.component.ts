import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-slider-directives',
  templateUrl: './slider.directives.component.html'
})
export class SliderDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/slider.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'slider';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/slider.html').default);
    }
}
