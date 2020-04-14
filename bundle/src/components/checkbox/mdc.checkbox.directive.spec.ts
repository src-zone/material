import { TestBed, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { Component, Type } from '@angular/core';
import { MdcCheckboxInputDirective, MdcCheckboxDirective } from './mdc.checkbox.directive';
import { hasRipple } from '../../testutils/page.test';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TLSSocket } from 'tls';

describe('MdcCheckBoxDirective', () => {
    it('should render the checkbox with ripple and label', fakeAsync(() => {
        const { fixture } = setup();
        const root = fixture.nativeElement.querySelector('.mdc-checkbox');
        expect(root.children.length).toBe(3);
        expect(root.children[0].classList).toContain('mdc-checkbox__ripple');
        expect(root.children[1].classList).toContain('mdc-checkbox__native-control');
        expect(root.children[2].classList).toContain('mdc-checkbox__background');
        expect(hasRipple(root)).toBe(true, 'the ripple element should be attached');
    }));

    it('checked can be set programmatically', fakeAsync(() => {
        const { fixture, testComponent, element } = setup();
        expect(testComponent.checked).toBe(null);
        expect(element.checked).toBe(false);
        setAndCheck(fixture, 'yes', true);
        setAndCheck(fixture, 1, true);
        setAndCheck(fixture, true, true);
        setAndCheck(fixture, 'false', false);
        setAndCheck(fixture, false, false);
        setAndCheck(fixture, '0', true);
        setAndCheck(fixture, null, false);
    }));

    it('indeterminate can be set programmatically', fakeAsync(() => {
        const { fixture, testComponent, element } = setup();
        expect(testComponent.indeterminate).toBe(null);
        expect(element.indeterminate).toBe(false);
        setAndCheckIndeterminate(fixture, 'yes', true);
        setAndCheckIndeterminate(fixture, 'false', false);
        setAndCheckIndeterminate(fixture, 1, true);
        setAndCheckIndeterminate(fixture, false, false);
        setAndCheckIndeterminate(fixture, true, true);
        setAndCheckIndeterminate(fixture, null, false);
        setAndCheckIndeterminate(fixture, '0', true);
    }));

    it('checked can be set by user', fakeAsync(() => {
        const { fixture, testComponent, element, input } = setup();

        element.click();
        tick(); fixture.detectChanges();
        expect(element.checked).toBe(true);
        expect(input.checked).toBe(true);
        expect(testComponent.checked).toBe(true);

        element.click();
        tick(); fixture.detectChanges();
        expect(element.checked).toBe(false);
        expect(input.checked).toBe(false);
        expect(testComponent.checked).toBe(false);

        // indeterminate property was never changed from origin value, because
        //  null is interpreted as false:
        expect(testComponent.indeterminate).toBe(null);
        input.indeterminate = true;
        tick(); fixture.detectChanges();
        expect(testComponent.indeterminate).toBe(true);
        // changing the value should remove the indeterminate flag:
        element.click();
        tick(); fixture.detectChanges();
        expect(testComponent.indeterminate).toBe(false);
        expect(testComponent.checked).toBe(true);
    }));

    it('can be disabled', fakeAsync(() => {
        const { fixture, testComponent, element, input } = setup();

        testComponent.disabled = true;
        fixture.detectChanges(); tick(20); // wait for requestAnimationFrame handling
        expect(element.disabled).toBe(true);
        expect(input.disabled).toBe(true);
        expect(testComponent.disabled).toBe(true);
        const checkbox = fixture.debugElement.query(By.directive(MdcCheckboxDirective)).injector.get(MdcCheckboxDirective);
        expect(checkbox['isRippleSurfaceDisabled']()).toBe(true);
        expect(checkbox['root'].nativeElement.classList).toContain('mdc-checkbox--disabled');

        testComponent.disabled = false;
        fixture.detectChanges();
        expect(element.disabled).toBe(false);
        expect(input.disabled).toBe(false);
        expect(testComponent.disabled).toBe(false);
        expect(checkbox['isRippleSurfaceDisabled']()).toBe(false);
        expect(checkbox['root'].nativeElement.classList).not.toContain('mdc-checkbox--disabled');
    }));

    it('native input can be changed dynamically', fakeAsync(() => {
        const { fixture, testComponent, input } = setup(TestComponentDynamicInput);

        let elements = fixture.nativeElement.querySelectorAll('.mdc-checkbox__native-control');
        // when no input is present the mdcCheckbox renders without an initialized foundation:
        expect(elements.length).toBe(0);

        let check = false;
        for (let i = 0; i != 3; ++i) {
            // render/include one of the inputs:
            testComponent.input = i;
            fixture.detectChanges();
            // the input should be recognized, the foundation is (re)initialized,
            // so we have a fully functional mdcICheckbox now:
            elements = fixture.nativeElement.querySelectorAll('.mdc-checkbox__native-control');
            expect(elements.length).toBe(1);
            expect(elements[0].classList).toContain('mdc-checkbox__native-control');
            expect(elements[0].id).toBe(`i${i}`);
            // the value of the native input is correctly synced with the testcomponent:
            expect(elements[0].checked).toBe(check);
            // change the value for the next iteration:
            check = !check;
            testComponent.checked = check;
            fixture.detectChanges();
            expect(elements[0].checked).toBe(check);
        }

        // removing input should also work:
        testComponent.input = null;
        fixture.detectChanges();
        elements = fixture.nativeElement.querySelectorAll('.mdc-checkbox__native-control');
        // when no input is present the mdcCheckbox renders without an initialized foundation:
        expect(elements.length).toBe(0);
        expect(testComponent.checked).toBe(check);
    }));

    function setAndCheck(fixture: ComponentFixture<TestComponent>, value: any, expected: boolean) {
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const element = fixture.nativeElement.querySelector('.mdc-checkbox__native-control');
        testComponent.checked = value;
        fixture.detectChanges();
        expect(element.checked).toBe(expected);
    }

    function setAndCheckIndeterminate(fixture: ComponentFixture<TestComponent>, value: any, expected: boolean) {
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const element = fixture.nativeElement.querySelector('.mdc-checkbox__native-control');
        testComponent.indeterminate = value;
        fixture.detectChanges();
        expect(element.indeterminate).toBe(expected);
    }

    @Component({
        template: `
          <div mdcCheckbox>
            <input mdcCheckboxInput type="checkbox" [(checked)]="checked" [(indeterminate)]="indeterminate" [disabled]="disabled"/>
          </div>
        `
    })
    class TestComponent {
        checked: any = null;
        indeterminate: any = null;
        disabled: any = null;
    }

    @Component({
        template: `
          <div mdcCheckbox>
            <input *ngIf="input === 0" id="i0" mdcCheckboxInput type="checkbox" [(checked)]="checked"/>
            <input *ngIf="input === 1" id="i1" mdcCheckboxInput type="checkbox" [(checked)]="checked"/>
            <input *ngIf="input === 2" id="i2" mdcCheckboxInput type="checkbox" [(checked)]="checked"/>
          </div>
        `
    })
    class TestComponentDynamicInput {
        input: number = null;
        checked: any = null;
        indeterminate: any = null;
    }

    function setup(compType: Type<any> = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcCheckboxInputDirective, MdcCheckboxDirective, compType]
        }).createComponent(compType);
        fixture.detectChanges();
        const testComponent = fixture.debugElement.injector.get(compType);
        const input = fixture.debugElement.query(By.directive(MdcCheckboxInputDirective))?.injector.get(MdcCheckboxInputDirective);
        const element = fixture.nativeElement.querySelector('.mdc-checkbox__native-control');
        return { fixture, testComponent, input, element };
    }
});

