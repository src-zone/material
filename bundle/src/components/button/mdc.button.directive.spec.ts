import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MDC_EVENT_REGISTRY_PROVIDER } from '../../utils/mdc.event.registry';
import { MdcButtonDirective } from './mdc.button.directive';
import { booleanAttributeStyleTest, hasRipple } from '../../testutils/page.test';

describe('MdcButtonDirective', () => {
    @Component({
        template: `
          <button mdcButton [raised]="raised" [outlined]="outlined" [dense]="dense">button</button>
        `
    })
    class TestComponent {
        raised: any = null;
        outlined: any = null;
        dense: any = null;
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            providers: [ MDC_EVENT_REGISTRY_PROVIDER ],
            declarations: [MdcButtonDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('should render the buttons', (() => {
        const { fixture } = setup();
        const buttons = fixture.nativeElement.querySelectorAll('button');
        expect(buttons.length).toBe(1);
    }));

    it('should have button and ripple styling', fakeAsync(() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('button');
        expect(button.classList).toContain('mdc-button');
        expect(hasRipple(button)).toBe(true, 'buttons should attach a ripple by default');
    }));

    it('should style according to the value of the raised property', (() => {
        const { fixture } = setup();
        testStyle(fixture, 'raised', 'mdc-button--raised');
    }));

    it('should style according to the value of the outlined property', (() => {
        const { fixture } = setup();
        testStyle(fixture, 'outlined', 'mdc-button--outlined');
    }));

    it('should style according to the value of the dense property', (() => {
        const { fixture } = setup();
        testStyle(fixture, 'dense', 'mdc-button--dense');
    }));

    const testStyle = (fixture: ComponentFixture<TestComponent>, property: string, style: string) => {
        const button = fixture.debugElement.query(By.directive(MdcButtonDirective)).injector.get(MdcButtonDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        // initial the styles are not set:
        expect(button[property]).toBe(false);
        expect(button._elm.nativeElement.classList.contains(style)).toBe(false);
        // test various ways to set the property value, and the result of having the class or not:
        booleanAttributeStyleTest(fixture, testComponent, button, property, property, style);
    }
});
