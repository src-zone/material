import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MDCRippleFoundation, MDCRippleAdapter } from '@material/ripple';
import { MdcRippleDirective } from './mdc.ripple.directive';
import { testStyle, hasRipple } from '../../testutils/page.test';
import { spyOnAll } from '../../testutils/util';

describe('MdcRippleDirective', () => {
    it('should attach the ripple effect', fakeAsync(() => {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcRippleDirective, SimpleTestComponent]
        }).createComponent(SimpleTestComponent);
        fixture.detectChanges();
        const div = fixture.nativeElement.querySelector('div');
        expect(hasRipple(div)).toBe(true, 'mdcRipple should attach the mdc-ripple-upgraded class');
    }));

    it('on/off can be set programmatically', fakeAsync(() => {
        const { fixture } = setup();
        testStyle(fixture, 'ripple', 'mdcRipple', 'mdc-ripple-upgraded', MdcRippleDirective, TestComponent, () => {tick(20); });
    }));

    it('can be disabled programmatically', fakeAsync(() => {
        const { fixture, button, testComponent, ripple } = setupEnabled();
        expect(ripple['isRippleSurfaceDisabled']()).toBe(false);
        button.disabled = true;
        expect(ripple['isRippleSurfaceDisabled']()).toBe(true);
        testComponent.disabled = false;
        fixture.detectChanges();
        expect(ripple['isRippleSurfaceDisabled']()).toBe(false);
        button.disabled = false;
        testComponent.disabled = true;
        fixture.detectChanges();
        expect(ripple['isRippleSurfaceDisabled']()).toBe(true);
        testComponent.disabled = null;
        fixture.detectChanges();
        expect(ripple['isRippleSurfaceDisabled']()).toBe(false);
    }));

    it('can be made (un)bounded programmatically', fakeAsync(() => {
        const { fixture } = setupEnabled();
        testStyle(fixture, 'unbounded', 'unbounded', 'mdc-ripple-upgraded--unbounded', MdcRippleDirective, TestComponent, () => {tick(20); });
    }));

    it('dimension can be changed', fakeAsync(() => {
        const { fixture, button, testComponent, ripple } = setupEnabled();

        testComponent.dimension = "150";
        fixture.detectChanges();
        expect(ripple.dimension).toBe(150);
        const {left, top} = button.getBoundingClientRect();
        expect(ripple['computeRippleBoundingRect']()).toEqual({
            left,
            top,
            width: 150,
            height: 150,
            right: left + 150,
            bottom: top + 150
        });
    }));

    it('dimension can be changed', fakeAsync(() => {
        const { fixture, button, testComponent, ripple } = setupEnabled();

        testComponent.dimension = "150";
        fixture.detectChanges();
        expect(ripple.dimension).toBe(150);
        const {left, top} = button.getBoundingClientRect();
        expect(ripple['computeRippleBoundingRect']()).toEqual({
            left,
            top,
            width: 150,
            height: 150,
            right: left + 150,
            bottom: top + 150
        });
    }));

    it('surface can be anabled, disabled, or set to primary or accent', fakeAsync(() => {
        const { fixture, button, testComponent, ripple } = setupEnabled();

        expect(button.classList).toContain('mdc-ripple-surface');
        expect(button.classList).not.toContain('mdc-ripple-surface--primary');
        expect(button.classList).not.toContain('mdc-ripple-surface--accent');

        testComponent.surface = 'primary';
        fixture.detectChanges();
        expect(button.classList).toContain('mdc-ripple-surface');
        expect(button.classList).toContain('mdc-ripple-surface--primary');
        expect(button.classList).not.toContain('mdc-ripple-surface--accent');

        testComponent.surface = false;
        fixture.detectChanges();
        expect(button.classList).not.toContain('mdc-ripple-surface');
        expect(button.classList).not.toContain('mdc-ripple-surface--primary');
        expect(button.classList).not.toContain('mdc-ripple-surface--accent');
    }));

    it('focus and blur events are passed to foundation', fakeAsync(() => {
        const { button, foundation } = setupEnabled();
        expect(foundation.handleBlur).not.toHaveBeenCalled();
        expect(foundation.handleFocus).not.toHaveBeenCalled();
        button.dispatchEvent(new Event('focus'));
        tick();
        expect(foundation.handleBlur).not.toHaveBeenCalled();
        expect(foundation.handleFocus).toHaveBeenCalled();
        button.dispatchEvent(new Event('blur'));
        tick();
        expect(foundation.handleBlur).toHaveBeenCalled();
        expect(foundation.handleFocus).toHaveBeenCalled();
    }));

    it('can be activated', fakeAsync(() => {
        const { button, adapter } = setupEnabled();
        (<jasmine.Spy>adapter.computeBoundingRect).calls.reset();
        (<jasmine.Spy>adapter.addClass).calls.reset();
        (<jasmine.Spy>adapter.removeClass).calls.reset();
        button.dispatchEvent(new Event('mousedown'));
        tick(5);
        expect(adapter.computeBoundingRect).toHaveBeenCalled();
        expect(adapter.addClass).toHaveBeenCalledWith('mdc-ripple-upgraded--foreground-activation');
        expect(adapter.removeClass).toHaveBeenCalledWith('mdc-ripple-upgraded--foreground-activation');
        tick(300); // wait for all animation frames / queued timers
    }));

    it('can be programmatically activated/deactivated', fakeAsync(() => {
        const { ripple, foundation, adapter } = setupEnabled();
        (<jasmine.Spy>adapter.computeBoundingRect).calls.reset();
        (<jasmine.Spy>adapter.addClass).calls.reset();
        (<jasmine.Spy>adapter.removeClass).calls.reset();
        ripple.activateRipple();
        tick(5);
        expect(foundation.activate).toHaveBeenCalled();
        expect(adapter.computeBoundingRect).toHaveBeenCalled();
        expect(adapter.addClass).toHaveBeenCalledWith('mdc-ripple-upgraded--foreground-activation');
        expect(adapter.removeClass).toHaveBeenCalledWith('mdc-ripple-upgraded--foreground-activation');
        (<jasmine.Spy>adapter.addClass).calls.reset();
        (<jasmine.Spy>adapter.removeClass).calls.reset();
        ripple.deactivateRipple();
        expect(foundation.deactivate).toHaveBeenCalled();
        tick(400); // wait for all animation frames / queued timers
    }));

    it('initRipple must not be called when already initialized', fakeAsync(() => {
        const { ripple } = setupEnabled();
        expect(ripple['isRippleInitialized']()).toBeTrue();
        expect(() => {
            ripple['initRipple']();
        }).toThrowError('initRipple() is called multiple times');
    }));

    it('isRippleSurfaceActive default implementation', fakeAsync(() => {
        const { button, ripple } = setupEnabled();
        expect(ripple['isRippleSurfaceActive']()).toBeFalse();
        button.matches = (selector) => selector === ':active';
        expect(ripple['isRippleSurfaceActive']()).toBeTrue();
    }));

    @Component({
        template: `
          <div mdcRipple surface>ripple</div>
        `
    })
    class SimpleTestComponent {
    }

    @Component({
        template: `
          <button [mdcRipple]="ripple" [surface]="surface" [disabled]="disabled" [unbounded]="unbounded" [dimension]="dimension">ripple</button>
        `
    })
    class TestComponent {
        ripple: any = null;
        disabled: any = null;
        unbounded: any = null;
        dimension: any = null;
        surface: any = true;
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcRippleDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    function setupEnabled() {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('button');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const ripple = fixture.debugElement.query(By.directive(MdcRippleDirective)).injector.get(MdcRippleDirective);
        // spy-on adapter, before it's used to initialize the foundation (otherwise spies will never be called):
        let adapter: MDCRippleAdapter = ripple['mdcRippleAdapter'];
        spyOnAll(adapter);
        // enable the ripple:
        testComponent.ripple = true;
        fixture.detectChanges();
        tick(20);
        // attach some spies:
        let foundation: MDCRippleFoundation = ripple['_rippleFoundation'];
        spyOnAll(foundation);

        return { fixture, button, testComponent, ripple, foundation, adapter };
    }
});
