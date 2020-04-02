import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-utility-directives',
  templateUrl: './utility.directives.component.html'
})
export class UtilityDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/feature_highlight.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'utility';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/utility.html').default);
    }
}
