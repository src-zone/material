import { Component } from '@angular/core';

@Component({
  selector: 'blox-card-directives',
  templateUrl: './card.directives.component.html'
})
export class CardDirectivesComponent {
    static DOC_SVG = require('assets/img/mdc-icons/card.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'card';

    constructor() {
    }
}
