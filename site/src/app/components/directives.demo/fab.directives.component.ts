import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-fab-directives',
  templateUrl: './fab.directives.component.html'
})
export class FabDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/button.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'fab';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/fab.html').default);
    }
}
