import { Component } from '@angular/core';

@Component({
  selector: 'blox-drawer-directives',
  templateUrl: './drawer.directives.component.html'
})
export class DrawerDirectivesComponent {
    static DOC_SVG = require('assets/img/mdc-icons/side_navigation.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'drawer';

    constructor() {
    }
}
