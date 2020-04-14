import { TestBed, fakeAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MdcButtonDirective, MdcButtonIconDirective, MdcButtonLabelDirective } from './mdc.button.directive';
import { testStyle, hasRipple } from '../../testutils/page.test';

describe('MdcButtonDirective', () => {
    it('should render the button with ripple and label', fakeAsync(() => {
        const { fixture } = setup();
        const buttons = fixture.nativeElement.querySelectorAll('button');
        expect(buttons.length).toBe(1);
        const button: HTMLButtonElement = buttons[0];
        expect(button.children[0].classList).toContain('mdc-button__ripple');
        expect(hasRipple(button)).toBe(true, 'the ripple element should be attached');
        expect(button.children[1].classList).toContain('mdc-button__label');
    }));

    it('should style according to the value of the unelevated property', (() => {
        const { fixture } = setup();
        testStyle(fixture, 'unelevated', 'unelevated', 'mdc-button--unelevated', MdcButtonDirective, TestComponent);
    }));

    it('should style according to the value of the raised property', (() => {
        const { fixture } = setup();
        testStyle(fixture, 'raised', 'raised', 'mdc-button--raised', MdcButtonDirective, TestComponent);
    }));

    it('should style according to the value of the outlined property', (() => {
        const { fixture } = setup();
        testStyle(fixture, 'outlined', 'outlined', 'mdc-button--outlined', MdcButtonDirective, TestComponent);
    }));

    it('should render icon properly', (() => {
        const { fixture, testComponent } = setup();
        testComponent.materialIcon = 'bookmark';
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('button');
        const icon: HTMLElement = button.children[1];
        expect(icon.classList).toContain('mdc-button__icon');
        expect(icon.attributes.getNamedItem('aria-hiden')).toBeDefined();
    }));

    @Component({
        template: `
          <button mdcButton [unelevated]="unelevated" [raised]="raised" [outlined]="outlined">
            <i *ngIf="materialIcon" mdcButtonIcon class="material-icons">{{materialIcon}}</i>
            <span mdcButtonLabel>button</span>
          </button>
        `
    })
    class TestComponent {
        unelevated: any = null;
        raised: any = null;
        outlined: any = null;
        materialIcon: any = null;
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcButtonDirective, MdcButtonIconDirective, MdcButtonLabelDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        return { fixture, testComponent };
    }
});
