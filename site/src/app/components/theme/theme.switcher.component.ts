import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Angulartics2 } from 'angulartics2';
import { first } from 'rxjs/operators';
import { ThemeService } from '../../services';

@Component({
  selector: 'blox-theme-switcher',
  templateUrl: './theme.switcher.component.html'
})
export class ThemeSwitcherComponent {
    static SVG = require('!raw-loader!../../../assets/img/themes/palette.svg').default;
    svg: SafeHtml;
    theme: string;
    themes: string[];

    constructor(private themeService: ThemeService, private angulartics2: Angulartics2, private sanitizer: DomSanitizer) {
        this.themes = themeService.themes;
        themeService.theme$.pipe(first()).subscribe(theme => this.theme = theme);
        this.svg = this.sanitizer.bypassSecurityTrustHtml(ThemeSwitcherComponent.SVG);
    }

    getName(theme: string) {
      return this.themeService.getName(theme);
    }

    setTheme(theme: string) {
      this.theme = theme;
      this.themeService.theme = theme;
      this.angulartics2.eventTrack.next({
        action: 'theme',
        properties: {
            category: 'switch',
            label: theme
        }
      });
    }
}
