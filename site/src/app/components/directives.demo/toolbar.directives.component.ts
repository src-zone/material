import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-toolbar-directives',
  templateUrl: './toolbar.directives.component.html'
})
export class ToolbarDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/toolbar.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'toolbar';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/toolbar.html').default);
    }
}
