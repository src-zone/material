import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-snackbar-directives',
  templateUrl: './snackbar.directives.component.html'
})
export class SnackbarDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/snackbar.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'snackbar';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/snackbar.html').default);
    }
}
