import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-text-field-directives',
  templateUrl: './text-field.directives.component.html'
})
export class TextFieldDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/text-field.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'text-field';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/text-field.html').default);
    }
}
