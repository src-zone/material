import { Component } from '@angular/core';

@Component({
  selector: 'blox-fab-directives',
  templateUrl: './fab.directives.component.html'
})
export class FabDirectivesComponent {
    static DOC_SVG = require('!inline!svg!assets/img/mdc-icons/button.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'fab';

    constructor() {
    }
}
