import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../services';

@Component({
  selector: 'error-404',
  templateUrl: './notfound.component.html'
})
export class NotFoundComponent {
    static DOC_TYPE = 'errors';
    static DOC_HREF = '404';

    constructor(private theme: ThemeService) {
    }

    ngOnInit() {
        this.theme.setTheme('blox-theme-dark');
    }

    ngOnDestroy() {
        this.theme.setTheme(null);
    }

    get pageUrl() {
        return document.location.href;
    }
}
