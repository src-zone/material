import { Observable, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private _themes = {
        dark: {
            css: 'dark.scss',
            name: 'Dark'
        },
        funky: {
            css: 'funky.css',
            name: 'Funky'
        }
    }
    private _theme: ReplaySubject<string> = new ReplaySubject<string>(1);
    private _themeStyle: ReplaySubject<string> = new ReplaySubject<string>(1);
    private _link: HTMLElement;

    constructor() {
        document.querySelectorAll('link[rel=stylesheet]').forEach(link => {
            const href = link.getAttribute('href');
            if (href.match(/dark\.([a-f0-9]{18,}\.)?css/)) {
                this._link = this._link || (link as HTMLElement);
                this._themes.dark.css = href;
            }
        });
        Promise.resolve().then(() => {
            const savedTheme = localStorage?.getItem('theme');
            if (savedTheme && this._themes[savedTheme]?.css && savedTheme !== 'dark')
                this.theme = savedTheme;
            else
                this._theme.next('dark');
        });
    }

    get themes(): string[] {
        return this._link ? Object.keys(this._themes) : [];
    }

    getName(theme: string) {
        return this._themes[theme].name;
    }

    set theme(theme: string) {
        if (this._link.getAttribute('href') !== this._themes[theme].css) {
            this._link.setAttribute('href', this._themes[theme].css);
            this._theme.next(theme);
            localStorage && localStorage.setItem('theme', theme);
        }
    }

    get theme$(): Observable<string> {
        return this._theme.asObservable();
    }

    set themeStyle(themeStyle: string) {
        this._themeStyle.next(themeStyle);
    }

    get themeStyle$(): Observable<string> {
        return this._themeStyle.asObservable();
    }
}
