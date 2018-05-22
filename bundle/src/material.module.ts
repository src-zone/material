import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdcButtonDirective, MdcButtonIconDirective } from './components/button/mdc.button.directive';
import { MdcCardDirective,
    MdcCardMediaDirective,
    MdcCardMediaContentDirective,
    MdcCardActionButtonsDirective,
    MdcCardActionIconsDirective,
    MdcCardActionsDirective,
    MdcCardPrimaryActionDirective } from './components/card/mdc.card.directive';
import { MdcCheckboxDirective,
    MdcCheckboxInputDirective } from './components/checkbox/mdc.checkbox.directive';
import { DIALOG_DIRECTIVES } from './components/dialog/mdc.dialog.directive';
import { MdcDrawerDirective,
    MdcDrawerContainerDirective,
    MdcDrawerToolbarSpacerDirective,
    MdcDrawerHeaderDirective,
    MdcDrawerHeaderContentDirective,
    MdcDrawerContentDirective } from './components/drawer/mdc.drawer.directive';
import { MdcElevationDirective } from './components/elevation/mdc.elevation.directive';
import { MdcFabDirective,
    MdcFabIconDirective } from './components/fab/mdc.fab.directive';
import { MdcFloatingLabelDirective } from './components/floating-label/mdc.floating-label.directive';
import { FOCUS_TRAP_DIRECTIVES } from './components/focus-trap/mdc.focus-trap.directive';
import { MdcFormFieldDirective,
    MdcFormFieldInputDirective,
    MdcFormFieldLabelDirective } from './components/form-field/mdc.form-field.directive';
import { MdcIconDirective } from './components/icon/mdc.icon.directive';
import { MdcIconToggleDirective,
    MdcIconToggleIconDirective,
    MdcFormsIconToggleDirective } from './components/icon-toggle/mdc.icon-toggle.directive';
import { MdcLinearProgressDirective } from './components/linear-progress/mdc.linear-progress.directive';
import { MdcListDividerDirective,
    MdcListItemDirective,
    MdcListItemTextDirective,
    MdcListItemSecondaryTextDirective,
    MdcListItemGraphicDirective,
    MdcListItemMetaDirective,
    MdcListDirective,
    MdcListGroupSubHeaderDirective,
    MdcListGroupDirective } from './components/list/mdc.list.directive';
import { MdcMenuAnchorDirective, MdcMenuDirective } from './components/menu/mdc.menu.directive';
import { MdcRadioDirective,
    MdcRadioInputDirective } from './components/radio/mdc.radio.directive';
import { MdcRippleDirective } from './components/ripple/mdc.ripple.directive';
import { MdcSelectDirective, MdcSelectControlDirective } from './components/select/mdc.select.directive';
import { MdcSliderDirective,
    MdcFormsSliderDirective } from './components/slider/mdc.slider.directive';
import { MdcSnackbarService, MDC_SNACKBAR_PROVIDER } from './components/snackbar/mdc.snackbar.service';
import { MdcSwitchInputDirective,
    MdcSwitchDirective } from './components/switch/mdc.switch.directive';    
import { AbstractMdcTabDirective, MdcTabDirective,
    MdcTabIconDirective,
    MdcTabIconTextDirective,
    MdcTabChange } from './components/tabs/mdc.tab.directive';
import { MdcTabRouterDirective } from './components/tabs/mdc.tab.router.directive';
import { MdcTabBarDirective } from './components/tabs/mdc.tab.bar.directive';
import { MdcTabBarScrollerDirective,
    MdcTabBarScrollerInnerDirective,
    MdcTabBarScrollerBackDirective,
    MdcTabBarScrollerForwardDirective,
    MdcTabBarScrollerFrameDirective } from './components/tabs/mdc.tab.bar.scroller.directive';
import { MdcTextFieldDirective,
    MdcTextFieldInputDirective,
    MdcTextFieldIconDirective,
    MdcTextFieldHelperTextDirective } from './components/text-field/mdc.text-field.directive';
import { MdcToolbarDirective,
    MdcToolbarRowDirective,
    MdcToolbarSectionDirective,
    MdcToolbarTitleDirective,
    MdcToolbarIcon,
    MdcToolbarMenuIcon,
    MdcToolbarFixedAdjustDirective } from './components/toolbar/mdc.toolbar.directive';
import { MdcScrollbarResizeDirective } from './components/utility/mdc.scrollbar-resize.directive';
import { MdcEventRegistry, MDC_EVENT_REGISTRY_PROVIDER } from './utils/mdc.event.registry';

export * from './components/button/mdc.button.directive';
export { MdcCardDirective,
    MdcCardMediaDirective,
    MdcCardMediaContentDirective,
    MdcCardActionButtonsDirective,
    MdcCardActionIconsDirective,
    MdcCardActionsDirective,
    MdcCardPrimaryActionDirective } from './components/card/mdc.card.directive';
