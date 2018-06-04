import { Component } from '@angular/core';

@Component({
  selector: 'blox-elevation-directives',
  templateUrl: './elevation.directives.component.html'
})
export class ElevationDirectivesComponent {
    static DOC_SVG = require('!inline!svg!assets/img/mdc-icons/shadow.svg');
    static DOC_TYPE = 'components';
    static DOC_HREF = 'elevation';

    constructor() {
    }
}
