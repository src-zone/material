import { Component } from '@angular/core';

@Component({
  selector: 'blox-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent {
    components = require('./pages.directives.json');
    
    constructor() {
    }
}