export { MdcCheckboxDirective,
    MdcCheckboxInputDirective } from './components/checkbox/mdc.checkbox.directive';
export * from './components/dialog/mdc.dialog.directive';
export { MdcDrawerDirective,
    MdcDrawerContainerDirective,
    MdcDrawerToolbarSpacerDirective,
    MdcDrawerHeaderDirective,
    MdcDrawerHeaderContentDirective,
    MdcDrawerContentDirective } from './components/drawer/mdc.drawer.directive';
export { MdcElevationDirective } from './components/elevation/mdc.elevation.directive';
export { MdcFabDirective,
    MdcFabIconDirective } from './components/fab/mdc.fab.directive';
export { MdcFloatingLabelDirective } from './components/floating-label/mdc.floating-label.directive';
export * from './components/focus-trap/abstract.mdc.focus-trap';
export * from './components/focus-trap/mdc.focus-trap.directive';
export { MdcFormFieldDirective,
    MdcFormFieldInputDirective,
    MdcFormFieldLabelDirective } from './components/form-field/mdc.form-field.directive';
export { MdcIconDirective } from './components/icon/mdc.icon.directive';
export { MdcIconToggleDirective,
    MdcIconToggleIconDirective,
    MdcFormsIconToggleDirective } from './components/icon-toggle/mdc.icon-toggle.directive';
export { MdcLinearProgressDirective } from './components/linear-progress/mdc.linear-progress.directive';
export { MdcListDividerDirective,
    MdcListItemDirective,
    MdcListItemTextDirective,
    MdcListItemSecondaryTextDirective,
    MdcListItemGraphicDirective,
    MdcListItemMetaDirective,
    MdcListDirective,
    MdcListGroupSubHeaderDirective,
    MdcListGroupDirective } from './components/list/mdc.list.directive';
export { MdcMenuAnchorDirective, MdcMenuDirective } from './components/menu/mdc.menu.directive';    
export { MdcRadioDirective,
    MdcRadioInputDirective } from './components/radio/mdc.radio.directive';
export * from './components/ripple/abstract.mdc.ripple';
export { MdcRippleDirective } from './components/ripple/mdc.ripple.directive';
export { MdcSelectDirective, MdcSelectControlDirective } from './components/select/mdc.select.directive';
export { MdcSliderDirective,
    MdcFormsSliderDirective } from './components/slider/mdc.slider.directive';
export { MdcSnackbarMessage } from './components/snackbar/mdc.snackbar.message';
export { MdcSnackbarService } from './components/snackbar/mdc.snackbar.service';
export { MdcSwitchInputDirective,
    MdcSwitchDirective } from './components/switch/mdc.switch.directive';
export { AbstractMdcTabDirective, MdcTabDirective,
    MdcTabIconDirective,
    MdcTabIconTextDirective,
    MdcTabChange } from './components/tabs/mdc.tab.directive';
export { MdcTabRouterDirective } from './components/tabs/mdc.tab.router.directive';
export { MdcTabBarDirective } from './components/tabs/mdc.tab.bar.directive';
export { MdcTabBarScrollerDirective,
    MdcTabBarScrollerInnerDirective,
    MdcTabBarScrollerBackDirective,
    MdcTabBarScrollerForwardDirective,
    MdcTabBarScrollerFrameDirective }
export { MdcTextFieldDirective,
    MdcTextFieldInputDirective,
    MdcTextFieldIconDirective,
    MdcTextFieldHelperTextDirective } from './components/text-field/mdc.text-field.directive';
export { MdcToolbarDirective,
    MdcToolbarRowDirective,
    MdcToolbarSectionDirective,
    MdcToolbarTitleDirective,
    MdcToolbarIcon,
    MdcToolbarMenuIcon,
    MdcToolbarFixedAdjustDirective } from './components/toolbar/mdc.toolbar.directive';
