import 'core-js';
import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';

import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// have these stylesheets available for all tests:
addStyleSheet('https://fonts.googleapis.com/css?family=Roboto:300,400,500');
addStyleSheet('https://fonts.googleapis.com/icon?family=Material+Icons');

getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);

// by including all sources here (including non spec.ts files, we'll get
// proper 0% coverage reports for sources not included in any test):
const testContext = (<any>require).context('.', true, /\.ts/);
//const testContext = (<any>require).context('.', true, /\.(button|checkbox|chip|dialog|drawer|elevation|fab|focus-trap|form-field|icon-button|linear-progress|list|menu|menu-surface|radio|ripple|select|slider|switch|text-field|top-app-bar)\.directive\.spec\.ts/);
//const testContext = (<any>require).context('.', true, /\.(focus-trap)\.directive\.spec\.ts/);
testContext.keys().forEach(testContext);

function addStyleSheet(href: string) {
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    document.querySelector('head').appendChild(link);
}