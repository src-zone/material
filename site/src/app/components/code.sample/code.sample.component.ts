import { Component, ContentChild, AfterContentInit } from '@angular/core';
import { AbstractSnippetComponent } from '../snippets/abstract.snippet.component';

@Component({
  selector: 'blox-code-sample',
  templateUrl: './code.sample.component.html'
})
export class CodeSampleComponent implements AfterContentInit {
    @ContentChild(AbstractSnippetComponent) snippet;
    snippetNames: string[] = [];
    active: string;
    showCode: false;

    constructor() {
    }

    ngAfterContentInit() {
        if (this.snippet != null) {
            for (let name in this.snippet.code) {
                if (this.active == null)
                    this.active = name;
                if (this.snippet.code.hasOwnProperty(name))
                    this.snippetNames.push(name);
            }
        }
    }

    isActive(name: string) {
        return name === this.active || (name == null && !this.active);
    }

    activate(name) {
        this.active = name;
    }
}
