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
    private _oldLink: HTMLLinkElement; // when we change theme we remove the old link once the new one is loaded
    private _link: HTMLLinkElement;
    private _thColor: Element;
    private onLoadListener = () => {
        if (this._oldLink) {
            this._oldLink.parentElement.removeChild(this._oldLink);
            this._oldLink = null;
        }
        this.setThemeColor();
    };

    constructor() {
        this._thColor = document.querySelector('meta[name="theme-color"]');
        document.querySelectorAll('link[rel=stylesheet]').forEach(link => {
            const href = link.getAttribute('href');
            if (href.match(/dark\.([a-f0-9]{18,}\.)?css/)) {
                this._link = this._link || (link as HTMLLinkElement);
                this._themes.dark.css = href;
                this._link.addEventListener('load', this.onLoadListener, false);
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
            // if we still have an oldLink, remove it first:
            if (this._oldLink)
                this._oldLink.parentElement.removeChild(this._oldLink);
            // some browsers (e.g. chrome) will not trigger the 'load' event when we just change the href tag
            // on the link element. So instead we will create a new element, and after it's loaded remove the
            // old link element:
            this._oldLink = this._link;
            this._oldLink.removeEventListener('load', this.onLoadListener, false);
            const head = this._oldLink.parentElement;
            this._link = document.createElement('link');
            this._link.rel = 'stylesheet';
            this._link.type = 'text/css';
            this._link.addEventListener('load', this.onLoadListener, false);
            this._link.href = this._themes[theme].css;
            head.insertBefore(this._link, this._oldLink.nextElementSibling);
            // some browsers still don't trigger the 'load' event, so after half a second
            // we will assume the stylesheet was loaded (set the theme color, remove the oldLink),
            // if the load event still triggers after that, it will just set the theme color for
            // the properly loaded stylesheet:
            setTimeout(this.onLoadListener, 500);
            // broadcast and save the theme settings:
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

    private setThemeColor() {
        const header = document.querySelector('header.blox-header');
        if (header && this._thColor && window.getComputedStyle) {
            this._thColor.setAttribute('content', asHexColor(window.getComputedStyle(header, null).getPropertyValue('background-color')));
        } else
            console.log('unable to set theme color');
    }
}

function asHexColor(color: string) {
    if (color.startsWith('rgb(')) {
        const sep = color.indexOf(',') > -1 ? ',' : ' ';
        const rgb = color.substr(4).split(")")[0].split(sep);
        const r = prefixed((+rgb[0]).toString(16));
        const g = prefixed((+rgb[1]).toString(16));
        const b = prefixed((+rgb[2]).toString(16));
        return "#" + r + g + b;
    } else
        return color;
}

function prefixed(hex: string) {
    return hex.length === 1 ? ("0" + hex) : hex;
}
