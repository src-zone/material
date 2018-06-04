import { Component } from '@angular/core';

@Component({
  selector: 'blox-menu-directives',
  templateUrl: './menu.directives.component.html'
})
export class MenuDirectivesComponent {
    static DOC_SVG = require('!inline!svg!assets/img/mdc-icons/menu.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'menu';

    constructor() {
    }
}
