import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { MaterialModule } from '@blox/material';
import { AppComponent } from './app.component';
import { OverviewComponent } from './overview.component';
import { routing, appRoutingProviders } from './app.routes';
import {
  IndexComponent,
  DocsComponent,
  GuidesComponent,
  GettingstartedComponent,

  NotFoundComponent,

  CodeSampleComponent,
  MDC_DIRECTIVE_DOC_COMPONENTS,

  HighlightjsDirective, HighlightjsService,

  SnippetButtonComponent,
  SnippetCardComponent,
  SnippetCheckboxComponent,
  SnippetDialogComponent,
  SnippetDrawerPermanentBelowComponent,
  SnippetDrawerPermanentComponent,
  SnippetDrawerSlidableComponent,
  SnippetElevationComponent,
  SnippetFabComponent,
  SnippetFocusTrapComponent,
  SnippetIconToggleComponent,
  SnippetLinearProgressComponent,
  SnippetListComponent, SnippetListTwolineComponent,
  SnippetMenuComponent,
  SnippetSnackbarComponent,
  SnippetRadioComponent,
  SnippetRippleComponent,
  SnippetSelectComponent,
  SnippetSliderComponent,
  SnippetSwitchComponent,
  SnippetTabSimpleComponent,
  SnippetTabScrollerComponent,
  SnippetTextFieldComponent, SnippetTextFieldIconComponent, SnippetTextFieldTextareaComponent,
  SnippetToolbarComponent, SnippetToolbarFlexibleComponent, IE11Component } from './components';
import { ThemeService } from './services';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    routing,
    Angulartics2Module.forRoot([Angulartics2GoogleTagManager])
  ],
  declarations: [
    AppComponent,

    IndexComponent,
    DocsComponent,
    GuidesComponent,
    GettingstartedComponent,
    IE11Component,

    OverviewComponent,

    NotFoundComponent,

    CodeSampleComponent,

    HighlightjsDirective,
    
    ...MDC_DIRECTIVE_DOC_COMPONENTS,

    SnippetButtonComponent,
    SnippetCardComponent,
    SnippetCheckboxComponent,
    SnippetDialogComponent,
    SnippetDrawerPermanentBelowComponent,
    SnippetDrawerPermanentComponent,
    SnippetDrawerSlidableComponent,
    SnippetElevationComponent,
    SnippetFabComponent,
    SnippetFocusTrapComponent,
    SnippetIconToggleComponent,
    SnippetLinearProgressComponent,
    SnippetListComponent, SnippetListTwolineComponent,
    SnippetMenuComponent,
    SnippetSnackbarComponent,
    SnippetRadioComponent,
    SnippetRippleComponent,
    SnippetSelectComponent,
    SnippetSliderComponent,
    SnippetSwitchComponent,
    SnippetTabSimpleComponent,
    SnippetTabScrollerComponent,
    SnippetTextFieldComponent, SnippetTextFieldIconComponent, SnippetTextFieldTextareaComponent,
    SnippetToolbarComponent, SnippetToolbarFlexibleComponent
  ],
  providers: [
    appRoutingProviders,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    ThemeService,
    HighlightjsService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
