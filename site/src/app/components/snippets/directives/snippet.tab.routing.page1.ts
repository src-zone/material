import { Component } from '@angular/core';

@Component({
    selector: 'routed-page1',
    template: `
        This is Page 1
        <br>
        <br>
        <a [routerLink]="['../page2']">Go to page 2</a>
    `
})
export class Page1Component {
}
