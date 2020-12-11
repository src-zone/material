import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import {
    IndexComponent,
    DocsComponent,
    GuidesComponent,
    GettingstartedComponent,
    IE11Component
} from './components/app';
import { NotFoundComponent } from './components/shared';

const routes: Routes = [
    {path: '', component: IndexComponent},
    {path: 'guides', component: DocsComponent, children: [
        {path: '', pathMatch: 'full', component: GuidesComponent},
        {path: 'gettingstarted', component: GettingstartedComponent},
        {path: 'ie11', component: IE11Component}
    ]},
    {path: 'components', loadChildren: () => import(/* webpackChunkName: "comps" */'./components.module').then(m => m.ComponentsModule)},
    {path: '**', component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled',
        preloadingStrategy: PreloadAllModules,
        relativeLinkResolution: 'legacy'
    })],
    exports: [RouterModule]
  })
export class AppRoutingModule {}
