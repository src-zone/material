import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MDC_DIRECTIVE_DOC_COMPONENTS } from './components';

const messages = require('./messages.json');

@Component({
  selector: 'blox-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent {
    static DOC_TYPE = 'components';
    static DOC_HREF = 'overview';

    components: {title: string, description: string, img: any, href: string}[];
    
    constructor(private sanitizer: DomSanitizer) {
        this.components = MDC_DIRECTIVE_DOC_COMPONENTS.map(c => ({
            'title': messages[c.DOC_TYPE + '.' + c.DOC_HREF + '.title'],
            'description': messages[c.DOC_TYPE + '.' + c.DOC_HREF + '.description'],
            'img': this.sanitizer.bypassSecurityTrustHtml(c.DOC_SVG.default),
            'href': '/' + c.DOC_TYPE + '/' + c.DOC_HREF
        }))
    }
}
