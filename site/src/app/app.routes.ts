import { Routes, RouterModule } from '@angular/router';
import {
    IndexComponent,
    DocsComponent,
    GuidesComponent,
    GettingstartedComponent,
    IE11Component
} from './components/app';
import { NotFoundComponent } from './components/shared';

export const routes: Routes = [
    {path: '', component: IndexComponent},
    {path: 'guides', component: DocsComponent, children: [
        {path: '', pathMatch: 'full', component: GuidesComponent},
        {path: 'gettingstarted', component: GettingstartedComponent},
        {path: 'ie11', component: IE11Component}
    ]},
    {path: 'components', loadChildren: () => import('./components.module').then(m => m.ComponentsModule)},
    {path: '**', component: NotFoundComponent}
];

export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
