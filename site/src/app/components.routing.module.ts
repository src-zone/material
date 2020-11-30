import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview.component';
import {
    ButtonDirectivesComponent,
    CardDirectivesComponent,
    CheckboxDirectivesComponent,
    ChipsDirectivesComponent,
    DialogDirectivesComponent,
    DrawerDirectivesComponent,
    ElevationDirectivesComponent,
    FabDirectivesComponent,
    FocusTrapDirectivesComponent,
    IconButtonDirectivesComponent,
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
    // ToolbarDirectivesComponent,
    // TopAppBarDirectivesComponent,
    // UtilityDirectivesComponent
} from './components/components';

const routes: Routes = [
    {path: '', pathMatch: 'full', component: OverviewComponent},
    {path: ButtonDirectivesComponent.DOC_HREF, component: ButtonDirectivesComponent},
    {path: CardDirectivesComponent.DOC_HREF, component: CardDirectivesComponent},
    {path: CheckboxDirectivesComponent.DOC_HREF, component: CheckboxDirectivesComponent},
    {path: ChipsDirectivesComponent.DOC_HREF, component: ChipsDirectivesComponent},
    {path: DialogDirectivesComponent.DOC_HREF, component: DialogDirectivesComponent},
    {path: DrawerDirectivesComponent.DOC_HREF, component: DrawerDirectivesComponent},
    {path: ElevationDirectivesComponent.DOC_HREF, component: ElevationDirectivesComponent},
    {path: FabDirectivesComponent.DOC_HREF, component: FabDirectivesComponent},
    {path: FocusTrapDirectivesComponent.DOC_HREF, component: FocusTrapDirectivesComponent},
    {path: IconButtonDirectivesComponent.DOC_HREF, component: IconButtonDirectivesComponent},
    {path: LinearProgressDirectivesComponent.DOC_HREF, component: LinearProgressDirectivesComponent},
    {path: ListDirectivesComponent.DOC_HREF, component: ListDirectivesComponent},
    {path: MenuDirectivesComponent.DOC_HREF, component: MenuDirectivesComponent},
    {path: RadioDirectivesComponent.DOC_HREF, component: RadioDirectivesComponent},
    {path: RippleDirectivesComponent.DOC_HREF, component: RippleDirectivesComponent},
    {path: SelectDirectivesComponent.DOC_HREF, component: SelectDirectivesComponent},
    {path: SliderDirectivesComponent.DOC_HREF, component: SliderDirectivesComponent},
    {path: SnackbarDirectivesComponent.DOC_HREF, component: SnackbarDirectivesComponent},
    {path: SwitchDirectivesComponent.DOC_HREF, component: SwitchDirectivesComponent},
    {path: TabDirectivesComponent.DOC_HREF, component: TabDirectivesComponent, loadChildren: () =>
        import(/* webpackChunkName: "rtabs" */'./components/snippets/directives/snippet.tab.routing.module').then(m => m.AppModule)},
    {path: TextFieldDirectivesComponent.DOC_HREF, component: TextFieldDirectivesComponent},
    // {path: ToolbarDirectivesComponent.DOC_HREF, component: ToolbarDirectivesComponent},
    // {path: TopAppBarDirectivesComponent.DOC_HREF, component: TopAppBarDirectivesComponent},
    // {path: UtilityDirectivesComponent.DOC_HREF, component: UtilityDirectivesComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComponentsRoutingModule { }
