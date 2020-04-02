import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-card-directives',
  templateUrl: './card.directives.component.html'
})
export class CardDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/card.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'card';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/card.html').default);
    }
}
