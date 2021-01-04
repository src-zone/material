import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-menu-surface-directives',
  templateUrl: './menu-surface.directives.component.html'
})
export class MenuSurfaceDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/menu.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'menu-surface';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/menu-surface.html').default);
    }
}
