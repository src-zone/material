import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-list-directives',
  templateUrl: './list.directives.component.html'
})
export class ListDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/list.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'list';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/list.html').default);
    }
}
