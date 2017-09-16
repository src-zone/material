import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@blox/material';
import { HighlightJsModule, HIGHLIGHT_JS } from 'angular-highlight-js';
import { AppComponent } from './app.component';
import { OverviewComponent } from './overview.component';
import { routing, appRoutingProviders } from './app.routes';
import { CodeSampleComponent,
  ButtonDirectivesComponent,
  CheckboxDirectivesComponent,
  FabDirectivesComponent,
  TabDirectivesComponent,

  SnippetButtonComponent,
  SnippetCheckboxComponent,
  SnippetFabComponent,
  SnippetTabSimpleComponent,
  SnippetTabScrollerComponent } from './components';

const hljs: any = require('highlight.js/lib/highlight');
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'));
hljs.registerLanguage('html', require('highlight.js/lib/languages/xml'));
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
    routing
  ],
  declarations: [
    AppComponent,
    OverviewComponent,
    CodeSampleComponent,
    
    ButtonDirectivesComponent,
    CheckboxDirectivesComponent,
    FabDirectivesComponent,
    TabDirectivesComponent,

    SnippetButtonComponent,
    SnippetCheckboxComponent,
    SnippetFabComponent,
    SnippetTabSimpleComponent,
    SnippetTabScrollerComponent
  ],
  providers: [
    appRoutingProviders,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
