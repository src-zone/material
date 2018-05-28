import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services';

@Component({
  selector: 'blox-guides',
  templateUrl: './guides.component.html'
})
export class GuidesComponent implements OnInit, OnDestroy{
    static DOC_TYPE = 'docs';
    static DOC_HREF = 'guides';

    constructor(private theme: ThemeService) {
    }

    ngOnInit() {
        this.theme.setTheme('blox-theme-dark');
    }

    ngOnDestroy() {
        this.theme.setTheme(null);
    }
}
