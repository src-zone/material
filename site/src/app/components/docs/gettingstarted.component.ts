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
      "stylePreprocessorOptions": {
        "includePaths": [
          "../node_modules"
        ]
      },
      ...
    }
  ]
  ...
}`;
    indexStylesheets = `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">`;
    pkgTasks = `{
  ...
  "scripts": [
      ...
      "transpile": "ng-transpile --dir dist --verbose --browsers ignore",
      "build": "ng build --prod && npm run transpile",
      ...
  ],
  ...
}`;
    tsPolyfills = `...
/** IE9, IE10 and IE11 requires all of the following polyfills. **/
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
import 'classlist.js';  // Run 'npm install --save classlist.js'.

/** IE10 and IE11 requires the following for the Reflect API. */
import 'core-js/es6/reflect';

/** Evergreen browsers require these. **/
// Used for reflect-metadata in JIT. If you use AOT (and only Angular decorators), you can remove.
import 'core-js/es7/reflect';

...`;

    constructor() {
    }
}
