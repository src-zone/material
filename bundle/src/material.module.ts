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
import { MdcFabDirective,
    MdcFabIconDirective } from './components/fab/mdc.fab.directive';
import { MdcFormfieldDirective,
    MdcFormfieldInputDirective,
    MdcFormfieldLabelDirective } from './components/formfield/mdc.formfield.directive';
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
import { MdcRadioDirective,
    MdcRadioInputDirective } from './components/radio/mdc.radio.directive';
import { MdcSliderDirective,
    MdcFormsSliderDirective } from './components/slider/mdc.slider.directive';
import { MdcSnackbarDirective,
    MdcSnackbarTextDirective,
    MdcSnackbarActionDirective } from './components/snackbar/mdc.snackbar.directive';
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
import { MdcTextfieldDirective,
    MdcTextfieldInputDirective,
    MdcTextfieldIconDirective,
    MdcTextfieldLabelDirective,
    MdcTextfieldHelptextDirective } from './components/textfield/mdc.textfield.directive';
import { MdcToolbarDirective,
    MdcToolbarRowDirective,
    MdcToolbarSectionDirective,
    MdcToolbarTitleDirective,
    MdcToolbarIcon,
    MdcToolbarMenuIcon,
    MdcToolbarFixedAdjustDirective } from './components/toolbar/mdc.toolbar.directive';
import { MdcScrollbarResizeDirective } from './components/utility/mdc.scrollbar-resize.directive';
import { MdcEventRegistry } from './utils/mdc.event.registry';

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
export { MdcFabDirective,
    MdcFabIconDirective } from './components/fab/mdc.fab.directive';
export { MdcFormfieldDirective,
    MdcFormfieldInputDirective,
    MdcFormfieldLabelDirective } from './components/formfield/mdc.formfield.directive';
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
export { MdcRadioDirective,
    MdcRadioInputDirective } from './components/radio/mdc.radio.directive';
export { MdcSliderDirective,
    MdcFormsSliderDirective } from './components/slider/mdc.slider.directive';
export { MdcSnackbarDirective,
    MdcSnackbarTextDirective,
    MdcSnackbarActionDirective } from './components/snackbar/mdc.snackbar.directive';
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
export { MdcTextfieldDirective,
    MdcTextfieldInputDirective,
    MdcTextfieldIconDirective,
    MdcTextfieldLabelDirective,
    MdcTextfieldHelptextDirective } from './components/textfield/mdc.textfield.directive';
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
    declarations: [
        MdcButtonDirective,
        MdcCardDirective, MdcCardHorizontalDirective, MdcCardPrimaryDirective, MdcCardTitleDirective, MdcCardSubtitleDirective,
        MdcCardTextDirective, MdcCardMediaDirective, MdcCardMediaItemDirective, MdcCardActionsDirective,
        MdcCheckboxDirective, MdcCheckboxInputDirective,
        MdcFabDirective, MdcFabIconDirective,
        MdcFormfieldDirective, MdcFormfieldInputDirective, MdcFormfieldLabelDirective,
        MdcIconToggleDirective, MdcIconToggleIconDirective, MdcFormsIconToggleDirective,
        MdcLinearProgressDirective,
        MdcListDividerDirective, MdcListItemDirective, MdcListItemTextDirective, MdcListItemTextSecondaryDirective,
        MdcListItemStartDetailDirective, MdcListItemEndDetailDirective, MdcListDirective, MdcListGroupSubHeaderDirective, MdcListGroupDirective,
        MdcRadioDirective, MdcRadioInputDirective,
        MdcSliderDirective, MdcFormsSliderDirective,
        MdcSnackbarDirective, MdcSnackbarTextDirective, MdcSnackbarActionDirective,
        MdcSwitchInputDirective, MdcSwitchDirective,
        MdcTabDirective, MdcTabIconDirective, MdcTabIconTextDirective,
        MdcTabRouterDirective,
        MdcTabBarDirective,
        MdcTabBarScrollerDirective, MdcTabBarScrollerInnerDirective, MdcTabBarScrollerBackDirective, MdcTabBarScrollerForwardDirective, MdcTabBarScrollerFrameDirective,
        MdcTextfieldDirective, MdcTextfieldInputDirective, MdcTextfieldIconDirective, MdcTextfieldLabelDirective, MdcTextfieldHelptextDirective,
        MdcToolbarDirective, MdcToolbarRowDirective, MdcToolbarSectionDirective, MdcToolbarTitleDirective, MdcToolbarIcon, MdcToolbarMenuIcon, MdcToolbarFixedAdjustDirective,
        MdcScrollbarResizeDirective
    ],
    providers: [
        MdcEventRegistry
    ],
    exports: [
        MdcButtonDirective,
        MdcCardDirective, MdcCardHorizontalDirective, MdcCardPrimaryDirective, MdcCardTitleDirective, MdcCardSubtitleDirective,
        MdcCardTextDirective, MdcCardMediaDirective, MdcCardMediaItemDirective, MdcCardActionsDirective,
        MdcCheckboxDirective, MdcCheckboxInputDirective,
        MdcFabDirective, MdcFabIconDirective,
        MdcFormfieldDirective, MdcFormfieldInputDirective, MdcFormfieldLabelDirective,
        MdcIconToggleDirective, MdcIconToggleIconDirective, MdcFormsIconToggleDirective,
        MdcLinearProgressDirective,
        MdcListDividerDirective, MdcListItemDirective, MdcListItemTextDirective, MdcListItemTextSecondaryDirective,
        MdcListItemStartDetailDirective, MdcListItemEndDetailDirective, MdcListDirective, MdcListGroupSubHeaderDirective, MdcListGroupDirective,
        MdcRadioDirective, MdcRadioInputDirective,
        MdcSliderDirective, MdcFormsSliderDirective,
        MdcSnackbarDirective, MdcSnackbarTextDirective, MdcSnackbarActionDirective,
        MdcSwitchInputDirective, MdcSwitchDirective,
        MdcTabDirective, MdcTabIconDirective, MdcTabIconTextDirective,
        MdcTabRouterDirective,
        MdcTabBarDirective,
        MdcTabBarScrollerDirective, MdcTabBarScrollerInnerDirective, MdcTabBarScrollerBackDirective, MdcTabBarScrollerForwardDirective, MdcTabBarScrollerFrameDirective,
        MdcTextfieldDirective, MdcTextfieldInputDirective, MdcTextfieldIconDirective, MdcTextfieldLabelDirective, MdcTextfieldHelptextDirective,
        MdcToolbarDirective, MdcToolbarRowDirective, MdcToolbarSectionDirective, MdcToolbarTitleDirective, MdcToolbarIcon, MdcToolbarMenuIcon, MdcToolbarFixedAdjustDirective,
        MdcScrollbarResizeDirective
    ]
})
export class MaterialModule {}
