import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services';

@Component({
    selector: 'blox-gettingstarted',
    templateUrl: './gettingstarted.component.html'
})
export class GettingstartedComponent {
    static DOC_TYPE = 'guides';
    static DOC_HREF = 'gettingStarted';

    constructor(private theme: ThemeService) {
    }

    ngOnInit() {
        this.theme.setTheme('blox-theme-dark');
    }

    ngOnDestroy() {
        this.theme.setTheme(null);
    }
}
