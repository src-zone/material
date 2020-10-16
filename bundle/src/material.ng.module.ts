import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BUTTON_DIRECTIVES } from './components/button/mdc.button.directive';
import { CARD_DIRECTIVES } from './components/card/mdc.card.directive';
import { CHECKBOX_DIRECTIVES } from './components/checkbox/mdc.checkbox.directive';
import { CHIP_DIRECTIVES } from './components/chips/mdc.chip.directive';
import { DIALOG_DIRECTIVES } from './components/dialog/mdc.dialog.directive';
import { DRAWER_DIRECTIVES } from './components/drawer/mdc.drawer.directive';
import { MdcElevationDirective } from './components/elevation/mdc.elevation.directive';
import { FAB_DIRECTIVES } from './components/fab/mdc.fab.directive';
import { MdcFloatingLabelDirective } from './components/floating-label/mdc.floating-label.directive';
import { FOCUS_TRAP_DIRECTIVES } from './components/focus-trap/mdc.focus-trap.directive';
import { FORM_FIELD_DIRECTIVES } from './components/form-field/mdc.form-field.directive';
import { ICON_BUTTON_DIRECTIVES } from './components/icon-button/mdc.icon-button.directive';
import { LINEAR_PROGRESS_DIRECTIVES } from './components/linear-progress/mdc.linear-progress.directive';
import { LIST_DIRECTIVES } from './components/list/mdc.list.directive';
import { MENU_DIRECTIVES } from './components/menu/mdc.menu.directive';
import { MENU_SURFACE_DIRECTIVES } from './components/menu-surface/mdc.menu-surface.directive';
import { NOTCHED_OUTLINE_DIRECTIVES } from './components/notched-outline/mdc.notched-outline.directive';
import { RADIO_DIRECTIVES } from './components/radio/mdc.radio.directive';
import { MdcRippleDirective } from './components/ripple/mdc.ripple.directive';
import { SELECT_DIRECTIVES } from './components/select/mdc.select.directive';
import { SLIDER_DIRECTIVES } from './components/slider/mdc.slider.directive';
import { SWITCH_DIRECTIVES } from './components/switch/mdc.switch.directive';    
import { MdcTabDirective,
    MdcTabIconDirective,
    MdcTabIconTextDirective } from './components/tabs/mdc.tab.directive';
import { MdcTabRouterDirective } from './components/tabs/mdc.tab.router.directive';
import { MdcTabBarDirective } from './components/tabs/mdc.tab.bar.directive';
import { MdcTabBarScrollerDirective,
    MdcTabBarScrollerInnerDirective,
    MdcTabBarScrollerBackDirective,
    MdcTabBarScrollerForwardDirective,
    MdcTabBarScrollerFrameDirective } from './components/tabs/mdc.tab.bar.scroller.directive';
import { TEXT_FIELD_DIRECTIVES } from './components/text-field/mdc.text-field.directive';
import { MdcToolbarDirective,
    MdcToolbarRowDirective,
    MdcToolbarSectionDirective,
    MdcToolbarTitleDirective,
    MdcToolbarIcon,
    MdcToolbarMenuIcon,
    MdcToolbarFixedAdjustDirective } from './components/toolbar/mdc.toolbar.directive';
import { TOP_APP_BAR_DIRECTIVES } from './components/top-app-bar/mdc.top-app-bar.directive';
import { MdcScrollbarResizeDirective } from './components/utility/mdc.scrollbar-resize.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ...BUTTON_DIRECTIVES,
        ...CARD_DIRECTIVES,
        ...CHECKBOX_DIRECTIVES,
        ...CHIP_DIRECTIVES,
        ...DIALOG_DIRECTIVES,
        ...DRAWER_DIRECTIVES,
        MdcElevationDirective,
        ...FAB_DIRECTIVES,
        MdcFloatingLabelDirective,
        ...FOCUS_TRAP_DIRECTIVES,
        ...FORM_FIELD_DIRECTIVES,
        ...ICON_BUTTON_DIRECTIVES,
        ...LINEAR_PROGRESS_DIRECTIVES,
        ...LIST_DIRECTIVES,
        ...MENU_DIRECTIVES,
        ...MENU_SURFACE_DIRECTIVES,
        ...NOTCHED_OUTLINE_DIRECTIVES,
        ...RADIO_DIRECTIVES,
        MdcRippleDirective,
        ...SELECT_DIRECTIVES,
        ...SLIDER_DIRECTIVES,
        ...SWITCH_DIRECTIVES,
        MdcTabDirective, MdcTabIconDirective, MdcTabIconTextDirective,
        MdcTabRouterDirective,
        MdcTabBarDirective,
        MdcTabBarScrollerDirective, MdcTabBarScrollerInnerDirective, MdcTabBarScrollerBackDirective, MdcTabBarScrollerForwardDirective, MdcTabBarScrollerFrameDirective,
        ...TEXT_FIELD_DIRECTIVES,
        MdcToolbarDirective, MdcToolbarRowDirective, MdcToolbarSectionDirective, MdcToolbarTitleDirective, MdcToolbarIcon, MdcToolbarMenuIcon, MdcToolbarFixedAdjustDirective,
        TOP_APP_BAR_DIRECTIVES,
        MdcScrollbarResizeDirective
    ],
    exports: [
        ...BUTTON_DIRECTIVES,
        ...CARD_DIRECTIVES,
        ...CHECKBOX_DIRECTIVES,
        ...CHIP_DIRECTIVES,
        ...DIALOG_DIRECTIVES,
        ...DRAWER_DIRECTIVES,
        MdcElevationDirective,
        ...FAB_DIRECTIVES,
        MdcFloatingLabelDirective,
        ...FOCUS_TRAP_DIRECTIVES,
        ...FORM_FIELD_DIRECTIVES,
        ...ICON_BUTTON_DIRECTIVES,
        ...LINEAR_PROGRESS_DIRECTIVES,
        ...LIST_DIRECTIVES,
        ...MENU_DIRECTIVES,
        ...MENU_SURFACE_DIRECTIVES,
        ...NOTCHED_OUTLINE_DIRECTIVES,
        ...RADIO_DIRECTIVES,
        MdcRippleDirective,
        ...SELECT_DIRECTIVES,
        ...SLIDER_DIRECTIVES,
        ...SWITCH_DIRECTIVES,
        MdcTabDirective, MdcTabIconDirective, MdcTabIconTextDirective,
        MdcTabRouterDirective,
        MdcTabBarDirective,
        MdcTabBarScrollerDirective, MdcTabBarScrollerInnerDirective, MdcTabBarScrollerBackDirective, MdcTabBarScrollerForwardDirective, MdcTabBarScrollerFrameDirective,
        ...TEXT_FIELD_DIRECTIVES,
        MdcToolbarDirective, MdcToolbarRowDirective, MdcToolbarSectionDirective, MdcToolbarTitleDirective, MdcToolbarIcon, MdcToolbarMenuIcon, MdcToolbarFixedAdjustDirective,
        TOP_APP_BAR_DIRECTIVES,
        MdcScrollbarResizeDirective
    ]
})
export class MaterialModule {}