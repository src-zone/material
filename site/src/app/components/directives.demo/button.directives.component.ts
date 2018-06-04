import { Component } from '@angular/core';

@Component({
  selector: 'blox-button-directives',
  templateUrl: './button.directives.component.html'
})
export class ButtonDirectivesComponent {
    static DOC_SVG = require('!inline!svg!assets/img/mdc-icons/button.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'button';

    constructor() {
    }
}
