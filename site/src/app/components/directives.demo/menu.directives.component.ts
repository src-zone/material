import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-menu-directives',
  templateUrl: './menu.directives.component.html'
})
export class MenuDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/menu.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'menu';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/menu.html').default);
    }
}
