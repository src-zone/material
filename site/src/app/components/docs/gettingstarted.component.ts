import { Component } from '@angular/core';

@Component({
  selector: 'blox-gettingstarted',
  templateUrl: './gettingstarted.component.html'
})
export class GettingstartedComponent {
    codeInstall = 'npm install --save @blox/material';
    codeModule = `
import { MaterialModule } from '@blox/material';

@NgModule({
  ...
  imports: [
    BrowserModule,
    MaterialModule,
    ...
  ],
  ...
})
export class MyAppModule { }
    `;
    codeCss = '<link rel="stylesheet" href="/node_modules/material-components-web/dist/material-components-web.css">';

    constructor() {
    }
}
