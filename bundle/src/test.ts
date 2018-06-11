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
testContext.keys().forEach(testContext);

function addStyleSheet(href: string) {
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    document.querySelector('head').appendChild(link);
}