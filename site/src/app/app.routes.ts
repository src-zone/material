import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview.component';
import {
    DocsComponent,
    GuidesComponent,
    GettingstartedComponent,
    TranspileGuideComponent,

    ButtonDirectivesComponent,
    CardDirectivesComponent,
    CheckboxDirectivesComponent,
    ElevationDirectivesComponent,
    FabDirectivesComponent,
    IconToggleDirectivesComponent,
    LinearProgressDirectivesComponent,
    ListDirectivesComponent,
    MenuDirectivesComponent,
    RadioDirectivesComponent,
    RippleDirectivesComponent,
    SelectDirectivesComponent,
    SliderDirectivesComponent,
    SnackbarDirectivesComponent,
    SwitchDirectivesComponent,
    TabDirectivesComponent,
    TextFieldDirectivesComponent,
    ToolbarDirectivesComponent,
    UtilityDirectivesComponent } from './components';

export const routes: Routes = [
    {path: '', redirectTo: 'guides', pathMatch: 'full'},
    {path: 'guides', component: DocsComponent, children: [
        {path: '', pathMatch: 'full', component: GuidesComponent},
        {path: 'gettingstarted', component: GettingstartedComponent},
        {path: 'ng-transpile', component: TranspileGuideComponent}
    ]},
    {path: 'directives', children: [
        {path: '', pathMatch: 'full', component: OverviewComponent},
        {path: ButtonDirectivesComponent.DOC_HREF, component: ButtonDirectivesComponent},
        {path: CardDirectivesComponent.DOC_HREF, component: CardDirectivesComponent},
        {path: CheckboxDirectivesComponent.DOC_HREF, component: CheckboxDirectivesComponent},
        {path: ElevationDirectivesComponent.DOC_HREF, component: ElevationDirectivesComponent},
        {path: FabDirectivesComponent.DOC_HREF, component: FabDirectivesComponent},
        {path: IconToggleDirectivesComponent.DOC_HREF, component: IconToggleDirectivesComponent},
        {path: LinearProgressDirectivesComponent.DOC_HREF, component: LinearProgressDirectivesComponent},
        {path: ListDirectivesComponent.DOC_HREF, component: ListDirectivesComponent},
        {path: MenuDirectivesComponent.DOC_HREF, component: MenuDirectivesComponent},
        {path: RadioDirectivesComponent.DOC_HREF, component: RadioDirectivesComponent},
        {path: RippleDirectivesComponent.DOC_HREF, component: RippleDirectivesComponent},
        {path: SelectDirectivesComponent.DOC_HREF, component: SelectDirectivesComponent},
        {path: SliderDirectivesComponent.DOC_HREF, component: SliderDirectivesComponent},
        {path: SnackbarDirectivesComponent.DOC_HREF, component: SnackbarDirectivesComponent},
        {path: SwitchDirectivesComponent.DOC_HREF, component: SwitchDirectivesComponent},
        {path: TabDirectivesComponent.DOC_HREF, component: TabDirectivesComponent},
        {path: TextFieldDirectivesComponent.DOC_HREF, component: TextFieldDirectivesComponent},
        {path: ToolbarDirectivesComponent.DOC_HREF, component: ToolbarDirectivesComponent},
        {path: UtilityDirectivesComponent.DOC_HREF, component: UtilityDirectivesComponent}
    ]}
];

export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(routes);
