import { Component } from '@angular/core';

@Component({
  selector: 'error-404',
  templateUrl: './notfound.component.html'
})
export class NotFoundComponent {
    static DOC_TYPE = 'errors';
    static DOC_HREF = '404';

    constructor() {
    }
}
