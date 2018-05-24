import { Component } from '@angular/core';

@Component({
  selector: 'blox-gettingstarted',
  templateUrl: './gettingstarted.component.html'
})
export class GettingstartedComponent {
    static DOC_TYPE = 'guides';
    static DOC_HREF = 'gettingStarted';

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
$mdc-theme-primary: #6200ee;
$mdc-theme-secondary: #018786;
$mdc-theme-background: #fff;

// import theming for all mdc components:
@import "material-components-web/material-components-web";`

    cliIncludeThemes = `{
  "projects": { "NAME-OF-PROJECT": { "architect": { "build": {
    ...
    "options": {
      ...
      "styles": ...
      ...
      "stylePreprocessorOptions": {
        "includePaths": [
          "node_modules"
        ]
      },
      ...
    }}}}
  }
  ...
}`;
    indexStylesheets = `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">`;

    constructor() {
    }
}