describe('MdcCheckBoxDirective with FormsModule', () => {
    it('ngModel can be set programmatically', fakeAsync(() => {
        const { fixture, testComponent, element } = setup();
        expect(testComponent.value).toBe(null);
        expect(element.checked).toBe(false);
        expect(element.indeterminate).toBe(true);

        // Note that binding to 'ngModel' behaves slightly different from binding to 'checked'
        // ngModel coerces values the javascript way: it does !!bindedValue
        // checked coerces the string-safe way: value != null && `${value}` !== 'false'
        setAndCheck(fixture, 'yes', true);
        setAndCheck(fixture, false, false);
        setAndCheck(fixture, 'false', true); // the way it works for ngModel...
        setAndCheck(fixture, null, false);
        setAndCheck(fixture, 1, true);
        setAndCheck(fixture, 0, false);
        setAndCheck(fixture, '0', true);
    }));

    it('ngModel can be changed by updating checked property', fakeAsync(() => {
        const { fixture, testComponent, element, input } = setup();

        input.checked = true;
        fixture.detectChanges(); tick();
        expect(testComponent.value).toBe(true);

        input.checked = false;
        fixture.detectChanges(); tick();
        expect(testComponent.value).toBe(false);
    }));

    it('ngModel can be changed by user', fakeAsync(() => {
        const { fixture, testComponent, element, input } = setup();

        element.click();
        tick(); fixture.detectChanges();
        expect(element.checked).toBe(true);
        expect(input.checked).toBe(true);
        expect(testComponent.value).toBe(true);
        expect(testComponent.indeterminate).toBe(false);

        element.click();
        tick(); fixture.detectChanges();
        expect(element.checked).toBe(false);
        expect(input.checked).toBe(false);
        expect(testComponent.value).toBe(false);
        expect(testComponent.indeterminate).toBe(false);
    }));

    function setAndCheck(fixture: ComponentFixture<TestComponent>, value: any, expectedValue: boolean) {
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const element = fixture.nativeElement.querySelector('.mdc-checkbox__native-control');
        const input = fixture.debugElement.query(By.directive(MdcCheckboxInputDirective)).injector.get(MdcCheckboxInputDirective);
        testComponent.value = value;
        fixture.detectChanges(); tick();
        expect(input.checked).toBe(value);
        expect(element.checked).toBe(expectedValue);
        expect(input.indeterminate).toBe(value == null);
        expect(element.indeterminate).toBe(value == null);
    }

    @Component({
        template: `
          <div mdcCheckbox>
            <input mdcCheckboxInput type="checkbox" [(ngModel)]="value" [indeterminate]="indeterminate"/>
          </div>
        `
    })
    class TestComponent {
        value: any = null;
        get indeterminate() {
            return this.value == null;
        }
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [MdcCheckboxInputDirective, MdcCheckboxDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        tick();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const input = fixture.debugElement.query(By.directive(MdcCheckboxInputDirective)).injector.get(MdcCheckboxInputDirective);
        const element = fixture.nativeElement.querySelector('.mdc-checkbox__native-control');
        return { fixture, testComponent, input, element };
    }
});
