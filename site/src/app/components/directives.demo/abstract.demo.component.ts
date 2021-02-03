import { DOCUMENT } from "@angular/common";
import { AfterViewInit, Directive, Inject } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Directive()
export abstract class AbstractDemoComponent implements AfterViewInit {  
    constructor(public apiDoc: SafeHtml, @Inject(DOCUMENT) private doc: Document, private router: Router) {
    }

    ngAfterViewInit() {
        // fix anchor links inside the apidocs parts, so that the angular router is used,
        // instead of a pull page (re)load for the linked page:
        this.doc.querySelector('div.blox-docs-api').querySelectorAll('a[href]').forEach(anchor => {
            const href = anchor.getAttribute('href');
            if (href.startsWith('/')) {
                anchor.addEventListener('click', (e) => {
                    this.router.navigateByUrl(href);
                    e.preventDefault();
                    return false;
                });
            }
        });
    }
}
