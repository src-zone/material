import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-checkbox-directives',
  templateUrl: './checkbox.directives.component.html'
})
export class CheckboxDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/checkbox.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'checkbox';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/checkbox.html').default);
    }
}
