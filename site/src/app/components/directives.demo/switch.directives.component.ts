import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AbstractDemoComponent } from './abstract.demo.component';

@Component({
  selector: 'blox-switch-directives',
  templateUrl: './switch.directives.component.html'
})
export class SwitchDirectivesComponent extends AbstractDemoComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/switch.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'switch';
    apiDoc: SafeHtml;

    constructor(sanitizer: DomSanitizer, @Inject(DOCUMENT) doc: Document, router: Router) {
      super(
        sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/switch.html').default),
        doc,
        router
      );
    }
}
