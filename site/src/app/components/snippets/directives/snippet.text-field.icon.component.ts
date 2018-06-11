import { Component } from '@angular/core';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';
//snip:endskip
@Component({
  //snip:skip
  providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetTextFieldIconComponent)}],
  //snip:endskip
  selector: 'blox-snippet-text-field-icon',
  templateUrl: './snippet.text-field.icon.component.html'
})
export class SnippetTextFieldIconComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    private _box = true;
    private _outlined = false;
    disabled = false;
    required = false;
    persistent = false;
    dense = false;
    field1: string;
    field2: string;

    //snip:skip
    constructor() {
        super({
          'html': require('!raw-loader!./snippet.text-field.icon.component.html'),
          'typescript': require('!raw-loader!./snippet.text-field.icon.component.ts')
        });
    }
    //snip:endskip

    clearField2() {
        this.field2 = null;
    }

    get box() {
        return this._box;
    }

    set box(value: boolean) {
        this._box = value;
        if (value)
            this._outlined = false;
    }

    get outlined() {
        return this._outlined;
    }

    set outlined(value: boolean) {
        this._outlined = value;
        if (value)
            this._box = false;
    }
}
