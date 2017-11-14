import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdcButtonDirective } from './components/button/mdc.button.directive';
import { MdcCardDirective,
    MdcCardHorizontalDirective,
    MdcCardPrimaryDirective,
    MdcCardTitleDirective,
    MdcCardSubtitleDirective,
    MdcCardTextDirective,
    MdcCardMediaDirective,
    MdcCardMediaItemDirective,
    MdcCardActionsDirective } from './components/card/mdc.card.directive';
import { MdcCheckboxDirective,
    MdcCheckboxInputDirective } from './components/checkbox/mdc.checkbox.directive';
import { MdcElevationDirective } from './components/elevation/mdc.elevation.directive';
import { MdcFabDirective,
    MdcFabIconDirective } from './components/fab/mdc.fab.directive';
import { MdcFormFieldDirective,
    MdcFormFieldInputDirective,
    MdcFormFieldLabelDirective } from './components/form-field/mdc.form-field.directive';
import { MdcIconToggleDirective,
    MdcIconToggleIconDirective,
    MdcFormsIconToggleDirective } from './components/icon-toggle/mdc.icon-toggle.directive';
import { MdcLinearProgressDirective } from './components/linear-progress/mdc.linear-progress.directive';
import { MdcListDividerDirective,
    MdcListItemDirective,
    MdcListItemTextDirective,
    MdcListItemTextSecondaryDirective,
    MdcListItemStartDetailDirective,
    MdcListItemEndDetailDirective,
    MdcListDirective,
    MdcListGroupSubHeaderDirective,
    MdcListGroupDirective } from './components/list/mdc.list.directive';
import { MdcMenuAnchorDirective, MdcSimpleMenuDirective } from './components/menu/mdc.simple.menu.directive';
import { MdcRadioDirective,
    MdcRadioInputDirective } from './components/radio/mdc.radio.directive';
import { MdcRippleDirective } from './components/ripple/mdc.ripple.directive';
import { MdcSelectDirective,
    MdcSelectTextDirective,
    MdcFormsSelectDirective,
    MdcSelectNativeDirective,
    MdcSelectMultipleNativeDirective,
    MdcSelectGroupNativeDirective,
    MdcSelectOptionNativeDirective } from './components/select/mdc.select.directive';
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
    MdcTextFieldLabelDirective,
    MdcTextFieldHelptextDirective } from './components/text-field/mdc.text-field.directive';
import { MdcToolbarDirective,
    MdcToolbarRowDirective,
    MdcToolbarSectionDirective,
    MdcToolbarTitleDirective,
    MdcToolbarIcon,
    MdcToolbarMenuIcon,
    MdcToolbarFixedAdjustDirective } from './components/toolbar/mdc.toolbar.directive';
import { MdcScrollbarResizeDirective } from './components/utility/mdc.scrollbar-resize.directive';
import { MdcEventRegistry, MDC_EVENT_REGISTRY_PROVIDER } from './utils/mdc.event.registry';

export { MdcButtonDirective } from './components/button/mdc.button.directive';
export { MdcCardDirective,
    MdcCardHorizontalDirective,
    MdcCardPrimaryDirective,
    MdcCardTitleDirective,
    MdcCardSubtitleDirective,
    MdcCardTextDirective,
    MdcCardMediaDirective,
    MdcCardMediaItemDirective,
    MdcCardActionsDirective } from './components/card/mdc.card.directive';
export { MdcCheckboxDirective,
    MdcCheckboxInputDirective } from './components/checkbox/mdc.checkbox.directive';
export { MdcElevationDirective } from './components/elevation/mdc.elevation.directive';
export { MdcFabDirective,
    MdcFabIconDirective } from './components/fab/mdc.fab.directive';
export { MdcFormFieldDirective,
    MdcFormFieldInputDirective,
    MdcFormFieldLabelDirective } from './components/form-field/mdc.form-field.directive';
export { MdcIconToggleDirective,
    MdcIconToggleIconDirective,
    MdcFormsIconToggleDirective } from './components/icon-toggle/mdc.icon-toggle.directive';
export { MdcLinearProgressDirective } from './components/linear-progress/mdc.linear-progress.directive';
export { MdcListDividerDirective,
    MdcListItemDirective,
    MdcListItemTextDirective,
    MdcListItemTextSecondaryDirective,
    MdcListItemStartDetailDirective,
    MdcListItemEndDetailDirective,
    MdcListDirective,
    MdcListGroupSubHeaderDirective,
    MdcListGroupDirective } from './components/list/mdc.list.directive';
export { MdcMenuAnchorDirective, MdcSimpleMenuDirective } from './components/menu/mdc.simple.menu.directive';    
export { MdcRadioDirective,
    MdcRadioInputDirective } from './components/radio/mdc.radio.directive';
