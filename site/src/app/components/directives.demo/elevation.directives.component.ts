import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-elevation-directives',
  templateUrl: './elevation.directives.component.html'
})
export class ElevationDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/shadow.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'elevation';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/elevation.html').default);
    }
}
