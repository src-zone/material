import { TestBed, fakeAsync, ComponentFixture, tick, flush } from '@angular/core/testing';
import { Component, Type } from '@angular/core';
import { MdcFloatingLabelDirective } from '../floating-label/mdc.floating-label.directive';
import { MdcNotchedOutlineDirective, MdcNotchedOutlineNotchDirective } from '../notched-outline/mdc.notched-outline.directive';
import { MdcTextFieldDirective, MdcTextFieldInputDirective, MdcTextFieldIconDirective,
    MdcTextFieldHelperLineDirective, MdcTextFieldHelperTextDirective } from './mdc.text-field.directive';
import { hasRipple } from '../../testutils/page.test';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('MdcTextFieldDirective', () => {
    it('filled: should render the text-field with ripple and label', fakeAsync(() => {
        const { fixture } = setup();
        const root = fixture.nativeElement.querySelector('.mdc-text-field');
        expect(root.children.length).toBe(4);
        expect(root.children[0].classList).toContain('mdc-text-field__ripple');
        expect(root.children[1].classList).toContain('mdc-text-field__input');
        expect(root.children[2].classList).toContain('mdc-floating-label');
        expect(root.children[3].classList).toContain('mdc-line-ripple');
        expect(hasRipple(root)).toBe(true, 'the ripple element should be attached');

        // input must be labelled by the floating label:
        expect(root.children[2].id).toMatch(/mdc-u-id-.*/);
        expect(root.children[1].getAttribute('aria-labelledby')).toBe(root.children[2].id);
    }));

    it('filled: floating label must float when input has focus', fakeAsync(() => {
        const { fixture, element } = setup();
        const floatingLabelElm = fixture.nativeElement.querySelector('.mdc-floating-label');
        expect(floatingLabelElm.classList).not.toContain('mdc-floating-label--float-above');
        element.dispatchEvent(new Event('focus')); tick();
        expect(floatingLabelElm.classList).toContain('mdc-floating-label--float-above');
        element.dispatchEvent(new Event('blur')); tick();
        expect(floatingLabelElm.classList).not.toContain('mdc-floating-label--float-above');
    }));

    it('outlined: should render the text-field with outline and label', fakeAsync(() => {
        const { fixture, testComponent } = setup();
        testComponent.outlined = true;
        fixture.detectChanges(); tick(5); fixture.detectChanges();
        const root = fixture.nativeElement.querySelector('.mdc-text-field');
        expect(root.children.length).toBe(2);
        expect(root.children[0].classList).toContain('mdc-text-field__input');
        expect(root.children[1].classList).toContain('mdc-notched-outline');
        const notchedOutline = root.children[1];
        expect(notchedOutline.children.length).toBe(3);
        expect(notchedOutline.children[0].classList).toContain('mdc-notched-outline__leading');
        expect(notchedOutline.children[1].classList).toContain('mdc-notched-outline__notch');
        expect(notchedOutline.children[2].classList).toContain('mdc-notched-outline__trailing');
        const notch = notchedOutline.children[1];
        expect(notch.children.length).toBe(1);
        expect(notch.children[0].classList).toContain('mdc-floating-label');
        const floatingLabel = notch.children[0];
        
        expect(hasRipple(root)).toBe(false, 'no ripple allowed on outlined inputs');

        // input must be labelled by the floating label:
        expect(floatingLabel.id).toMatch(/mdc-u-id-.*/);
        expect(root.children[0].getAttribute('aria-labelledby')).toBe(floatingLabel.id);
    }));

    it('value can be changed programmatically', fakeAsync(() => {
        const { fixture, testComponent, element } = setup();
        expect(testComponent.value).toBe(null);
        expect(element.value).toBe('');
        setAndCheck(fixture, 'ab');
        setAndCheck(fixture, '');
        setAndCheck(fixture, '   ');
        setAndCheck(fixture, null);
    }));

    it('value can be changed by user', fakeAsync(() => {
        const { fixture, element, testComponent } = setup();

        expect(testComponent.value).toBe(null);
        expect(element.value).toEqual('');
        typeAndCheck(fixture, 'abc');
        typeAndCheck(fixture, '');
    }));

    it('can be disabled', fakeAsync(() => {
        const { fixture, testComponent, element, input } = setup();

        testComponent.disabled = true;
        fixture.detectChanges();
        expect(element.disabled).toBe(true);
        expect(input.disabled).toBe(true);
        expect(testComponent.disabled).toBe(true);
        const field = fixture.debugElement.query(By.directive(MdcTextFieldDirective)).injector.get(MdcTextFieldDirective);
        expect(field['isRippleSurfaceDisabled']()).toBe(true);
        expect(field['root'].nativeElement.classList).toContain('mdc-text-field--disabled');

        testComponent.disabled = false;
        fixture.detectChanges();
        expect(element.disabled).toBe(false);
        expect(input.disabled).toBe(false);
        expect(testComponent.disabled).toBe(false);
        expect(field['isRippleSurfaceDisabled']()).toBe(false);
        expect(field['root'].nativeElement.classList).not.toContain('mdc-text-field--disabled');
    }));

    it('without label', fakeAsync(() => {
        const { fixture, testComponent } = setup();
        const field = fixture.debugElement.query(By.directive(MdcTextFieldDirective)).injector.get(MdcTextFieldDirective);
        expect(field['root'].nativeElement.classList).not.toContain('mdc-text-field--no-label');
        testComponent.labeled = false;
        fixture.detectChanges(); tick(5);
        expect(field['root'].nativeElement.classList).toContain('mdc-text-field--no-label');
    }));

    it('textarea', fakeAsync(() => {
        const { fixture } = setup(TestTextareaComponent);
        const root = fixture.nativeElement.querySelector('.mdc-text-field');
        expect(root.classList).toContain('mdc-text-field--textarea');
        expect(root.children.length).toBe(2);
        expect(root.children[0].classList).toContain('mdc-text-field__input');
        expect(root.children[1].classList).toContain('mdc-notched-outline');
        expect(hasRipple(root)).toBe(false, 'no ripple allowed on outlined/textarea inputs');
        checkFloating(fixture, false);
        typeAndCheck(fixture, 'typing text\nin my textarea', TestTextareaComponent);
    }));

    it('helper text', fakeAsync(() => {
        const { fixture, testComponent, element } = setup(TestWithHelperTextComponent);
        testComponent.withHelperText = true;
        const helperText: HTMLElement = fixture.nativeElement.querySelector('.mdc-text-field-helper-text');
        expect(helperText.id).toMatch(/mdc-u-id-[0-9]+/);
        const helperId = helperText.id;
        expect(helperText.classList).not.toContain('mdc-text-field-helper-text--persistent');
        expect(helperText.classList).not.toContain('mdc-text-field-helper-text--validation-msg');
        expect(element.getAttribute('aria-controls')).toBe(helperId);
        expect(element.getAttribute('aria-describedby')).toBe(helperId);
        testComponent.persistent = true;
        fixture.detectChanges(); flush();
        expect(helperText.classList).toContain('mdc-text-field-helper-text--persistent');
        expect(helperText.classList).not.toContain('mdc-text-field-helper-text--validation-msg');
        testComponent.persistent = false;
        testComponent.validation = true;
        fixture.detectChanges(); flush();
        expect(helperText.classList).not.toContain('mdc-text-field-helper-text--persistent');
        expect(helperText.classList).toContain('mdc-text-field-helper-text--validation-msg');
    }));

    it('helper text dynamic ids', fakeAsync(() => {
        const { fixture, testComponent, element } = setup(TestWithHelperTextDynamicIdComponent);
        testComponent.withHelperText = true;
        const helperText: HTMLElement = fixture.nativeElement.querySelector('.mdc-text-field-helper-text');
        expect(helperText.id).toBe('someId');
        expect(element.getAttribute('aria-controls')).toBe('someId');
        expect(element.getAttribute('aria-describedby')).toBe('someId');
        testComponent.helperId = 'otherId';
        fixture.detectChanges(); flush();
        expect(helperText.id).toBe('otherId');
        expect(element.getAttribute('aria-controls')).toBe('otherId');
        expect(element.getAttribute('aria-describedby')).toBe('otherId');
    }));

    it('icons', fakeAsync(() => {
        const { fixture, testComponent } = setup();
        const root = fixture.nativeElement.querySelector('.mdc-text-field');
        expect(fixture.nativeElement.querySelectorAll('.mdc-text-field__icon').length).toBe(0);
        expect(fixture.nativeElement.querySelectorAll('.mdc-text-field__icon--leading').length).toBe(0);
        expect(fixture.nativeElement.querySelectorAll('.mdc-text-field__icon--trailing').length).toBe(0);
        expect(root.classList).not.toContain('mdc-text-field--with-leading-icon');
        expect(root.classList).not.toContain('mdc-text-field--with-trailing-icon');
        testComponent.leadingIcon = true;
        fixture.detectChanges(); tick(5); fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.mdc-text-field__icon').length).toBe(1);
        expect(fixture.nativeElement.querySelectorAll('.mdc-text-field__icon--leading').length).toBe(1);
        expect(fixture.nativeElement.querySelectorAll('.mdc-text-field__icon--trailing').length).toBe(0);
        expect(root.classList).toContain('mdc-text-field--with-leading-icon');
        expect(root.classList).not.toContain('mdc-text-field--with-trailing-icon');
        testComponent.trailingIcon = true;
        fixture.detectChanges(); tick(5); fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.mdc-text-field__icon').length).toBe(2);
        expect(fixture.nativeElement.querySelectorAll('.mdc-text-field__icon--leading').length).toBe(1);
        expect(fixture.nativeElement.querySelectorAll('.mdc-text-field__icon--trailing').length).toBe(1);
        expect(root.classList).toContain('mdc-text-field--with-leading-icon');
        expect(root.classList).toContain('mdc-text-field--with-trailing-icon');

        const leadIcon = fixture.nativeElement.querySelector('.mdc-text-field__icon--leading');
        const trailIcon = fixture.nativeElement.querySelector('.mdc-text-field__icon--trailing');
        expect(leadIcon.getAttribute('role')).toBeNull(); // no interaction -> no role
        expect(trailIcon.getAttribute('role')).toBe('button');
        expect(leadIcon.tabIndex).toBe(-1); // no interaction -> no tabIndex
        expect(trailIcon.tabIndex).toBe(0);
        testComponent.disabled = true;
        fixture.detectChanges(); tick(5); fixture.detectChanges();
        expect(trailIcon.getAttribute('role')).toBeNull(); // disabled -> no role
        expect(trailIcon.tabIndex).toBe(-1); // disabled -> no tabIndex
        testComponent.disabled = false;
        fixture.detectChanges(); tick(5); fixture.detectChanges();

        // interactions:
        expect(testComponent.trailingIconInteractions).toBe(0);
        trailIcon.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(testComponent.trailingIconInteractions).toBe(1);
    }));

    function setAndCheck(fixture: ComponentFixture<TestComponent>, value: any) {
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const element = fixture.nativeElement.querySelector('.mdc-text-field__input');
        const input = fixture.debugElement.query(By.directive(MdcTextFieldInputDirective))?.injector.get(MdcTextFieldInputDirective);
        testComponent.value = value;
        fixture.detectChanges(); flush();
        expect(element.value).toBe(value || '');
        expect(input.value).toBe(value || '');
        expect(testComponent.value).toBe(value);

        checkFloating(fixture, value != null && value.length > 0);
    }

    function typeAndCheck(fixture: ComponentFixture<any>, value: string, type: Type<any> = TestComponent) {
        const testComponent = fixture.debugElement.injector.get(type);
        const element = fixture.nativeElement.querySelector('.mdc-text-field__input');
        const input = fixture.debugElement.query(By.directive(MdcTextFieldInputDirective))?.injector.get(MdcTextFieldInputDirective);
        element.value = value;
        element.dispatchEvent(new Event('focus'));
        element.dispatchEvent(new Event('input'));
        element.dispatchEvent(new Event('blur')); // focus/blur events triggered for testing label float depending on value after blur
        tick(); fixture.detectChanges();
        expect(element.value).toBe(value);
        expect(input.value).toBe(value);
        expect(testComponent.value).toBe(value);

        checkFloating(fixture, value != null && value.length > 0);
    }

    @Component({
        template: `
          <label mdcTextField>
            <i *ngIf="leadingIcon" mdcTextFieldIcon class="material-icons">phone</i>
            <input mdcTextFieldInput type="text" [value]="value" (input)="onInput($event)" [disabled]="disabled">
            <i *ngIf="trailingIcon" mdcTextFieldIcon class="material-icons" (interact)="trailingIconInteract()">event</i>
            <span *ngIf="outlined && labeled" mdcNotchedOutline>
              <span mdcNotchedOutlineNotch>
                <span mdcFloatingLabel>Floating Label</span>
              </span>
            </span>
            <span *ngIf="!outlined && labeled" mdcFloatingLabel>Floating Label</span>
          </label>
        `
    })
    class TestComponent {
        value: any = null;
        outlined: any = null;
        disabled: any = null;
        labeled = true;
        withHelperText = false;
        leadingIcon = false;
        trailingIcon = false;
        trailingIconInteractions = 0;
        onInput(e) {
            this.value = e.target.value;
        }
        trailingIconInteract() {
            ++this.trailingIconInteractions;
        }
    }

    @Component({
        template: `
          <label mdcTextField>
            <textarea mdcTextFieldInput rows="8" cols="40" [value]="value" (input)="onInput($event)"></textarea>
            <span mdcNotchedOutline>
              <span mdcNotchedOutlineNotch>
                <span mdcFloatingLabel>Floating Label</span>
              </span>
            </span>
          </label>
        `
    })
    class TestTextareaComponent {
        value: any = null;
        onInput(e) {
            this.value = e.target.value;
        }
    }

    @Component({
        template: `
          <label mdcTextField [helperText]="help">
            <input mdcTextFieldInput type="text" [value]="value" (input)="onInput($event)" [disabled]="disabled">
            <span *ngIf="outlined && labeled" mdcNotchedOutline>
              <span mdcNotchedOutlineNotch>
                <span mdcFloatingLabel>Floating Label</span>
              </span>
            </span>
            <span *ngIf="!outlined && labeled" mdcFloatingLabel>Floating Label</span>
          </label>
          <div mdcTextFieldHelperLine>
            <div mdcTextFieldHelperText #help="mdcHelperText" [persistent]="persistent" [validation]="validation">helper text</div>
          </div>
        `
    })
    class TestWithHelperTextComponent {
        value: any = null;
        persistent: any = null;
        validation: any = null;
        onInput(e) {
            this.value = e.target.value;
        }
    }

    @Component({
        template: `
          <label mdcTextField [helperText]="help">
            <input mdcTextFieldInput type="text" [value]="value" (input)="onInput($event)">
            <span mdcFloatingLabel>Floating Label</span>
          </label>
          <div mdcTextFieldHelperLine>
            <div mdcTextFieldHelperText [id]="helperId" #help="mdcHelperText">helper text</div>
          </div>
        `
    })
    class TestWithHelperTextDynamicIdComponent {
        value: any = null;
        helperId = 'someId';
        onInput(e) {
            this.value = e.target.value;
        }
    }

    function setup(compType: Type<any> = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [
                MdcTextFieldDirective, MdcTextFieldInputDirective, MdcTextFieldIconDirective,
                MdcTextFieldHelperLineDirective, MdcTextFieldHelperTextDirective,
                MdcFloatingLabelDirective,
                MdcNotchedOutlineNotchDirective, MdcNotchedOutlineDirective,
                compType]
        }).createComponent(compType);
        fixture.detectChanges(); flush();
        const testComponent = fixture.debugElement.injector.get(compType);
        const input = fixture.debugElement.query(By.directive(MdcTextFieldInputDirective))?.injector.get(MdcTextFieldInputDirective);
        const element: HTMLInputElement = fixture.nativeElement.querySelector('.mdc-text-field__input');
        return { fixture, testComponent, input, element };
    }
});

