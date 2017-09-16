import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview.component';
import {
    ButtonDirectivesComponent,
    CheckboxDirectivesComponent,    
    FabDirectivesComponent,
    TabDirectivesComponent } from './components';

export const routes: Routes = [
    {path: '', redirectTo: 'directives', pathMatch: 'full'},
    {path: 'directives', children: [
        {path: '', pathMatch: 'full', component: OverviewComponent},
        {path: 'button', component: ButtonDirectivesComponent},
        {path: 'checkbox', component: CheckboxDirectivesComponent},
        {path: 'fab', component: FabDirectivesComponent},
        {path: 'tab', component: TabDirectivesComponent}
    ]}
];

export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
