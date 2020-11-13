import { TestBed, fakeAsync, ComponentFixture, tick, flush } from '@angular/core/testing';
import { Component, Type } from '@angular/core';
import { MdcSwitchDirective, MdcSwitchInputDirective, MdcSwitchThumbDirective } from './mdc.switch.directive';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('MdcSwitchDirective', () => {
    it('should render the switch with correct styling and sub-elements', fakeAsync(() => {
        const { switchElement } = setup();
        expect(switchElement.classList).toContain('mdc-switch');
        expect(switchElement.children.length).toBe(2);
        expect(switchElement.children[0].classList).toContain('mdc-switch__track');
        expect(switchElement.children[1].classList).toContain('mdc-switch__thumb-underlay');
        const thumbUnderlay = switchElement.children[1];
        expect(thumbUnderlay.children.length).toBe(2);
        expect(thumbUnderlay.children[0].classList).toContain('mdc-switch__thumb');
        expect(thumbUnderlay.children[1].classList).toContain('mdc-switch__native-control');
    }));

    it('checked can be set programmatically', fakeAsync(() => {
        const { fixture, testComponent, element } = setup();
        expect(testComponent.checked).toBe(null);
        expect(element.checked).toBe(false);
        setAndCheck(fixture, 'yes', true);
        setAndCheck(fixture, 1, true);
        setAndCheck(fixture, true, true);
        setAndCheck(fixture, 'false', false);
        setAndCheck(fixture, '0', true);
        setAndCheck(fixture, false, false);
        setAndCheck(fixture, 0, true);
        setAndCheck(fixture, null, false);
        setAndCheck(fixture, '', true);
    }));

    it('checked can be set by user', fakeAsync(() => {
        const { fixture, element } = setup();

        expect(element.checked).toBe(false);
        clickAndCheck(fixture, true, false);
        clickAndCheck(fixture, false, false);
        clickAndCheck(fixture, true, false);
    }));

    it('can be disabled', fakeAsync(() => {
        const { fixture, testComponent, element, input } = setup();

        testComponent.disabled = true;
        fixture.detectChanges();
        expect(element.disabled).toBe(true);
        expect(input.disabled).toBe(true);
        expect(testComponent.disabled).toBe(true);
        const sw = fixture.debugElement.query(By.directive(MdcSwitchDirective)).injector.get(MdcSwitchDirective);
        expect(sw['root'].nativeElement.classList).toContain('mdc-switch--disabled');

        testComponent.disabled = false;
        fixture.detectChanges();
        expect(element.disabled).toBe(false);
        expect(input.disabled).toBe(false);
        expect(testComponent.disabled).toBe(false);
    }));

    it('native input can be changed dynamically', fakeAsync(() => {
        const { fixture, testComponent } = setup(TestComponentDynamicInput);

        let elements = fixture.nativeElement.querySelectorAll('.mdc-switch__native-control');
        // when no input is present the mdcSwitch renders without an initialized foundation:
        expect(elements.length).toBe(0);

        let check = false;
        for (let i = 0; i != 3; ++i) {
            // render/include one of the inputs:
            testComponent.input = i;
            fixture.detectChanges();
            // the input should be recognized, the foundation is (re)initialized,
            // so we have a fully functional mdcSwitch now:
            elements = fixture.nativeElement.querySelectorAll('.mdc-switch__native-control');
            expect(elements.length).toBe(1);
            expect(elements[0].classList).toContain('mdc-switch__native-control');
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
        elements = fixture.nativeElement.querySelectorAll('.mdc-switch__native-control');
        // when no input is present the mdcSwitch renders without an initialized foundation:
        expect(elements.length).toBe(0);
        expect(testComponent.checked).toBe(check);
    }));

    it('user interactions are registered in the absence of template bindings', fakeAsync(() => {
        const { fixture, element, input } = setup(TestComponentNoBindings);
        
        expect(element.checked).toBe(false);
        expect(input.checked).toBe(false);
        clickAndCheckNb(true);
        clickAndCheckNb(false);
        clickAndCheckNb(true);

        function clickAndCheckNb(expected) {
            element.click();
            tick(); fixture.detectChanges(); flush();
            expect(element.checked).toBe(expected);
            expect(input.checked).toBe(expected);
        }
    }));

    it('aria-checked should reflect state of switch', (() => {
        const { fixture, testComponent, element } = setup();
        
        expect(element.getAttribute('aria-checked')).toBe('false');
        element.click(); // user change
        expect(element.getAttribute('aria-checked')).toBe('true');
        testComponent.checked = false; //programmatic change
        fixture.detectChanges();
        expect(element.getAttribute('aria-checked')).toBe('false');
    }));

    it('input should have role=switch attribute', (() => {
        const { element } = setup();
        expect(element.getAttribute('role')).toBe('switch');
    }));

    function setAndCheck(fixture: ComponentFixture<TestComponent>, value: any, expected: boolean) {
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const element = fixture.nativeElement.querySelector('.mdc-switch__native-control');
        const input = fixture.debugElement.query(By.directive(MdcSwitchInputDirective))?.injector.get(MdcSwitchInputDirective);
        testComponent.checked = value;
        fixture.detectChanges();
        expect(element.checked).toBe(expected);
        expect(input.checked).toBe(expected);
    }

    function clickAndCheck(fixture: ComponentFixture<TestComponent>, expected: boolean, expectIndeterminate: any) {
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const element = fixture.nativeElement.querySelector('.mdc-switch__native-control');
        const input = fixture.debugElement.query(By.directive(MdcSwitchInputDirective))?.injector.get(MdcSwitchInputDirective);
        element.click();
        tick(); fixture.detectChanges();
        expect(element.checked).toBe(expected);
        expect(input.checked).toBe(expected);
        expect(testComponent.checked).toBe(expected);
    }

    @Component({
        template: `
            <div mdcSwitch>
                <div mdcSwitchThumb>
                    <input mdcSwitchInput type="checkbox" id="basic-switch" [checked]="checked" (click)="onClick()" [disabled]="disabled">
                </div>
            </div>
            <label for="basic-switch">off/on</label>
        `
    })
    class TestComponent {
        checked: any = null;
        disabled: any = null;
        onClick() {
            this.checked = !this.checked;
        }
    }

    @Component({
        template: `
            <div mdcSwitch>
                <div mdcSwitchThumb>
                    <input mdcSwitchInput type="checkbox" id="basic-switch">
                </div>
            </div>
        `
    })
    class TestComponentNoBindings {
    }

    @Component({
        template: `
            <div mdcSwitch>
                <div mdcSwitchThumb>
                    <input *ngIf="input === 0" id="i0" mdcSwitchInput type="checkbox" [checked]="checked"/>
                    <input *ngIf="input === 1" id="i1" mdcSwitchInput type="checkbox" [checked]="checked"/>
                    <input *ngIf="input === 2" id="i2" mdcSwitchInput type="checkbox" [checked]="checked"/>
                </div>
            </div>
        `
    })
    class TestComponentDynamicInput {
        input: number = null;
        checked: any = null;
    }

    function setup(compType: Type<any> = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcSwitchDirective, MdcSwitchInputDirective, MdcSwitchThumbDirective, compType]
        }).createComponent(compType);
        fixture.detectChanges();
        const testComponent = fixture.debugElement.injector.get(compType);
        const input = fixture.debugElement.query(By.directive(MdcSwitchInputDirective))?.injector.get(MdcSwitchInputDirective);
        const element = fixture.nativeElement.querySelector('.mdc-switch__native-control');
        const switchElement = fixture.nativeElement.querySelector('.mdc-switch');
        return { fixture, testComponent, input, element, switchElement };
    }
});

