import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routes';
import {
  IndexComponent,
  DocsComponent,
  GuidesComponent,
  GettingstartedComponent,
  IE11Component,

  NotFoundComponent,

  CodeSampleComponent,
  HighlightjsDirective, HighlightjsService
} from './components';
import { SharedModule } from './shared.module';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    Angulartics2Module.forRoot([Angulartics2GoogleTagManager]),
    SharedModule
  ],
  declarations: [
    AppComponent,

    IndexComponent,
    DocsComponent,
    GuidesComponent,
    GettingstartedComponent,
    IE11Component,

    NotFoundComponent,
  ],
  providers: [
    appRoutingProviders,
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
