import { Component } from '@angular/core';

@Component({
  selector: 'blox-utility-directives',
  templateUrl: './utility.directives.component.html'
})
export class UtilityDirectivesComponent {
    static DOC_SVG = require('assets/img/mdc-icons/feature_highlight.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'utility';

    constructor() {
    }
}
