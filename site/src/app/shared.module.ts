import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@blox/material';
import {
  CodeSampleComponent,
  HighlightjsDirective
} from './components/shared';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    CodeSampleComponent,
    HighlightjsDirective,
  ],
  exports: [
    CommonModule,
    MaterialModule,

    CodeSampleComponent,
    HighlightjsDirective,
  ]
})
export class SharedModule {}
