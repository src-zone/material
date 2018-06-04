import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsRoutingModule } from './components.routing.module';
import { SharedModule } from './shared.module';
import { OverviewComponent } from './overview.component';
import {
  MDC_DIRECTIVE_DOC_COMPONENTS,

  SnippetButtonComponent,
  SnippetCardComponent,
  SnippetCheckboxComponent,
  SnippetChipsComponent, SnippetChipsChoiceComponent, SnippetChipsFilterComponent, SnippetChipsInputComponent,
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
  SnippetToolbarComponent, SnippetToolbarFlexibleComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ComponentsRoutingModule
  ],
  declarations: [
    OverviewComponent,

    ...MDC_DIRECTIVE_DOC_COMPONENTS,

    SnippetButtonComponent,
    SnippetCardComponent,
    SnippetCheckboxComponent,
    SnippetChipsComponent, SnippetChipsChoiceComponent, SnippetChipsFilterComponent, SnippetChipsInputComponent,
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
  ]
})
export class ComponentsModule {}
