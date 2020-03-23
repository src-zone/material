import { AfterContentInit, Component, ContentChildren, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subject, merge, fromEvent } from 'rxjs';
import { takeUntil, auditTime } from 'rxjs/operators';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { filter, map } from 'rxjs/operators';
import { ThemeService } from './services';

declare const PRODUCTION: any;
const messages = require('./messages.json');
const defaultTitle = messages['default.title'];
const defaultMetaDescription = messages['default.meta.description'];

@Component({
    selector: 'blox-app',
    templateUrl: './app.component.html'
})
export class AppComponent implements AfterContentInit, OnDestroy {
    private onDestroy$: Subject<any> = new Subject();
    year = new Date().getFullYear();
    appliedTheme: string;
    // TODO below fields should go back to the template, or at least be static
    //  Reason that didn't work anymore is that the loader chain returns a module instead of a string
    //  which the outdated html-loader can't handle. To upgrade html-loader we need to
    //  rewrite the interpolate option to a preprocessor function.
    LOGO_TWITTER: SafeHtml;
    LOGO_GITHUB: SafeHtml;

    constructor(
        private titleService: Title,
        private metaService: Meta,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private elm: ElementRef,
        private renderer: Renderer2,
        private theme: ThemeService,
        angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
        private angulartics2: Angulartics2,
        private sanitizer: DomSanitizer)
    {
        this.LOGO_TWITTER = this.sanitizer.bypassSecurityTrustHtml(require('!inline!svg!assets/img/logos/twitter.svg').default);
        this.LOGO_GITHUB =  this.sanitizer.bypassSecurityTrustHtml(require('!inline!svg!assets/img/logos/github.svg').default);
        this.angulartics2.settings.developerMode = !PRODUCTION;
        angulartics2GoogleTagManager.startTracking();
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => {
                let route = this.activatedRoute;
                let meta = this.mergeMeta(route, {});
                while (route.firstChild) {
                    route = route.firstChild;
                    meta = this.mergeMeta(route, meta);
                }
                return meta;
            })
        ).subscribe((meta) => {
            this.setMeta(meta);
        });
    }

    ngAfterContentInit() {
        this.trackInteractions();
        this.theme.theme$.pipe(takeUntil(this.onDestroy$)).subscribe((theme) => {
            if (this.appliedTheme !== theme) {
                if (theme)
                    this.renderer.addClass(this.elm.nativeElement, theme);
                if (this.appliedTheme)
                    this.renderer.removeClass(this.elm.nativeElement, this.appliedTheme);
                this.appliedTheme = theme;
            }
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    setMeta(meta: {type?: string, href?: string}) {
        let titleKey = '' + meta.type + '.' + meta.href + '.title';
        let title = messages[titleKey];
        if (title == null)
            title = defaultTitle;
        else
            title += ' - ' + defaultTitle;
        this.titleService.setTitle(title);

        let metaDescrKey = '' + meta.type + '.' + meta.href + '.meta.description';
        let description = messages[metaDescrKey];
        if (description == null)
            description = defaultMetaDescription;
        else
            description = description.replace("${default.meta.description}", defaultMetaDescription);
        this.metaService.updateTag({content: description}, "name='description'");
    }

    mergeMeta(route: ActivatedRoute, meta: {type?: string, href?: string}) {
        if (route.component) {
            meta.type = route.component['DOC_TYPE'] || meta.type;
            meta.href = route.component['DOC_HREF'] || meta.href;
        }
        return meta;
    }

    trackInteractions() {
        let eventListeners = [
            'click', 'keydown', 'mousemove', 'scroll', 'resize'
        ].map(event => fromEvent(window, event));
        merge(...eventListeners).pipe(
            takeUntil(this.onDestroy$),
            auditTime(30000)
        ).subscribe(ev => {
            this.angulartics2.eventTrack.next({
                action: 'interaction',
                properties: {
                    category: 'interaction'
                }
            });
        });
    }
}
