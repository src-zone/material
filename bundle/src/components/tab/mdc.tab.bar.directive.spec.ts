import { TestBed, fakeAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TAB_BAR_DIRECTIVES } from './mdc.tab.bar.directive';
import { TAB_SCROLLER_DIRECTIVES } from './mdc.tab.scroller.directive';
import { TAB_DIRECTIVES } from './mdc.tab.directive';
import { TAB_INDICATOR_DIRECTIVES } from './mdc.tab.indicator.directive';

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
`;

describe('MdcTabScrollerDirective', () => {
    abstract class AbstractTestComponent {
        tabs = [
          {icon: 'access_time', label: 'recents'},
          {icon: 'near_me', label: 'nearby'},
          {icon: 'favorite', label: 'favorites'}
        ];
    }

    @Component({
        template: template
    })
    class TestComponent extends AbstractTestComponent {
    }

    function setup(testComponentType: any = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...TAB_INDICATOR_DIRECTIVES, ...TAB_DIRECTIVES, ...TAB_SCROLLER_DIRECTIVES, ...TAB_BAR_DIRECTIVES, testComponentType]
        }).createComponent(testComponentType);
        fixture.detectChanges();
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
});
