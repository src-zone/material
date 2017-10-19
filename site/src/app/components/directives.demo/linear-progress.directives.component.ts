import { Component } from '@angular/core';

@Component({
  selector: 'blox-linear-progress-directives',
  templateUrl: './linear-progress.directives.component.html'
})
export class LinearProgressDirectivesComponent {
    static DOC_SVG = require('assets/img/mdc-icons/progress_linear.svg');
    static DOC_TYPE = 'directives';
    static DOC_HREF = 'linear-progress';

    constructor() {
    }
}
