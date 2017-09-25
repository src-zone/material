import { Component } from '@angular/core';
import { MDC_DIRECTIVE_DOC_COMPONENTS } from './components';

const messages = require('./messages.json');

@Component({
  selector: 'blox-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent {
    components = MDC_DIRECTIVE_DOC_COMPONENTS.map(c => ({
        'title': messages[c.DOC_TYPE + '.' + c.DOC_HREF + '.title'],
        'description': messages[c.DOC_TYPE + '.' + c.DOC_HREF + '.description'],
        'img': c.DOC_SVG,
        'href': '/' + c.DOC_TYPE + '/' + c.DOC_HREF
    }));
    
    constructor() {
    }
}
