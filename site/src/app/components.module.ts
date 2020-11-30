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
  SnippetDrawerBelowComponent,
  SnippetDrawerComponent,
  SnippetElevationComponent,
  SnippetFabComponent,
  SnippetFocusTrapComponent,
  SnippetIconButtonComponent,
  SnippetLinearProgressComponent,
  SnippetListComponent, SnippetListTwolineComponent,
  SnippetMenuComponent,
  SnippetRadioComponent,
  SnippetRippleComponent,
  SnippetSelectComponent,
  SnippetSliderComponent,
  SnippetSnackbarComponent,  
  SnippetSwitchComponent,
  SnippetTabIconsComponent,
  SnippetTabRoutingComponent,
  SnippetTabScrollerComponent,
  SnippetTabSimpleComponent,
  SnippetTextFieldComponent, SnippetTextFieldIconComponent, SnippetTextFieldTextareaComponent,
  // SnippetToolbarComponent, SnippetToolbarFlexibleComponent,
  // SnippetTopAppBarComponent
} from './components/components';

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
    SnippetDrawerBelowComponent,
    SnippetDrawerComponent,
    SnippetElevationComponent,
    SnippetFabComponent,
    SnippetFocusTrapComponent,
    SnippetIconButtonComponent,
    SnippetLinearProgressComponent,
    SnippetListComponent, SnippetListTwolineComponent,
    SnippetMenuComponent,
    SnippetRadioComponent,
    SnippetRippleComponent,
    SnippetSelectComponent,
    SnippetSliderComponent,
    SnippetSnackbarComponent,
    SnippetSwitchComponent,
    SnippetTabIconsComponent,
    SnippetTabRoutingComponent,
    SnippetTabScrollerComponent,
    SnippetTabSimpleComponent,
    SnippetTextFieldComponent, SnippetTextFieldIconComponent, SnippetTextFieldTextareaComponent,
    // SnippetToolbarComponent, SnippetToolbarFlexibleComponent,
    // SnippetTopAppBarComponent
  ]
})
export class ComponentsModule {}
