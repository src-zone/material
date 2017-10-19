import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview.component';
import {
    DocsComponent,
    GuidesComponent,
    GettingstartedComponent,

    ButtonDirectivesComponent,
    CardDirectivesComponent,
    CheckboxDirectivesComponent,    
    FabDirectivesComponent,
    IconToggleDirectivesComponent,
    RadioDirectivesComponent,
    SliderDirectivesComponent,
    SwitchDirectivesComponent,
    TabDirectivesComponent,
    TextfieldDirectivesComponent,
    ToolbarDirectivesComponent } from './components';

export const routes: Routes = [
    {path: '', redirectTo: 'guides', pathMatch: 'full'},
    {path: 'guides', component: DocsComponent, children: [
        {path: '', pathMatch: 'full', component: GuidesComponent},
        {path: 'gettingstarted', component: GettingstartedComponent}
    ]},
    {path: 'directives', children: [
        {path: '', pathMatch: 'full', component: OverviewComponent},
        {path: ButtonDirectivesComponent.DOC_HREF, component: ButtonDirectivesComponent},
        {path: CardDirectivesComponent.DOC_HREF, component: CardDirectivesComponent},
        {path: CheckboxDirectivesComponent.DOC_HREF, component: CheckboxDirectivesComponent},
        {path: FabDirectivesComponent.DOC_HREF, component: FabDirectivesComponent},
        {path: IconToggleDirectivesComponent.DOC_HREF, component: IconToggleDirectivesComponent},
        {path: RadioDirectivesComponent.DOC_HREF, component: RadioDirectivesComponent},
        {path: SliderDirectivesComponent.DOC_HREF, component: SliderDirectivesComponent},
        {path: SwitchDirectivesComponent.DOC_HREF, component: SwitchDirectivesComponent},
        {path: TabDirectivesComponent.DOC_HREF, component: TabDirectivesComponent},
        {path: TextfieldDirectivesComponent.DOC_HREF, component: TextfieldDirectivesComponent},
        {path: ToolbarDirectivesComponent.DOC_HREF, component: ToolbarDirectivesComponent}
    ]}
];

export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
