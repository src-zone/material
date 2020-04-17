import { TestBed, fakeAsync, ComponentFixture, tick, flush } from '@angular/core/testing';
import { Component, Type } from '@angular/core';
import { MdcRadioInputDirective, MdcRadioDirective } from './mdc.radio.directive';
import { hasRipple } from '../../testutils/page.test';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('MdcRadioDirective', () => {
    it('should render the mdcRadio with ripple and label', fakeAsync(() => {
        const { fixture } = setup();
        const root = fixture.nativeElement.querySelector('.mdc-radio');
        expect(root.children.length).toBe(3);
        expect(root.children[0].classList).toContain('mdc-radio__native-control');
        expect(root.children[1].classList).toContain('mdc-radio__background');
        expect(root.children[2].classList).toContain('mdc-radio__ripple');
        expect(hasRipple(root)).toBe(true, 'the ripple element should be attached');
    }));

    it('checked can be set programmatically', fakeAsync(() => {
        const { fixture, testComponent, elements } = setup();
        expect(testComponent.value).toBe(null);
        for (let i in [0, 1, 2])
            expect(elements[i].checked).toBe(false);
        setAndCheck(fixture, 'r1', [true, false, false]);
        setAndCheck(fixture, 'r2', [false, true, false]);
        setAndCheck(fixture, 'r3', [false, false, true]);
        setAndCheck(fixture, 'doesnotexist', [false, false, false]);
        setAndCheck(fixture, null, [false, false, false]);
        setAndCheck(fixture, '', [false, false, false]);
    }));

    it('checked can be set by user', fakeAsync(() => {
        const { fixture, testComponent, elements, inputs } = setup();

        elements[1].click();
        tick(); fixture.detectChanges();
        expect(elements.map(e => e.checked)).toEqual([false, true, false]);
        expect(testComponent.value).toBe('r2');
    }));

    it('can be disabled', fakeAsync(() => {
        const { fixture, testComponent, elements, inputs } = setup();

        testComponent.disabled = true;
        fixture.detectChanges();
        for (let i in [0, 1, 2]) {
            expect(elements[i].disabled).toBe(true);
            expect(inputs[i].disabled).toBe(true);
        }
        expect(testComponent.disabled).toBe(true);
        const radio = fixture.debugElement.query(By.directive(MdcRadioDirective)).injector.get(MdcRadioDirective);
        expect(radio['isRippleSurfaceDisabled']()).toBe(true);
        expect(radio['root'].nativeElement.classList).toContain('mdc-radio--disabled');

        testComponent.disabled = false;
        fixture.detectChanges();
        for (let i in [0, 1, 2]) {
            expect(elements[i].disabled).toBe(false);
            expect(inputs[i].disabled).toBe(false);
        }
        expect(testComponent.disabled).toBe(false);
        expect(radio['isRippleSurfaceDisabled']()).toBe(false);
        expect(radio['root'].nativeElement.classList).not.toContain('mdc-radio--disabled');
    }));

    it('native input can be changed dynamically', fakeAsync(() => {
        const { fixture, testComponent } = setup(TestComponentDynamicInput);

        let elements = fixture.nativeElement.querySelectorAll('.mdc-radio__native-control');
        // when no input is present the mdcRadio renders without an initialized foundation:
        expect(elements.length).toBe(0);

        let check = false;
        for (let i = 0; i != 3; ++i) {
            // render/include one of the inputs:
            testComponent.input = i;
            fixture.detectChanges();
            // the input should be recognized, the foundation is (re)initialized,
            // so we have a fully functional mdcRadio now:
            elements = fixture.nativeElement.querySelectorAll('.mdc-radio__native-control');
            expect(elements.length).toBe(1);
            expect(elements[0].classList).toContain('mdc-radio__native-control');
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
        elements = fixture.nativeElement.querySelectorAll('.mdc-radio__native-control');
        // when no input is present the mdcRadio renders without an initialized foundation:
        expect(elements.length).toBe(0);
        expect(testComponent.checked).toBe(check);
    }));

    it('user interactions are registered in the absence of template bindings', fakeAsync(() => {
        const { fixture, elements, inputs } = setup(TestComponentNoBinding);
        
        expect(elements.map(e => e.checked)).toEqual([false, false, false]);
        elements[1].click();
        fixture.detectChanges();
        expect(elements.map(e => e.checked)).toEqual([false, true, false]);
    }));

    function setAndCheck(fixture: ComponentFixture<TestComponent>, value: any, expected: boolean[]) {
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const elements: HTMLInputElement[] = Array.from(fixture.nativeElement.querySelectorAll('.mdc-radio__native-control'));
        testComponent.value = value;
        fixture.detectChanges();
        expect(elements.map(e => e.checked)).toEqual(expected);
    }

    @Component({
        template: `
          <div mdcRadio><input mdcRadioInput type="radio" name="group" value="r1" [checked]="value === 'r1'" (click)="value = 'r1'" [disabled]="disabled"/></div>
          <div mdcRadio><input mdcRadioInput type="radio" name="group" value="r2" [checked]="value === 'r2'" (click)="value = 'r2'" [disabled]="disabled"/></div>
          <div mdcRadio><input mdcRadioInput type="radio" name="group" value="r3" [checked]="value === 'r3'" (click)="value = 'r3'" [disabled]="disabled"/></div>
        `
    })
    class TestComponent {
        value: any = null;
        disabled: any = null;
    }

    @Component({
        template: `
          <div mdcRadio><input mdcRadioInput type="radio" name="group" value="r1"/></div>
          <div mdcRadio><input mdcRadioInput type="radio" name="group" value="r2"/></div>
          <div mdcRadio><input mdcRadioInput type="radio" name="group" value="r3"/></div>
        `
    })
    class TestComponentNoBinding {
    }

    @Component({
        template: `
          <div mdcRadio>
            <input *ngIf="input === 0" id="i0" mdcRadioInput type="radio" [checked]="checked"/>
            <input *ngIf="input === 1" id="i1" mdcRadioInput type="radio" [checked]="checked"/>
            <input *ngIf="input === 2" id="i2" mdcRadioInput type="radio" [checked]="checked"/>
          </div>
        `
    })
    class TestComponentDynamicInput {
        input: number = null;
        checked: any = null;
    }

    function setup(compType: Type<any> = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcRadioInputDirective, MdcRadioDirective, compType]
        }).createComponent(compType);
        fixture.detectChanges();
        const testComponent = fixture.debugElement.injector.get(compType);
        const inputs = fixture.debugElement.queryAll(By.directive(MdcRadioInputDirective)).map(i => i.injector.get(MdcRadioInputDirective));
        const elements: HTMLInputElement[] = Array.from(fixture.nativeElement.querySelectorAll('.mdc-radio__native-control'));
        return { fixture, testComponent, inputs, elements };
    }
});

