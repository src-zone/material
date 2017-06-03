import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
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
} from './components';
import {
    MdcEventRegistry,
} from './utils';

export const MDC_COMPONENTS = [
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
];

export const MDC_SERVICES = [
    MdcEventRegistry
];


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ...MDC_COMPONENTS
    ],
    providers: [
        ...MDC_SERVICES
    ],
    exports: [
        ...MDC_COMPONENTS
    ]
})
export class MaterialModule {}
