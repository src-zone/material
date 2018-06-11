import { Component } from '@angular/core';

@Component({
  selector: 'blox-top-app-bar-directives',
  templateUrl: './top-app-bar.directives.component.html'
})
export class TopAppBarDirectivesComponent {
    static DOC_SVG = require('!inline!svg!assets/img/mdc-icons/toolbar.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'top-app-bar';

    constructor() {
    }
}
