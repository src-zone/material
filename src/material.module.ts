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
import { MdcRadioDirective,
    MdcRadioInputDirective } from './components/radio/mdc.radio.directive';
import { MdcSnackbarDirective,
    MdcSnackbarTextDirective,
    MdcSnackbarActionDirective } from './components/snackbar/mdc.snackbar.directive';
import { MdcTextfieldDirective,
    MdcTextfieldInputDirective,
    MdcTextfieldLabelDirective,
    MdcTextfieldHelptextDirective } from './components/textfield/mdc.textfield.directive';
import { MdcToolbarDirective,
    MdcToolbarRowDirective,
    MdcToolbarSectionDirective,
    MdcToolbarTitleDirective,
    MdcToolbarFixedAdjustDirective } from './components/toolbar/mdc.toolbar.directive';
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
export { MdcRadioDirective,
    MdcRadioInputDirective } from './components/radio/mdc.radio.directive';
export { MdcSnackbarDirective,
    MdcSnackbarTextDirective,
    MdcSnackbarActionDirective } from './components/snackbar/mdc.snackbar.directive';
export { MdcTextfieldDirective,
    MdcTextfieldInputDirective,
    MdcTextfieldLabelDirective,
    MdcTextfieldHelptextDirective } from './components/textfield/mdc.textfield.directive';
export { MdcToolbarDirective,
    MdcToolbarRowDirective,
    MdcToolbarSectionDirective,
    MdcToolbarTitleDirective,
    MdcToolbarFixedAdjustDirective } from './components/toolbar/mdc.toolbar.directive';
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
        MdcRadioDirective, MdcRadioInputDirective,
        MdcSnackbarDirective, MdcSnackbarTextDirective, MdcSnackbarActionDirective,
        MdcTextfieldDirective, MdcTextfieldInputDirective, MdcTextfieldLabelDirective, MdcTextfieldHelptextDirective,
        MdcToolbarDirective, MdcToolbarRowDirective, MdcToolbarSectionDirective, MdcToolbarTitleDirective, MdcToolbarFixedAdjustDirective
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
        MdcRadioDirective, MdcRadioInputDirective,
        MdcSnackbarDirective, MdcSnackbarTextDirective, MdcSnackbarActionDirective,
        MdcTextfieldDirective, MdcTextfieldInputDirective, MdcTextfieldLabelDirective, MdcTextfieldHelptextDirective,
        MdcToolbarDirective, MdcToolbarRowDirective, MdcToolbarSectionDirective, MdcToolbarTitleDirective, MdcToolbarFixedAdjustDirective
    ]
})
export class MaterialModule {}
