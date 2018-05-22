import { Component } from '@angular/core';
import { MdcSnackbarService } from '@blox/material';
//snip:skip
import { forwardRef } from '@angular/core';
import { AbstractSnippetComponent } from '../abstract.snippet.component';

//snip:endskip
@Component({
    //snip:skip
    providers: [{provide: AbstractSnippetComponent, useExisting: forwardRef(() => SnippetSnackbarComponent)}],
    //snip:endskip
    selector: 'blox-snippet-snackbar',
    templateUrl: './snippet.snackbar.component.html'
})
export class SnippetSnackbarComponent/*snip:skip*/extends AbstractSnippetComponent/*snip:endskip*/ {
    nextSnackbarId = 1;
    messageText: string;
    actionText = 'Action';
    multiline = false;
    actionOnBottom = false;
    currentMessage = '<none>';
    lastAction = '<none>';

    constructor(private snackbar: MdcSnackbarService) {
        //snip:skip
        super({
          'html': require('!raw-loader!./snippet.snackbar.component.html'),
          'typescript': require('!raw-loader!./snippet.snackbar.component.ts')
        });
        //snip:endskip
        this.prefill();
    }

    private prefill() {
        this.messageText = 'Snackbar message with id ' + this.nextSnackbarId;
    }

    show() {
        let id = this.nextSnackbarId++;
        let action = this.actionText;
        let message = this.messageText;
        let snackbarRef = this.snackbar.show({
            message: this.messageText,
            actionText: this.actionText,
            multiline: this.multiline,
            actionOnBottom: this.multiline && this.actionOnBottom
        });
        snackbarRef.afterShow().subscribe(() => {
            this.currentMessage = '\'' + message + '\'';
        });
        snackbarRef.afterHide().subscribe(() => {
            this.currentMessage = '<none>';
        });
        snackbarRef.action().subscribe(() => {
            this.lastAction = '\'' + action + '\' clicked for snackbar \'' + message + '\'';
        });
        this.prefill();
    }
}