describe('MdcSwitchDirective with FormsModule', () => {
    it('ngModel can be set programmatically', fakeAsync(() => {
        const { fixture, testComponent, element } = setup();
        expect(testComponent.value).toBe(null);
        expect(element.checked).toBe(false);

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
        const { fixture, testComponent, input } = setup();

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

        element.click();
        tick(); fixture.detectChanges();
        expect(element.checked).toBe(false);
        expect(input.checked).toBe(false);
        expect(testComponent.value).toBe(false);
    }));

    function setAndCheck(fixture: ComponentFixture<TestComponent>, value: any, expectedValue: boolean) {
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const element = fixture.nativeElement.querySelector('.mdc-switch__native-control');
        const input = fixture.debugElement.query(By.directive(MdcSwitchInputDirective)).injector.get(MdcSwitchInputDirective);
        testComponent.value = value;
        fixture.detectChanges(); tick();
        expect(input.checked).toBe(expectedValue);
        expect(element.checked).toBe(expectedValue);
        expect(testComponent.value).toBe(value);
    }

    @Component({
        template: `
          <div mdcSwitch>
            <input mdcSwitchInput type="checkbox" [(ngModel)]="value"/>
          </div>
        `
    })
    class TestComponent {
        value: any = null;
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [MdcSwitchInputDirective, MdcSwitchDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        tick();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const input = fixture.debugElement.query(By.directive(MdcSwitchInputDirective)).injector.get(MdcSwitchInputDirective);
        const element = fixture.nativeElement.querySelector('.mdc-switch__native-control');
        return { fixture, testComponent, input, element };
    }
});
