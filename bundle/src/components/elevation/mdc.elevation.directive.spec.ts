import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MdcElevationDirective } from './mdc.elevation.directive';
import { booleanAttributeStyleTest } from '../../testutils/page.test';

describe('MdcElevationDirective', () => {
    @Component({
        template: `
          <div id="el1" [mdcElevation]="elevation" [animateTransition]="animate">elevated</div>
        `
    })
    class TestComponent {
        elevation: any;
        animate: any;
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcElevationDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('should be elevated', (() => {
        const { fixture } = setup();
        const div = fixture.nativeElement.querySelector('div#el1');
        expect(div.classList).toContain('mdc-elevation--z1');
        expect(div.classList.contains('mdc-elevation-transition')).toBe(false);
    }));

    it('should animate elevation changes based on the animateTransition property', (() => {
        const { fixture } = setup();
        const directive = fixture.debugElement.query(By.directive(MdcElevationDirective)).injector.get(MdcElevationDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        // initial the animate styles is not set:
        expect(directive.animateTransition).toBe(false);
        // test various ways to set the property value, and the result of having the class or not:
        booleanAttributeStyleTest(fixture, testComponent, directive, 'animate', 'animateTransition', 'mdc-elevation-transition');
    }));

    it('should change elevation when property changes with numeric values', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);

        verifyElevationChange(0, 0, fixture);
        verifyElevationChange(-1, 0, fixture);
        verifyElevationChange(5, 5, fixture);
        verifyElevationChange(24, 24, fixture);
        verifyElevationChange(25, 24, fixture);
    }));

    it('should change elevation when property changes with string values', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);

        verifyElevationChange('0', 0, fixture);
        verifyElevationChange('-1', 0, fixture);
        verifyElevationChange('5', 5, fixture);
        verifyElevationChange('24', 24, fixture);
        verifyElevationChange('25', 24, fixture);
    }));

    it('should change elevation when property changes with invalid type values', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);

        verifyElevationChange(true, 1, fixture);
        verifyElevationChange(false, 0, fixture);
        verifyElevationChange({}, 0, fixture);
        verifyElevationChange(null, 1, fixture);
    }));

    it('should have an elevation of 1 if not initialized with a value', (() => {
        @Component({
            template: '<div id="el1" mdcElevation>elevated</div>'
        })
        class TestComponent {}
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcElevationDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        const div = fixture.nativeElement.querySelector('div#el1');
        expect(div.classList).toContain('mdc-elevation--z1');
    }));

    const verifyElevationChange = (input: any, elevation: number, fixture: ComponentFixture<TestComponent>) => {
        const style = 'mdc-elevation--z' + elevation;
        const directive = fixture.debugElement.query(By.directive(MdcElevationDirective)).injector.get(MdcElevationDirective);
        const element = fixture.nativeElement.querySelector('div#el1');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.elevation = input;
        fixture.detectChanges();
        expect(directive.mdcElevation).toBe(elevation);
        expect(element.classList).toContain(style, 'value: ' + JSON.stringify(elevation));
    }
});
