import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; /* snippet-skip-line
import { BrowserModule } from '@angular/platform-browser';
snippet-skip-line */
import { Routes, RouterModule } from '@angular/router';
/* snippet-skip-line
import { MaterialModule } from '@blox/material';
import { SnippetTabRoutingComponent } from './snippet.tab.routing.component';
snippet-skip-line */
import { Page1Component } from './snippet.tab.routing.page1'; // snippet-skip-line
import { Page2Component } from './snippet.tab.routing.page2'; // snippet-skip-line
import { SharedModule } from '../../../shared.module'; /* snippet-skip-line
import { Page1Component } from './page1';
import { Page2Component } from './page2';
snippet-skip-line */

const routes: Routes = [
  {path: 'page1', component: Page1Component},
  {path: 'page2', component: Page2Component}
];
/* snippet-skip-line
const routing = RouterModule.forRoot(routes);
snippet-skip-line */
//snip:skip
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
class routing { }
//snip:endskip

@NgModule({
    imports: [
//snip:skip
        CommonModule,
        SharedModule,
//snip:endskip,
/* snippet-skip-line
        BrowserModule,
        MaterialModule,
snippet-skip-line */
        routing
    ],
    declarations: [
/* snippet-skip-line
        SnippetTabRoutingComponent,
snippet-skip-line */
        Page1Component,
        Page2Component
    ],
/* snippet-skip-line
    bootstrap: [
      SnippetTabRoutingComponent
    ]
snippet-skip-line */
})
export class AppModule { }
