import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-drawer-directives',
  templateUrl: './drawer.directives.component.html'
})
export class DrawerDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/side_navigation.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'drawer';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/drawer.html').default);
    }
}
