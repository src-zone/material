import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Angulartics2Module } from 'angulartics2';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  IndexComponent,
  DocsComponent,
  GuidesComponent,
  GettingstartedComponent,
  IE11Component,
} from './components/app';
import { NotFoundComponent } from './components/shared';
import { SharedModule } from './shared.module';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'blox-app'}),
    AppRoutingModule,
    Angulartics2Module.forRoot(),
    SharedModule,
    InlineSVGModule.forRoot(), HttpClientModule
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
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
