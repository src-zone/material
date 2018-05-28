import { Component } from '@angular/core';
import { ThemeService } from '../../services';

@Component({
    selector: 'blox-ie11',
    templateUrl: './ie11.component.html'
})
export class IE11Component {
    static DOC_TYPE = 'guides';
    static DOC_HREF = 'ie11';

    constructor(private theme: ThemeService) {
    }

    ngOnInit() {
        this.theme.setTheme('blox-theme-dark');
    }

    ngOnDestroy() {
        this.theme.setTheme(null);
    }
}
