import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-tab-directives',
  templateUrl: './tab.directives.component.html'
})
export class TabDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/tabs.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'tabs';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/tabs.html').default);
    }
}
