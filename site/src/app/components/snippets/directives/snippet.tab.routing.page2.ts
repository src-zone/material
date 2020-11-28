import { Component } from '@angular/core';

@Component({
    selector: 'routed-page2',
    template: `
        This is Page 2!
        <br>
        <br>
        <a [routerLink]="['../page1']">Go to page 1</a>
    `
})
export class Page2Component {
}
