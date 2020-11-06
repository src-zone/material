import { TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MdcTabIndicatorDirective, TAB_INDICATOR_DIRECTIVES } from './mdc.tab.indicator.directive';

const template = `
<span [mdcTabIndicator]="type">
  <span [mdcTabIndicatorContent]="contentType"
        [class.material-icons]="contentType === 'icon'">{{contentType === 'icon' ? 'favorite' : ''}}</span>
</span>
`;

describe('MdcTabIndicatorDirective', () => {
    abstract class AbstractTestComponent {
        type: string = null;
        contentType: string = null;
    }

    @Component({
        template: template
    })
    class TestComponent extends AbstractTestComponent {
    }

    function setup(testComponentType: any = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...TAB_INDICATOR_DIRECTIVES, testComponentType]
        }).createComponent(testComponentType);
        fixture.detectChanges();
        return { fixture };
    }

    @Component({
        template: template
    })
    class UninitializedTestComponent {
    }

    it('should initialize with defaults', (() => {
        const { fixture } = setup(UninitializedTestComponent);
        const indicator: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab-indicator');
        expect(indicator).toBeDefined();
        expect(indicator.classList).not.toContain('mdc-tab-indicator--fade');
        const content: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab-indicator__content');
        expect(content).toBeDefined();
        expect(content.classList).toContain('mdc-tab-indicator__content--underline');
        expect(content.classList).not.toContain('mdc-tab-indicator__content--icon');
    }));

    it('indicator can be activated and deactivated', (() => {
        const { fixture } = setup(UninitializedTestComponent);
        const indicator: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab-indicator');
        expect(indicator.classList).not.toContain('mdc-tab-indicator--active');
        const mdcIndicator = fixture.debugElement.query(By.directive(MdcTabIndicatorDirective)).injector.get(MdcTabIndicatorDirective);
        
        mdcIndicator.activate(null); fixture.detectChanges();
        expect(indicator.classList).toContain('mdc-tab-indicator--active');

        mdcIndicator.deactivate(); fixture.detectChanges();
        expect(indicator.classList).not.toContain('mdc-tab-indicator--active');
    }));

    it('indicator type can be changed', fakeAsync(() => {
        const { fixture } = setup(TestComponent);
        const indicator: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab-indicator');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        expect(indicator.classList).not.toContain('mdc-tab-indicator--fade');

        testComponent.type = 'fade'; fixture.detectChanges();
        expect(indicator.classList).toContain('mdc-tab-indicator--fade');

        testComponent.type = 'underline'; fixture.detectChanges();
        expect(indicator.classList).not.toContain('mdc-tab-indicator--fade');
    }));

    it('indicatorContent type can be changed', fakeAsync(() => {
        const { fixture } = setup(TestComponent);
        const content: HTMLElement = fixture.nativeElement.querySelector('.mdc-tab-indicator__content');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const mdcIndicator = fixture.debugElement.query(By.directive(MdcTabIndicatorDirective)).injector.get(MdcTabIndicatorDirective);
        expect(content.classList).toContain('mdc-tab-indicator__content--underline');
        expect(content.classList).not.toContain('mdc-tab-indicator__content--icon');

        testComponent.contentType = 'icon'; fixture.detectChanges();
        expect(content.classList).not.toContain('mdc-tab-indicator__content--underline');
        expect(content.classList).toContain('mdc-tab-indicator__content--icon');
        
        mdcIndicator.activate(null);

        testComponent.contentType = 'underline'; fixture.detectChanges();
        expect(content.classList).toContain('mdc-tab-indicator__content--underline');
        expect(content.classList).not.toContain('mdc-tab-indicator__content--icon');

        mdcIndicator.deactivate();
    }));
});
