import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-dialog-directives',
  templateUrl: './dialog.directives.component.html'
})
export class DialogDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/dialog.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'dialog';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/dialog.html').default);
    }
}
