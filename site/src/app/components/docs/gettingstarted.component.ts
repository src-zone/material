import { Component } from '@angular/core';

@Component({
  selector: 'blox-gettingstarted',
  templateUrl: './gettingstarted.component.html'
})
export class GettingstartedComponent {
    codeModule = `import { FormsModule } from '@angular/forms'; // (optional)   
import { MaterialModule } from '@blox/material';

@NgModule({
  ...
  imports: [
    BrowserModule,
    FormsModule,      // using FormsModule is optional
    MaterialModule,
    ...
  ],
  ...
})
export class MyAppModule { }`;
    codeScss = `// customize some theme variables, e.g.:
$mdc-theme-primary: #212121;
$mdc-theme-secondary: #00e871;
$mdc-theme-background: #fff;

// import theming for all mdc components:
@import "material-components-web/material-components-web";`
    cliIncludeThemes = `{
  ...
  "apps": [
    {
      ...
      stylePreprocessorOptions": {
        "includePaths": [
          "../node-modules"
        ]
      },
      ...
    }
  ]
  ...
}`;

    constructor() {
    }
}
