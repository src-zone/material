import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-icon-button-directives',
  templateUrl: './icon-button.directives.component.html'
})
export class IconButtonDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/component.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'icon-button';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/icon-button.html').default);
    }
}
