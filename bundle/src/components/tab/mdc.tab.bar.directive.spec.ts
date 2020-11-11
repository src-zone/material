import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MdcTabBarDirective, TAB_BAR_DIRECTIVES } from './mdc.tab.bar.directive';
import { TAB_SCROLLER_DIRECTIVES } from './mdc.tab.scroller.directive';
import { TAB_DIRECTIVES } from './mdc.tab.directive';
import { TAB_INDICATOR_DIRECTIVES } from './mdc.tab.indicator.directive';
import { By } from '@angular/platform-browser';
import { simulateKey } from '../../testutils/page.test';

const template = `
<div mdcTabBar>
  <div mdcTabScroller>
    <div mdcTabScrollerArea>
      <div mdcTabScrollerContent>
        <button *ngFor="let tab of tabs" mdcTab>
          <span mdcTabContent>
            <span mdcTabIcon class="material-icons">{{tab.icon}}</span>
            <span mdcTabLabel>{{tab.label}}</span>
          </span>
          <span mdcTabIndicator>
            <span mdcTabIndicatorContent></span>
          </span>
        </button>
      </div>
    </div>
  </div>
</div>
`

const templateDynamic = `
<div mdcTabBar>
  <div *ngIf="scrollerA" mdcTabScroller>
    <div mdcTabScrollerArea>
      <div mdcTabScrollerContent>
        <button *ngFor="let tab of tabsA" mdcTab>
          <span mdcTabContent>
            <span mdcTabIcon class="material-icons">{{tab.icon}}</span>
            <span mdcTabLabel>{{tab.label}}</span>
          </span>
          <span mdcTabIndicator>
            <span mdcTabIndicatorContent></span>
          </span>
        </button>
      </div>
    </div>
  </div>
  <div *ngIf="!scrollerA" mdcTabScroller>
    <div mdcTabScrollerArea>
      <div mdcTabScrollerContent>
        <button *ngFor="let tab of tabsB" mdcTab>
          <span mdcTabContent>
            <span mdcTabIcon class="material-icons">{{tab.icon}}</span>
            <span mdcTabLabel>{{tab.label}}</span>
          </span>
          <span mdcTabIndicator>
            <span mdcTabIndicatorContent></span>
          </span>
        </button>
      </div>
    </div>
  </div>
</div>
`;

describe('MdcTabScrollerDirective', () => {
    abstract class AbstractTestComponent {
    }

    @Component({
        template: template
    })
    class TestComponent extends AbstractTestComponent {
        tabs = [
            {icon: 'access_time', label: 'recents'},
            {icon: 'near_me', label: 'nearby'},
            {icon: 'favorite', label: 'favorites'}
        ];
    }

    @Component({
        template: templateDynamic
    })
    class DynamicTestComponent extends AbstractTestComponent {
        scrollerA = true;
        tabsA = [
            {icon: 'access_time', label: 'recents'},
            {icon: 'near_me', label: 'nearby'},
            {icon: 'favorite', label: 'favorites'}
        ];
        tabsB = [
            {icon: 'access_time', label: 'recents'},
            {icon: 'favorite', label: 'favorites'}
        ];
    }

    function setup(testComponentType: any = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...TAB_INDICATOR_DIRECTIVES, ...TAB_DIRECTIVES, ...TAB_SCROLLER_DIRECTIVES, ...TAB_BAR_DIRECTIVES, testComponentType]
        }).createComponent(testComponentType);
        fixture.detectChanges(); tick(100);
        return { fixture };
    }

    it('should initialize with defaults', fakeAsync(() => {
        const { fixture } = setup(TestComponent);
        const bar: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab-bar');

        expect(bar).toBeDefined();
        expect(bar.getAttribute('role')).toBe('tablist');
    }));

    it('tabs can be activated by interaction', fakeAsync(() => {
        const { fixture } = setup(TestComponent);
        const tabs: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-tab')];
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false, false, false]);
        
        tabs[1].click(); fixture.detectChanges();
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false, true, false]);

        tabs[2].click(); fixture.detectChanges();
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false, false, true]);
    }));

    it('tabs can be focused with arrow keys', fakeAsync(() => {
        const { fixture } = setup(TestComponent);
        const tabs: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-tab')];
        const ripples: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-tab__ripple')];
        tabs[1].click(); tick(20); fixture.detectChanges();
        expect(document.activeElement).toBe(tabs[1]);
        simulateKey(tabs[1], 'ArrowRight');
        tick(20); fixture.detectChanges(); // (styles are applied via requestAnimationFrame)
        expect(document.activeElement).toBe(tabs[2]);
    }));

    it('foundation correctly reinitialized when scroller is changed', fakeAsync(() => {
        const { fixture } = setup(DynamicTestComponent);

        let tabs: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-tab')];
        const testComponent = fixture.debugElement.injector.get(DynamicTestComponent);
        const mdcTabBar = fixture.debugElement.query(By.directive(MdcTabBarDirective)).injector.get(MdcTabBarDirective);
        const foundation = getFoundation(mdcTabBar);
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false, false, false]);
        
        tabs[1].click(); fixture.detectChanges();
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false, true, false]);
        // foundation should not have changed:
        expect(foundation).toBe(getFoundation(mdcTabBar));

        testComponent.scrollerA = false; // switch scroller
        fixture.detectChanges(); tick(100);
        tabs = [...fixture.nativeElement.querySelectorAll('.mdc-tab')];
        // tabs changed, no tab is active anymore:
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false, false]);
        // foundation should have been reconstructed:
        expect(foundation).not.toBe(getFoundation(mdcTabBar));
    }));

    it('foundation correctly reinitialized when tabs are added', fakeAsync(() => {
        const { fixture } = setup(DynamicTestComponent);

        let tabs: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-tab')];
        const testComponent = fixture.debugElement.injector.get(DynamicTestComponent);
        const mdcTabBar = fixture.debugElement.query(By.directive(MdcTabBarDirective)).injector.get(MdcTabBarDirective);
        const foundation = getFoundation(mdcTabBar);
        tabs[1].click(); fixture.detectChanges();
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false, true, false]);

        testComponent.tabsA.push( {icon: 'explore', label: 'explore'})
        fixture.detectChanges(); tick(100);
        tabs = [...fixture.nativeElement.querySelectorAll('.mdc-tab')];
        // tabs changed, but second tab is still active:
        expect(tabs.map(t => t.classList.contains('mdc-tab--active'))).toEqual([false, true, false, false]);
        // foundation should have been reconstructed:
        expect(foundation).not.toBe( mdcTabBar['_foundation']);
    }));

    function getFoundation(mdcTabBar: MdcTabBarDirective) {
        const foundation = mdcTabBar['_foundation'];
        expect(foundation.handleKeyDown).toBeDefined();
        return foundation;
    }
});
