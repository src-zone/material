import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { TAB_BAR_DIRECTIVES } from './mdc.tab.bar.directive';
import { TAB_SCROLLER_DIRECTIVES } from './mdc.tab.scroller.directive';
import { TAB_ROUTER_DIRECTIVES } from './mdc.tab.router.directive';
import { TAB_DIRECTIVES } from './mdc.tab.directive';
import { TAB_INDICATOR_DIRECTIVES } from './mdc.tab.indicator.directive';

import { Router, Routes } from '@angular/router';

const template = `
<div mdcTabBar>
  <div mdcTabScroller><div mdcTabScrollerArea><div mdcTabScrollerContent>
    <button mdcTab [routerLink]="['home']">
      <span mdcTabContent><span mdcTabLabel>home</span></span>
      <span mdcTabIndicator><span mdcTabIndicatorContent></span></span>
    </button>
    <button mdcTab [routerLink]="['search']">
      <span mdcTabContent><span mdcTabLabel>search</span></span>
      <span mdcTabIndicator><span mdcTabIndicatorContent></span></span>
    </button>
  </div></div></div>
</div>
<router-outlet></router-outlet>
`;
const noHomeTemplate = `
<div mdcTabBar>
  <div mdcTabScroller><div mdcTabScrollerArea><div mdcTabScrollerContent>
    <button mdcTab [routerLink]="['search']">
      <span mdcTabContent><span mdcTabLabel>search</span></span>
      <span mdcTabIndicator><span mdcTabIndicatorContent></span></span>
    </button>
  </div></div></div>
</div>
<router-outlet></router-outlet>
`;

describe('MdcTabRouterDirective', () => {
    @Component({
        template: `<div id="search">Search</div>`
    })
    class SearchComponent {
    };

    @Component({
      template: `<div id="searchone">Search One</div><router-outlet></router-outlet>`
    })
    class SearchOneComponent {
    };

    @Component({
        template: `<div id="searchtwo">Search Two</div>`
    })
    class SearchTwoComponent {
    };

    @Component({
        template: `<div id="home">Home</div>`
    })
    class HomeComponent {
    }

    @Component({
        template: `<div id="other">Other</div>`
    })
    class OtherComponent {
    }

    abstract class AbstractTestComponent {
    }

    @Component({
        template: template
    })
    class TestComponent extends AbstractTestComponent {
    }

    @Component({
        template: noHomeTemplate
    })
    class NoHomeTestComponent extends AbstractTestComponent {
    }

    const testRoutes = [
        {path: '', redirectTo: 'home', pathMatch: 'full'},
        {path: 'home', component: HomeComponent},
        {path: 'search', component: SearchComponent,
            children: [
                { path: 'one', component: SearchOneComponent },
                { path: 'two', component: SearchTwoComponent }
            ],
        },
        {path: 'other', component: OtherComponent}
    ];

    function setup(testComponentType: any = TestComponent, routes: Routes = testRoutes) {
        const fixture = TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)],
            declarations: [
                ...TAB_INDICATOR_DIRECTIVES,
                ...TAB_DIRECTIVES,
                ...TAB_ROUTER_DIRECTIVES,
                ...TAB_SCROLLER_DIRECTIVES,
                ...TAB_BAR_DIRECTIVES,
                testComponentType,
                ...routes.map(r => r.component).filter(c => !!c),
                SearchOneComponent, SearchTwoComponent
            ]
        }).createComponent(testComponentType);

        let router = TestBed.inject(Router);
        //let location = TestBed.inject(Location);
        
        fixture.ngZone.run(() => router.initialNavigation());
        fixture.detectChanges();
        tick();
        return { fixture, router }; //, location };
    }

    it('initial state and route navigation by interaction', fakeAsync(() => {
        const { fixture } = setup(TestComponent);
        const tabs: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-tab')];
        // initial state has no tab selected, because no tab matches the home route:
        expect(fixture.nativeElement.querySelector('#home')).toBeDefined();
        expect(fixture.nativeElement.querySelector('#search')).toBeNull();
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([true, false]);
        
        // changing to search route:
        tabs[1].click(); tick(); fixture.detectChanges();
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false, true]);
        expect(fixture.nativeElement.querySelector('#home')).toBeNull();
        expect(fixture.nativeElement.querySelector('#search')).toBeDefined();
    }));

    it('initial state when no route matches', fakeAsync(() => {
        const { fixture } = setup(NoHomeTestComponent);
        const tabs: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-tab')];
        // initial state has no tab selected, because no tab matches the home route:
        expect(fixture.nativeElement.querySelector('#home')).toBeDefined();
        expect(fixture.nativeElement.querySelector('#search')).toBeNull();
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false]);
        
        // after clicking search we should be on the search route, with tab-bar reflecting that:
        tabs[0].click(); tick(); fixture.detectChanges();
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([true]);
        expect(fixture.nativeElement.querySelector('#home')).toBeNull();
        expect(fixture.nativeElement.querySelector('#search')).toBeDefined();
    }));

    it('route change through router', fakeAsync(() => {
        const { fixture, router } = setup(NoHomeTestComponent);
        const tabs: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-tab')];
        // initial state has no tab selected, because no tab matches the home route:
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false]);

        fixture.ngZone.run(() =>router.navigate(['/home']));
        flush(); fixture.detectChanges();
        // still no tab selected, because 'home' doesn't match route for a tab:
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false]);

        fixture.ngZone.run(() =>router.navigate(['/search']));
        flush(); fixture.detectChanges();
        // search route and tab now active:
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([true]);

        fixture.ngZone.run(() =>router.navigate(['/home']));
        flush(); fixture.detectChanges();
        // search tab still selected, because we have no other tab to activate for '/home':
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([true]);
    }));

    it('activate tab for child route', fakeAsync(() => {
        const { fixture, router } = setup(TestComponent);
        const tabs: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-tab')];

        fixture.ngZone.run(() =>router.navigate(['/search', 'two']));
        flush(); fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('#search')).toBeDefined();
        expect(fixture.nativeElement.querySelector('#searchtwo')).toBeDefined();
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false, true]);
    }));
});
