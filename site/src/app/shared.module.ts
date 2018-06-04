import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@blox/material';
import {
  CodeSampleComponent,
  HighlightjsDirective
} from './components';
import { ThemeService } from './services';

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
