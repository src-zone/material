import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Angulartics2Module, Angulartics2GoogleTagManager } from 'angulartics2';
import { MaterialModule } from '@blox/material';
import { HighlightJsModule, HIGHLIGHT_JS } from 'angular-highlight-js';
import { AppComponent } from './app.component';
import { OverviewComponent } from './overview.component';
import { routing, appRoutingProviders } from './app.routes';
import {
  DocsComponent,
  GuidesComponent,
  GettingstartedComponent,
  TranspileGuideComponent,

  CodeSampleComponent,
  MDC_DIRECTIVE_DOC_COMPONENTS,

  SnippetButtonComponent,
  SnippetCardComponent,
  SnippetCheckboxComponent,
  SnippetFabComponent,
  SnippetIconToggleComponent,
  SnippetLinearProgressComponent,
  SnippetListComponent, SnippetListTwolineComponent,
  SnippetRadioComponent,
  SnippetSliderComponent,
  SnippetSwitchComponent,
  SnippetTabSimpleComponent,
  SnippetTabScrollerComponent,
  SnippetTextfieldComponent, SnippetTextfieldIconComponent, SnippetTextfieldTextareaComponent,
  SnippetToolbarComponent, SnippetToolbarFlexibleComponent } from './components';

const hljs: any = require('highlight.js/lib/highlight');
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'));
hljs.registerLanguage('html', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
hljs.registerLanguage('json', require('highlight.js/lib/languages/bash'));
export function highlightJsFactory() {
  return hljs;
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    HighlightJsModule.forRoot({
      provide: HIGHLIGHT_JS,
      useFactory: highlightJsFactory
    }),
    routing,
    Angulartics2Module.forRoot([Angulartics2GoogleTagManager])
  ],
  declarations: [
    AppComponent,

    DocsComponent,
    GuidesComponent,
    GettingstartedComponent,
    TranspileGuideComponent,

    OverviewComponent,

    CodeSampleComponent,
    
    ...MDC_DIRECTIVE_DOC_COMPONENTS,

    SnippetButtonComponent,
    SnippetCardComponent,
    SnippetCheckboxComponent,
    SnippetFabComponent,
    SnippetIconToggleComponent,
    SnippetLinearProgressComponent,
    SnippetListComponent, SnippetListTwolineComponent,
    SnippetRadioComponent,
    SnippetSliderComponent,
    SnippetSwitchComponent,
    SnippetTabSimpleComponent,
    SnippetTabScrollerComponent,
    SnippetTextfieldComponent, SnippetTextfieldIconComponent, SnippetTextfieldTextareaComponent,
    SnippetToolbarComponent, SnippetToolbarFlexibleComponent
  ],
  providers: [
    appRoutingProviders,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
