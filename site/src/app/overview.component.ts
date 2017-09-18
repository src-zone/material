import { Component } from '@angular/core';

@Component({
  selector: 'blox-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent {
    components = <Array<Object>>require('./pages.directives.json').filter(o => o.href != null);
    
    constructor() {
    }
}