describe('MdcRadioDirective with FormsModule', () => {
    it('ngModel can be set programmatically', fakeAsync(() => {
        const { fixture, testComponent, elements } = setup();
        expect(testComponent.value).toBe(null);
        for (let i in [0, 1, 2])
            expect(elements[i].checked).toBe(false);
        setAndCheck(fixture, 'r1', [true, false, false]);
        setAndCheck(fixture, 'r2', [false, true, false]);
        setAndCheck(fixture, 'r3', [false, false, true]);
        setAndCheck(fixture, 'doesnotexist', [false, false, false]);
        setAndCheck(fixture, null, [false, false, false]);
        setAndCheck(fixture, '', [false, false, false]);
    }));

    it('ngModel can be changed by user', fakeAsync(() => {
        const { fixture, testComponent, elements, inputs } = setup();

        expect(elements.map(e => e.checked)).toEqual([false, false, false]);
        expect(testComponent.value).toBe(null);
        
        elements[0].click();
        fixture.detectChanges();
        expect(elements.map(e => e.checked)).toEqual([true, false, false]);
        expect(testComponent.value).toBe('r1');

        elements[2].click();
        fixture.detectChanges();
        expect(elements.map(e => e.checked)).toEqual([false, false, true]);
        expect(testComponent.value).toBe('r3');
    }));

    function setAndCheck(fixture: ComponentFixture<TestComponent>, value: any, expected: boolean[]) {
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const elements: HTMLInputElement[] = Array.from(fixture.nativeElement.querySelectorAll('.mdc-radio__native-control'));
        testComponent.value = value;
        fixture.detectChanges(); flush();
        expect(elements.map(e => e.checked)).toEqual(expected);
    }

    @Component({
        template: `
          <div mdcRadio><input mdcRadioInput type="radio" name="group" value="r1" [(ngModel)]="value"/></div>
          <div mdcRadio><input mdcRadioInput type="radio" name="group" value="r2" [(ngModel)]="value"/></div>
          <div mdcRadio><input mdcRadioInput type="radio" name="group" value="r3" [(ngModel)]="value"/></div>
        `
    })
    class TestComponent {
        value: any = null;
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [MdcRadioInputDirective, MdcRadioDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        tick();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const inputs = fixture.debugElement.queryAll(By.directive(MdcRadioInputDirective)).map(i => i.injector.get(MdcRadioInputDirective));
        const elements: HTMLInputElement[] = Array.from(fixture.nativeElement.querySelectorAll('.mdc-radio__native-control'));
        return { fixture, testComponent, inputs, elements };
    }
});
