import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-focus-trap-directives',
  templateUrl: './focus-trap.directives.component.html'
})
export class FocusTrapDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/dialog.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'focus-trap';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/focus-trap.html').default);
    }
}
