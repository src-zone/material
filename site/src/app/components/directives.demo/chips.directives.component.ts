import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-chips-directives',
  templateUrl: './chips.directives.component.html'
})
export class ChipsDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/chip.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'chips';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/chips.html').default);
    }
}
