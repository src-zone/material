import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-switch-directives',
  templateUrl: './switch.directives.component.html'
})
export class SwitchDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/switch.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'switch';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/switch.html').default);
    }
}