describe('MdcTextFieldDirective with FormsModule', () => {
    it('ngModel can be set programmatically', fakeAsync(() => {
        const { fixture, testComponent, element } = setup();
        expect(testComponent.value).toBe(null);
        expect(element.value).toBe('');
        setAndCheck(fixture, 'ab');
        setAndCheck(fixture, '');
        setAndCheck(fixture, '   ');
        setAndCheck(fixture, null);
    }));

    it('ngModel can be changed by updating value property', fakeAsync(() => {
        const { fixture, testComponent, input } = setup();

        input.value = 'new value';
        fixture.detectChanges(); tick();
        expect(testComponent.value).toBe('new value');
        checkFloating(fixture, true);

        input.value = '';
        fixture.detectChanges(); tick();
        expect(testComponent.value).toBe('');
        checkFloating(fixture, false);

        input.value = null; // the browser will change this to ''
        fixture.detectChanges(); tick();
        expect(testComponent.value).toBe('');
        checkFloating(fixture, false);
    }));

    it('ngModel can be changed by user', fakeAsync(() => {
        const { fixture, element, testComponent } = setup();

        expect(testComponent.value).toBe(null);
        expect(element.value).toEqual('');
        typeAndCheck(fixture, 'abc');
        typeAndCheck(fixture, '');
    }));

    it('can be disabled', fakeAsync(() => {
        const { fixture, testComponent, element, input } = setup();

        testComponent.disabled = true;
        fixture.detectChanges(); tick(); fixture.detectChanges();
        expect(element.disabled).toBe(true);
        expect(input.disabled).toBe(true);
        expect(testComponent.disabled).toBe(true);
        const field = fixture.debugElement.query(By.directive(MdcTextFieldDirective)).injector.get(MdcTextFieldDirective);
        expect(field['isRippleSurfaceDisabled']()).toBe(true);
        expect(field['root'].nativeElement.classList).toContain('mdc-text-field--disabled');

        testComponent.disabled = false;
        fixture.detectChanges(); tick(); fixture.detectChanges();
        expect(element.disabled).toBe(false);
        expect(input.disabled).toBe(false);
        expect(testComponent.disabled).toBe(false);
        expect(field['isRippleSurfaceDisabled']()).toBe(false);
        expect(field['root'].nativeElement.classList).not.toContain('mdc-text-field--disabled');
    }));

    function setAndCheck(fixture: ComponentFixture<TestComponent>, value: any) {
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const element = fixture.nativeElement.querySelector('.mdc-text-field__input');
        const input = fixture.debugElement.query(By.directive(MdcTextFieldInputDirective))?.injector.get(MdcTextFieldInputDirective);
        testComponent.value = value;
        fixture.detectChanges(); flush();
        expect(element.value).toBe(value || '');
        expect(input.value).toBe(value || '');
        expect(testComponent.value).toBe(value);

        checkFloating(fixture, value != null && value.length > 0);
    }

    function typeAndCheck(fixture: ComponentFixture<TestComponent>, value: string) {
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const element = fixture.nativeElement.querySelector('.mdc-text-field__input');
        const input = fixture.debugElement.query(By.directive(MdcTextFieldInputDirective))?.injector.get(MdcTextFieldInputDirective);
        element.value = value;
        element.dispatchEvent(new Event('focus'));
        element.dispatchEvent(new Event('input'));
        element.dispatchEvent(new Event('blur')); // focus/blur events triggered for testing label float depending on value after blur
        tick(); fixture.detectChanges();
        expect(element.value).toBe(value);
        expect(input.value).toBe(value);
        expect(testComponent.value).toBe(value);

        checkFloating(fixture, value != null && value.length > 0);
    }

    @Component({
        template: `
          <label mdcTextField>
            <input mdcTextFieldInput type="text" [(ngModel)]="value" [disabled]="disabled">
            <span *ngIf="outlined" mdcNotchedOutline>
              <span mdcNotchedOutlineNotch>
                <span mdcFloatingLabel>Floating Label</span>
              </span>
            </span>
            <span *ngIf="!outlined" mdcFloatingLabel>Floating Label</span>
          </label>
        `
    })
    class TestComponent {
        value: any = null;
        outlined: any = null;
        disabled: any = null;
    }

    function setup(compType: Type<any> = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [
                MdcTextFieldDirective, MdcTextFieldInputDirective, MdcTextFieldIconDirective,
                MdcTextFieldHelperLineDirective, MdcTextFieldHelperTextDirective,
                MdcFloatingLabelDirective,
                MdcNotchedOutlineNotchDirective, MdcNotchedOutlineDirective,
                compType]
        }).createComponent(compType);
        fixture.detectChanges(); flush();
        const testComponent = fixture.debugElement.injector.get(compType);
        const input = fixture.debugElement.query(By.directive(MdcTextFieldInputDirective))?.injector.get(MdcTextFieldInputDirective);
        const element = fixture.nativeElement.querySelector('.mdc-text-field__input');
        return { fixture, testComponent, input, element };
    }
});

function checkFloating(fixture: ComponentFixture<any>, expected: boolean) {
    // when not empty, the label must be floating:
    const floatingLabelElm = fixture.nativeElement.querySelector('.mdc-floating-label');
    if (floatingLabelElm) {
        if (expected)
            expect(floatingLabelElm.classList).toContain('mdc-floating-label--float-above');
        else
            expect(floatingLabelElm.classList).not.toContain('mdc-floating-label--float-above');
    }
}
