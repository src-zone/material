import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

require('./style/app.scss');

declare const PRODUCTION: any;

// PRODUCTION is injected by webpack depending on the build/run:
if (PRODUCTION) {
  enableProdMode();
} else {
  console.log('development mode');
}

platformBrowserDynamic().bootstrapModule(AppModule);
