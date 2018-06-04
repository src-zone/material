import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview.component';
import {
    IndexComponent,
    DocsComponent,
    GuidesComponent,
    GettingstartedComponent,
    IE11Component,
    NotFoundComponent
} from './components';

export const routes: Routes = [
    {path: '', component: IndexComponent},
    {path: 'guides', component: DocsComponent, children: [
        {path: '', pathMatch: 'full', component: GuidesComponent},
        {path: 'gettingstarted', component: GettingstartedComponent},
        {path: 'ie11', component: IE11Component}
    ]},
    {path: 'components', loadChildren: './components.module#ComponentsModule' },
    {path: '**', component: NotFoundComponent}
];

export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
