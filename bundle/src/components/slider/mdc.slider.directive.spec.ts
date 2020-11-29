import { TestBed, ComponentFixture, fakeAsync, tick, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdcSliderDirective, MdcFormsSliderDirective } from './mdc.slider.directive';

const template = `
<div mdcSlider aria-label="Select Value"
    [(minValue)]="min" [(maxValue)]="max" [(stepValue)]="step"
    [discrete]="discrete" [markers]="markers"
    [(value)]="value" [disabled]="disabled"></div>
`;

const templateForms = `
<div mdcSlider aria-label="Select Value"
    [(minValue)]="min" [(maxValue)]="max" [(stepValue)]="step"
    [discrete]="discrete" [markers]="markers"
    [(ngModel)]="value" [disabled]="disabled"></div>
`;

describe('MdcSliderDirective', () => {
    abstract class AbstractTestComponent {
        _value: number;
        _min = 0;
        _max = 100;
        _step = 1;
        discrete = false;
        markers = false;
        disabled: boolean;
        changes = [];

        get value() {
            return this._value;
        }

        set value(value: number) {
            this.changes.push({field: 'value', value: value});
            this._value = value;
        }

        get min() {
            return this._min;
        }

        set min(value: number) {
            this.changes.push({field: 'min', value: value});
            this._min = value;
        }

        get max() {
            return this._max;
        }

        set max(value: number) {
            this.changes.push({field: 'max', value: value});
            this._max = value;
        }

        get step() {
            return this._step;
        }

        set step(value: number) {
            this.changes.push({field: 'step', value: value});
            this._step = value;
        }

        clear() {
            this.changes = [];
        }

    }

    @Component({
        template: template
    })
    class TestComponent extends AbstractTestComponent {
    }

    @Component({
        template: templateForms
    })
    class FormsTestComponent extends AbstractTestComponent {
    }

    function setup(testComponentType: any = TestComponent, withForms = false) {
        const fixture = withForms ?
            TestBed.configureTestingModule({
                imports: [FormsModule],
                declarations: [MdcSliderDirective, MdcFormsSliderDirective, testComponentType]
            }).createComponent(testComponentType)
        :
            TestBed.configureTestingModule({
                declarations: [MdcSliderDirective, testComponentType]
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
        const slider: HTMLElement = fixture.nativeElement.querySelector('.mdc-slider');
        expect(slider).toBeDefined();
        expect(slider.getAttribute('tabindex')).toBe('0');
        expect(slider.getAttribute('aria-valuenow')).toBeNull();
        expect(slider.getAttribute('aria-valuemin')).toBeNull();
        expect(slider.getAttribute('aria-valuemax')).toBeNull();
        expect(slider.getAttribute('aria-disabled')).toBe('false');
        expect(slider.getAttribute('role')).toBe('slider');
    }));

    it('should initialize with bound values', fakeAsync(() => {
        const { fixture } = setup(TestComponent);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const slider: HTMLElement = fixture.nativeElement.querySelector('.mdc-slider');
        expect(slider).toBeDefined();
        expect(slider.getAttribute('tabindex')).toBe('0');
        expect(slider.getAttribute('aria-valuenow')).toBeNull();
        expect(slider.getAttribute('aria-valuemin')).toBe('0');
        expect(slider.getAttribute('aria-valuemax')).toBe('100');
        expect(slider.getAttribute('aria-disabled')).toBe('false');
        expect(slider.getAttribute('role')).toBe('slider');
        expect(testComponent._value).toBeUndefined();
        expect(testComponent.changes).toEqual([]);

        testComponent._value = 5;
        fixture.detectChanges(); tick();
        expect(slider.getAttribute('aria-valuenow')).toBe('5');
        expect(testComponent.changes).toEqual([]); // changes is about view -> model
    }));

    function testValueAndRangeChanges(testComponentType: any, withForms: boolean) {
        const { fixture } = setup(testComponentType, withForms);
        const testComponent = fixture.debugElement.injector.get(testComponentType);
        const slider: HTMLElement = fixture.nativeElement.querySelector('.mdc-slider');

        testComponent.clear();
        testComponent._value = 90;
        fixture.detectChanges(); tick(); fixture.detectChanges();

        expect(slider.getAttribute('aria-valuenow')).toBe('90');
        expect(slider.getAttribute('aria-valuemin')).toBe('0');
        expect(slider.getAttribute('aria-valuemax')).toBe('100');
        expect(testComponent.changes).toEqual([]); // changes is about view -> model

        testComponent.clear();
        testComponent._max = 50;
        fixture.detectChanges(); tick(); fixture.detectChanges();

        expect(slider.getAttribute('aria-valuenow')).toBe('50');
        expect(slider.getAttribute('aria-valuemin')).toBe('0');
        expect(slider.getAttribute('aria-valuemax')).toBe('50');
        expect(testComponent.changes).toEqual([
            {field: 'value', value: 50}
        ]); // changes is about view -> model

        testComponent.clear();
        testComponent._value = 60;
        fixture.detectChanges(); tick(); fixture.detectChanges();
        expect(slider.getAttribute('aria-valuenow')).toBe('50');
        expect(slider.getAttribute('aria-valuemin')).toBe('0');
        expect(slider.getAttribute('aria-valuemax')).toBe('50');
        expect(testComponent.changes).toEqual([
            {field: 'value', value: 50}
        ]); // changes is about view -> model

        testComponent.clear();
        testComponent._min = 60;
        fixture.detectChanges(); tick(); fixture.detectChanges();
        expect(slider.getAttribute('aria-valuenow')).toBe('60');
        expect(slider.getAttribute('aria-valuemin')).toBe('60');
        expect(slider.getAttribute('aria-valuemax')).toBe('60');
        expect(testComponent.changes).toEqual([
            {field: 'max', value: 60},
            {field: 'value', value: 60}
        ]); // changes is about view -> model

        testComponent.clear();
        testComponent._max = 10;
        fixture.detectChanges(); tick(); fixture.detectChanges();
        expect(slider.getAttribute('aria-valuenow')).toBe('10');
        expect(slider.getAttribute('aria-valuemin')).toBe('10');
        expect(slider.getAttribute('aria-valuemax')).toBe('10');
        expect(testComponent.changes).toEqual([
            {field: 'min', value: 10},
            {field: 'value', value: 10}
        ]); // changes is about view -> model
    }

    it('should keep value and ranges valid', fakeAsync(() => {
        testValueAndRangeChanges(TestComponent, false);
    }));

    it('should keep value and ranges valid when binding ngModel', fakeAsync(() => {
        testValueAndRangeChanges(FormsTestComponent, true);
    }));

    it('can be discrete and have markers', fakeAsync(() => {
        const { fixture } = setup(TestComponent);
        const testComponent = fixture.debugElement.injector.get(TestComponent);

        const slider: HTMLElement = fixture.nativeElement.querySelector('.mdc-slider');
        // dosn't have pin markers:
        expect(slider.querySelector('div.mdc-slider__pin')).toBeNull();
        expect(slider.querySelector('div.mdc-slider__pin-value-marker')).toBeNull();

        testComponent.discrete = true;
        testComponent.markers = true;
        fixture.detectChanges(); tick(25);

        // now must have pin markers:
        expect(slider.querySelector('div.mdc-slider__pin')).not.toBeNull();
        expect(slider.querySelector('div.mdc-slider__pin-value-marker')).not.toBeNull();
    }));

    function testDisabling(testComponentType: any, withForms: boolean) {
        const { fixture } = setup(testComponentType, withForms);
        const testComponent = fixture.debugElement.injector.get(testComponentType);
        const slider: HTMLElement = fixture.nativeElement.querySelector('.mdc-slider');

        expect(slider.getAttribute('aria-disabled')).toBe('false');
        expect(slider.classList.contains('mdc-slider--disabled')).toBe(false);
        testComponent.disabled = true;
        fixture.detectChanges();
        expect(slider.getAttribute('aria-disabled')).toBe('true');
        expect(slider.classList).toContain('mdc-slider--disabled');
    }

    it('disabled sliders', (() => {
        testDisabling(TestComponent, false);
    }));

    it('disabled sliders binding to ngModel', (() => {
        testDisabling(FormsTestComponent, true);
    }));

});
