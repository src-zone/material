import { Component } from '@angular/core';

@Component({
  selector: 'blox-tab-directives',
  templateUrl: './tab.directives.component.html'
})
export class TabDirectivesComponent {
    static DOC_SVG = require('!inline!svg!assets/img/mdc-icons/tabs.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'tabs';

    constructor() {
    }
}
