import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';

const messages = require('./messages.json');
const defaultTitle = messages['default.title'];
const defaultMetaDescription = messages['default.meta.description'];

@Component({
    selector: 'blox-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    year = 2017;

    constructor(
        private titleService: Title,
        private metaService: Meta,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
        angulartics2: Angulartics2)
    {
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
}
