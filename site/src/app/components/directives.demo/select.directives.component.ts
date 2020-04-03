import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'blox-select-directives',
    templateUrl: './select.directives.component.html'
})
export class SelectDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/menu.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'select';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/select.html').default);
    }
}
