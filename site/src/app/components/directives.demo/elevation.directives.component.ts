import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AbstractDemoComponent } from './abstract.demo.component';

@Component({
  selector: 'blox-elevation-directives',
  templateUrl: './elevation.directives.component.html'
})
export class ElevationDirectivesComponent extends AbstractDemoComponent {
    static DOC_SVG = require('!raw-loader!../../../assets/img/mdc-icons/shadow.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'elevation';
    apiDoc: SafeHtml;

    constructor(sanitizer: DomSanitizer, @Inject(DOCUMENT) doc: Document, router: Router) {
      super(
        sanitizer.bypassSecurityTrustHtml(require('!raw-loader!../../../../../bundle/apidocs/elevation.html').default),
        doc,
        router
      );
    }
}