export { MdcScrollbarResizeDirective } from './components/utility/mdc.scrollbar-resize.directive';
export { MdcEventRegistry } from './utils/mdc.event.registry';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        MDC_EVENT_REGISTRY_PROVIDER,
        MDC_SNACKBAR_PROVIDER
    ],
    declarations: [
        MdcButtonDirective, MdcButtonIconDirective,
        MdcCardDirective, MdcCardMediaDirective, MdcCardMediaContentDirective,
        MdcCardActionButtonsDirective, MdcCardActionIconsDirective, MdcCardActionsDirective, MdcCardPrimaryActionDirective,
        MdcCheckboxDirective, MdcCheckboxInputDirective,
        ...DIALOG_DIRECTIVES,
        MdcDrawerDirective, MdcDrawerContainerDirective, MdcDrawerToolbarSpacerDirective, MdcDrawerHeaderDirective, MdcDrawerHeaderContentDirective, MdcDrawerContentDirective,
        MdcElevationDirective,
        MdcFabDirective, MdcFabIconDirective,
        MdcFloatingLabelDirective,
        ...FOCUS_TRAP_DIRECTIVES,
        MdcFormFieldDirective, MdcFormFieldInputDirective, MdcFormFieldLabelDirective,
        MdcIconDirective,
        MdcIconToggleDirective, MdcIconToggleIconDirective, MdcFormsIconToggleDirective,
        MdcLinearProgressDirective,
        MdcListDividerDirective, MdcListItemDirective, MdcListItemTextDirective, MdcListItemSecondaryTextDirective,
        MdcListItemGraphicDirective, MdcListItemMetaDirective, MdcListDirective, MdcListGroupSubHeaderDirective, MdcListGroupDirective,
        MdcMenuAnchorDirective, MdcMenuDirective,
        MdcRadioDirective, MdcRadioInputDirective,
        MdcRippleDirective,
        MdcSelectDirective, MdcSelectControlDirective,
        MdcSliderDirective, MdcFormsSliderDirective,
        MdcSwitchInputDirective, MdcSwitchDirective,
        MdcTabDirective, MdcTabIconDirective, MdcTabIconTextDirective,
        MdcTabRouterDirective,
        MdcTabBarDirective,
        MdcTabBarScrollerDirective, MdcTabBarScrollerInnerDirective, MdcTabBarScrollerBackDirective, MdcTabBarScrollerForwardDirective, MdcTabBarScrollerFrameDirective,
        MdcTextFieldDirective, MdcTextFieldInputDirective, MdcTextFieldIconDirective, MdcTextFieldHelperTextDirective,
        MdcToolbarDirective, MdcToolbarRowDirective, MdcToolbarSectionDirective, MdcToolbarTitleDirective, MdcToolbarIcon, MdcToolbarMenuIcon, MdcToolbarFixedAdjustDirective,
        MdcScrollbarResizeDirective
    ],
    exports: [
        MdcButtonDirective, MdcButtonIconDirective,
        MdcCardDirective, MdcCardMediaDirective, MdcCardMediaContentDirective,
        MdcCardActionButtonsDirective, MdcCardActionIconsDirective, MdcCardActionsDirective, MdcCardPrimaryActionDirective,
        MdcCheckboxDirective, MdcCheckboxInputDirective,
        ...DIALOG_DIRECTIVES,
        MdcDrawerDirective, MdcDrawerContainerDirective, MdcDrawerToolbarSpacerDirective, MdcDrawerHeaderDirective, MdcDrawerHeaderContentDirective, MdcDrawerContentDirective,
        MdcElevationDirective,
        MdcFabDirective, MdcFabIconDirective,
        MdcFloatingLabelDirective,
        ...FOCUS_TRAP_DIRECTIVES,
        MdcFormFieldDirective, MdcFormFieldInputDirective, MdcFormFieldLabelDirective,
        MdcIconDirective,
        MdcIconToggleDirective, MdcIconToggleIconDirective, MdcFormsIconToggleDirective,
        MdcLinearProgressDirective,
        MdcListDividerDirective, MdcListItemDirective, MdcListItemTextDirective, MdcListItemSecondaryTextDirective,
        MdcListItemGraphicDirective, MdcListItemMetaDirective, MdcListDirective, MdcListGroupSubHeaderDirective, MdcListGroupDirective,
        MdcMenuAnchorDirective, MdcMenuDirective,
        MdcRadioDirective, MdcRadioInputDirective,
        MdcRippleDirective,
        MdcSelectDirective, MdcSelectControlDirective,
        MdcSliderDirective, MdcFormsSliderDirective,
        MdcSwitchInputDirective, MdcSwitchDirective,
        MdcTabDirective, MdcTabIconDirective, MdcTabIconTextDirective,
        MdcTabRouterDirective,
        MdcTabBarDirective,
        MdcTabBarScrollerDirective, MdcTabBarScrollerInnerDirective, MdcTabBarScrollerBackDirective, MdcTabBarScrollerForwardDirective, MdcTabBarScrollerFrameDirective,
        MdcTextFieldDirective, MdcTextFieldInputDirective, MdcTextFieldIconDirective, MdcTextFieldHelperTextDirective,
        MdcToolbarDirective, MdcToolbarRowDirective, MdcToolbarSectionDirective, MdcToolbarTitleDirective, MdcToolbarIcon, MdcToolbarMenuIcon, MdcToolbarFixedAdjustDirective,
        MdcScrollbarResizeDirective
    ]
})
export class MaterialModule {}
