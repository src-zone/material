import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-icon-toggle-directives',
  templateUrl: './icon-toggle.directives.component.html'
})
export class IconToggleDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/component.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'icon-toggle';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/icon-toggle.html').default);
    }
}
