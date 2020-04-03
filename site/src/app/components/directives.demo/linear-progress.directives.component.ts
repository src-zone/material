import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blox-linear-progress-directives',
  templateUrl: './linear-progress.directives.component.html'
})
export class LinearProgressDirectivesComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/progress_linear.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'linear-progress';
    apiDoc: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
      this.apiDoc = this.sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/linear-progress.html').default);
    }
}
