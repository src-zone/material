import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-ripple-directives',
  templateUrl: './ripple.directives.component.html'
})
export class RippleDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/ripple.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'ripple';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/ripple.html').default);
    }
}
