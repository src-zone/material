import 'core-js';
import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';

import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);

// by including all sources here (including non spec.ts files, we'll get
// proper 0% coverage reports for sources not included in any test):
const testContext = (<any>require).context('.', true, /\.ts/);
testContext.keys().forEach(testContext);
