import { TestBed, fakeAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TAB_SCROLLER_DIRECTIVES } from './mdc.tab.scroller.directive';
import { TAB_DIRECTIVES } from './mdc.tab.directive';
import { TAB_INDICATOR_DIRECTIVES } from './mdc.tab.indicator.directive';

const template = `
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
            declarations: [...TAB_INDICATOR_DIRECTIVES, ...TAB_DIRECTIVES, ...TAB_SCROLLER_DIRECTIVES, testComponentType]
        }).createComponent(testComponentType);
        fixture.detectChanges();
        return { fixture };
    }

    it('should initialize with defaults', fakeAsync(() => {
        const { fixture } = setup(TestComponent);
        const scroller: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab-scroller');
        const area: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab-scroller__scroll-area');
        const content: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab-scroller__scroll-content');

        expect(scroller).toBeDefined();
        expect(area).toBeDefined();
        expect(content).toBeDefined();
    }));
});

