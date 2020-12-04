import { Component } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { first } from 'rxjs/operators';
import { ThemeService } from '../../services';

@Component({
  selector: 'blox-theme-switcher',
  templateUrl: './theme.switcher.component.html'
})
export class ThemeSwitcherComponent {
    theme: string;
    themes: string[];

    constructor(private themeService: ThemeService, private angulartics2: Angulartics2) {
        this.themes = themeService.themes;
        themeService.theme$.pipe(first()).subscribe(theme => this.theme = theme);
    }

    getName(theme: string) {
      return this.themeService.getName(theme);
    }

    setTheme(theme: string) {
      this.theme = theme;
      this.themeService.theme = theme;
    }
}
