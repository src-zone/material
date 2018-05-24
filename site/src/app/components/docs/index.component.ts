import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../services';

@Component({
  selector: 'blox-index',
  templateUrl: './index.component.html'
})
export class IndexComponent implements OnInit, OnDestroy {
    constructor(private theme: ThemeService) {
    }

    ngOnInit() {
        this.theme.setTheme('blox-theme-dark');
    }

    ngOnDestroy() {
        this.theme.setTheme(null);
    }
}
