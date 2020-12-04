import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@blox/material';
import {
  CodeSampleComponent,
  HighlightjsDirective,
  ThemeSwitcherComponent
} from './components/shared';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    CodeSampleComponent,
    HighlightjsDirective,
    ThemeSwitcherComponent
  ],
  exports: [
    CommonModule,
    MaterialModule,

    CodeSampleComponent,
    HighlightjsDirective,
    ThemeSwitcherComponent
  ]
})
export class SharedModule {}
