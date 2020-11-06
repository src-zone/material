import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { TAB_DIRECTIVES, MdcTabDirective } from './mdc.tab.directive';
import { TAB_INDICATOR_DIRECTIVES } from './mdc.tab.indicator.directive';
import { hasRipple } from '../../testutils/page.test';

const template = `
<button mdcTab [active]="active" (interact)="interact($event)">
  <span mdcTabContent>
    <span mdcTabIcon class="material-icons">favorite</span>
    <span mdcTabLabel>Favorites</span>
  </span>
  <span mdcTabIndicator>
    <span mdcTabIndicatorContent></span>
  </span>
</button>
`;

const templateIndicatorSpanning = `
<button mdcTab [active]="active" (interact)="interact($event)">
  <span mdcTabContent>
    <span mdcTabIcon class="material-icons">favorite</span>
    <span mdcTabLabel>Favorites</span>
    <span mdcTabIndicator>
      <span mdcTabIndicatorContent></span>
    </span>
  </span>
</button>
`;

describe('MdcTabDirective', () => {
    abstract class AbstractTestComponent {
        events = [];
        active: boolean = null;
        interact(event: any) { // TODO: it's now interact & private, do we have this in tests like this?
            this.events.push(event);
        }
    }

    @Component({
        template: template
    })
    class TestComponent extends AbstractTestComponent {
    }

    @Component({
        template: templateIndicatorSpanning
    })
    class SpanningTestComponent {
    }

    function setup(testComponentType: any = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...TAB_INDICATOR_DIRECTIVES, ...TAB_DIRECTIVES, testComponentType]
        }).createComponent(testComponentType);
        fixture.detectChanges();
        return { fixture };
    }

    it('should initialize with defaults', fakeAsync(() => {
        const { fixture } = setup(TestComponent);
        const tab: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab');
        expect(tab).toBeDefined();
        expect(tab.classList).not.toContain('mdc-tab--active');
        expect(fixture.nativeElement.querySelector('.mdc-tab__content')).toBeDefined();
        expect(fixture.nativeElement.querySelector('.mdc-tab__icon')).toBeDefined();
        expect(fixture.nativeElement.querySelector('.mdc-tab__text-label')).toBeDefined();
        expect(fixture.nativeElement.querySelector('.mdc-tab-indicator')).toBeDefined();
        expect(fixture.nativeElement.querySelector('.mdc-tab-indicator__content')).toBeDefined();
        expect(hasRipple(tab)).toBe(true, 'the ripple element should be attached');
    }));

    it('tab can be activated and deactivated', (() => {
        const { fixture } = setup(TestComponent);
        validateActivation(fixture, TestComponent);
    }));

    it('indicator spanning tab activation and deactivation', (() => {
        const { fixture } = setup(SpanningTestComponent);
        validateActivation(fixture, SpanningTestComponent);
    }));

    it('click triggers interact event', fakeAsync(() => {
        const { fixture } = setup(TestComponent);
        const tab: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab');
        const mdcTab = fixture.debugElement.query(By.directive(MdcTabDirective)).injector.get(MdcTabDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);

        expect(testComponent.events).toEqual([]);
        tab.click(); tick(); fixture.detectChanges();
        expect(testComponent.events).toEqual([{tab: mdcTab, tabIndex: null}]);
    }));

    function validateActivation(fixture: ComponentFixture<unknown>, testComponentType: any = TestComponent) {
        const tab: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab');
        const mdcTab = fixture.debugElement.query(By.directive(MdcTabDirective)).injector.get(MdcTabDirective);
        const indicator: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab-indicator');
        const testComponent = fixture.debugElement.injector.get(testComponentType);
        
        expect(tab.classList).not.toContain('mdc-tab--active');
        expect(indicator.classList).not.toContain('mdc-tab-indicator--active');
    
        mdcTab._activate(); fixture.detectChanges();
        expect(tab.classList).toContain('mdc-tab--active');
        expect(indicator.classList).toContain('mdc-tab-indicator--active');
    
        // changing active property should not do anything (but send a message to the parent,
        // so that it can deactivate the right tab and activate this one):
        testComponent.active = false; fixture.detectChanges();
        expect(tab.classList).toContain('mdc-tab--active');
        expect(indicator.classList).toContain('mdc-tab-indicator--active');
    
        mdcTab._foundation.deactivate(); fixture.detectChanges();
        expect(tab.classList).not.toContain('mdc-tab--active');
        expect(indicator.classList).not.toContain('mdc-tab-indicator--active');
    }
});

