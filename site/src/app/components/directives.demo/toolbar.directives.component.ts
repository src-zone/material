import { Component } from '@angular/core';

@Component({
  selector: 'blox-toolbar-directives',
  templateUrl: './toolbar.directives.component.html'
})
export class ToolbarDirectivesComponent {
    static DOC_SVG = require('assets/img/mdc-icons/toolbar.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'toolbar';

    constructor() {
    }
}
