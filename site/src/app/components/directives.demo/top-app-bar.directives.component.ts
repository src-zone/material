import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-top-app-bar-directives',
  templateUrl: './top-app-bar.directives.component.html'
})
export class TopAppBarDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/toolbar.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'top-app-bar';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/top-app-bar.html').default);
    }
}
