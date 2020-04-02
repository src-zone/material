import { AfterViewInit, Directive, ElementRef, HostBinding, Injectable, Input, SimpleChanges } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HighlightjsService {
    highlight(code: string, lang: string): Observable<string> {
        let result = new ReplaySubject<string>(1);
        import('highlight.js/lib/highlight').then(mod => { // TODO name module hljs
            const hljs = mod.default;
            const langTs = require('highlight.js/lib/languages/typescript');
            const langHtml = require('highlight.js/lib/languages/xml');
            const langScss = require('highlight.js/lib/languages/scss');
            const langBash = require('highlight.js/lib/languages/bash');
            const langJson = require('highlight.js/lib/languages/json')
            hljs.registerLanguage('typescript', langTs);
            hljs.registerLanguage('html', langHtml);
            hljs.registerLanguage('scss', langScss);
            hljs.registerLanguage('bash', langBash);
            hljs.registerLanguage('json', langJson);
            let prettyCode = hljs.highlight(lang, code, true).value;
            result.next(prettyCode);
            result.complete();
        });
        return result.asObservable();
    }
}

@Directive({
    selector: '[highlightJs]',
}) export class HighlightjsDirective implements AfterViewInit {
    private initialized = false;
    @Input() lang: string;
    @Input() source: string;

    constructor(private el: ElementRef, private highlightjs: HighlightjsService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.initialized && (changes['source'] || changes['lang']))
            this.highlight();
    }

    ngAfterViewInit() {
        this.highlight();
        this.initialized = true;
    }

    highlight() {
        let code: string = this.source;
        if (!code && !this.initialized) // first initialize may use the innerHtml
            code = this.el.nativeElement.textContent;
        if (code && this.lang && code.length > 0 && code.trim().length > 0)
            this.highlightjs.highlight(code, this.lang).subscribe(pretty => {
                this.el.nativeElement.innerHTML = pretty;
            });
    }
}
