import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-radio-directives',
  templateUrl: './radio.directives.component.html'
})
export class RadioDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/radio.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'radio';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/radio.html').default);
    }
}