export { MdcRippleDirective } from './components/ripple/mdc.ripple.directive';
export { MdcSelectDirective,
    MdcSelectTextDirective,
    MdcFormsSelectDirective,
    MdcSelectNativeDirective,
    MdcSelectMultipleNativeDirective,
    MdcSelectGroupNativeDirective,
    MdcSelectOptionNativeDirective } from './components/select/mdc.select.directive';
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
    MdcTextFieldLabelDirective,
    MdcTextFieldHelptextDirective } from './components/text-field/mdc.text-field.directive';
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
        MdcButtonDirective,
        MdcCardDirective, MdcCardHorizontalDirective, MdcCardPrimaryDirective, MdcCardTitleDirective, MdcCardSubtitleDirective,
        MdcCardTextDirective, MdcCardMediaDirective, MdcCardMediaItemDirective, MdcCardActionsDirective,
        MdcCheckboxDirective, MdcCheckboxInputDirective,
        MdcElevationDirective,
        MdcFabDirective, MdcFabIconDirective,
        MdcFormFieldDirective, MdcFormFieldInputDirective, MdcFormFieldLabelDirective,
        MdcIconToggleDirective, MdcIconToggleIconDirective, MdcFormsIconToggleDirective,
        MdcLinearProgressDirective,
        MdcListDividerDirective, MdcListItemDirective, MdcListItemTextDirective, MdcListItemTextSecondaryDirective,
        MdcListItemStartDetailDirective, MdcListItemEndDetailDirective, MdcListDirective, MdcListGroupSubHeaderDirective, MdcListGroupDirective,
        MdcMenuAnchorDirective, MdcSimpleMenuDirective,
        MdcRadioDirective, MdcRadioInputDirective,
        MdcRippleDirective,
        MdcSelectDirective, MdcSelectTextDirective, MdcFormsSelectDirective,
        MdcSelectNativeDirective, MdcSelectMultipleNativeDirective, MdcSelectGroupNativeDirective, MdcSelectOptionNativeDirective,
        MdcSliderDirective, MdcFormsSliderDirective,
        MdcSwitchInputDirective, MdcSwitchDirective,
        MdcTabDirective, MdcTabIconDirective, MdcTabIconTextDirective,
        MdcTabRouterDirective,
        MdcTabBarDirective,
        MdcTabBarScrollerDirective, MdcTabBarScrollerInnerDirective, MdcTabBarScrollerBackDirective, MdcTabBarScrollerForwardDirective, MdcTabBarScrollerFrameDirective,
        MdcTextFieldDirective, MdcTextFieldInputDirective, MdcTextFieldIconDirective, MdcTextFieldLabelDirective, MdcTextFieldHelptextDirective,
        MdcToolbarDirective, MdcToolbarRowDirective, MdcToolbarSectionDirective, MdcToolbarTitleDirective, MdcToolbarIcon, MdcToolbarMenuIcon, MdcToolbarFixedAdjustDirective,
        MdcScrollbarResizeDirective
    ],
    exports: [
        MdcButtonDirective,
        MdcCardDirective, MdcCardHorizontalDirective, MdcCardPrimaryDirective, MdcCardTitleDirective, MdcCardSubtitleDirective,
        MdcCardTextDirective, MdcCardMediaDirective, MdcCardMediaItemDirective, MdcCardActionsDirective,
        MdcCheckboxDirective, MdcCheckboxInputDirective,
        MdcElevationDirective,
        MdcFabDirective, MdcFabIconDirective,
        MdcFormFieldDirective, MdcFormFieldInputDirective, MdcFormFieldLabelDirective,
        MdcIconToggleDirective, MdcIconToggleIconDirective, MdcFormsIconToggleDirective,
        MdcLinearProgressDirective,
        MdcListDividerDirective, MdcListItemDirective, MdcListItemTextDirective, MdcListItemTextSecondaryDirective,
        MdcListItemStartDetailDirective, MdcListItemEndDetailDirective, MdcListDirective, MdcListGroupSubHeaderDirective, MdcListGroupDirective,
        MdcMenuAnchorDirective, MdcSimpleMenuDirective,
        MdcRadioDirective, MdcRadioInputDirective,
        MdcRippleDirective,
        MdcSelectDirective, MdcSelectTextDirective, MdcFormsSelectDirective,
        MdcSelectNativeDirective, MdcSelectMultipleNativeDirective, MdcSelectGroupNativeDirective, MdcSelectOptionNativeDirective,
        MdcSliderDirective, MdcFormsSliderDirective,
        MdcSwitchInputDirective, MdcSwitchDirective,
        MdcTabDirective, MdcTabIconDirective, MdcTabIconTextDirective,
        MdcTabRouterDirective,
        MdcTabBarDirective,
        MdcTabBarScrollerDirective, MdcTabBarScrollerInnerDirective, MdcTabBarScrollerBackDirective, MdcTabBarScrollerForwardDirective, MdcTabBarScrollerFrameDirective,
        MdcTextFieldDirective, MdcTextFieldInputDirective, MdcTextFieldIconDirective, MdcTextFieldLabelDirective, MdcTextFieldHelptextDirective,
        MdcToolbarDirective, MdcToolbarRowDirective, MdcToolbarSectionDirective, MdcToolbarTitleDirective, MdcToolbarIcon, MdcToolbarMenuIcon, MdcToolbarFixedAdjustDirective,
        MdcScrollbarResizeDirective
    ]
})
export class MaterialModule {}
