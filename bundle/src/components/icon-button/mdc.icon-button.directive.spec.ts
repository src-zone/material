import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';
import { MdcIconButtonDirective, MdcIconToggleDirective, MdcIconDirective, MdcFormsIconButtonDirective } from './mdc.icon-button.directive';
import { hasRipple } from '../../testutils/page.test';

describe('mdcIconButton', () => {
    @Component({
        template: `
            <button mdcIconButton class="material-icons" [disabled]="disabled" (click)="action()"></button>
        `
    })
    class TestComponent {
        disabled: any;
        clickCount = 0;
        action() {
            ++this.clickCount;
        }
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcIconButtonDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('should render the icon button with icon and ripple styles', fakeAsync(() => {
        const { fixture } = setup();
        const iconButton = fixture.nativeElement.querySelector('button');
        expect(iconButton.classList).toContain('mdc-icon-button');
        expect(hasRipple(iconButton)).toBe(true);
    }));

    it('should read behavioral properties from inputs', (() => {
        const { fixture } = setup();
        const iconButton = fixture.debugElement.query(By.directive(MdcIconButtonDirective)).injector.get(MdcIconButtonDirective);
        expect(iconButton.disabled).toBeFalsy();
    }));

    it('should be styled differently when disabled', (() => {
        const { fixture } = setup();
        const iconButton = fixture.nativeElement.querySelector('button');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        expect(iconButton.disabled).toBe(false);
        testComponent.disabled = true;
        fixture.detectChanges();
        expect(iconButton.disabled).toBe(true);
    }));

    it('should act on clicks', (() => {
        const { fixture } = setup();
        const iconButton = fixture.nativeElement.querySelector('button');
        const testComponent = fixture.debugElement.injector.get(TestComponent);

        expect(testComponent.clickCount).toBe(0);
        iconButton.click();
        expect(testComponent.clickCount).toBe(1);
    }));
});

describe('mdcIconToggle', () => {
    // TODO: labelOn/Off
    @Component({
        template: `
            <button mdcIconToggle (onChange)="changeValue($event)" (click)="action()" [disabled]="disabled" [on]="favorite">
                <i mdcIcon="on" class="material-icons">favorite</i>
                <i mdcIcon class="material-icons">favorite_border</i>
            </button>
        `
    })
    class TestComponent {
        disabled: any;
        favorite: any;
        changes = [];
        actions = [];
        changeValue(val: any) {
            this.changes.push(val);
            this.favorite = val;
        }
        action() {
            this.actions.push(this.favorite);
        }
    }

    function setup(testComponentType: any = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcIconToggleDirective, MdcIconDirective, testComponentType]
        }).createComponent(testComponentType);
        fixture.detectChanges();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconToggleDirective)).injector.get(MdcIconToggleDirective);
        const element = fixture.nativeElement.querySelector('.mdc-icon-button');
        const testComponent = fixture.debugElement.injector.get(testComponentType);
        return { fixture, iconToggle, element, testComponent };
    }

    it('should render the icon toggles with icon and ripple styles', fakeAsync(() => {
        const { element } = setup();
        expect(element.classList).toContain('mdc-icon-button');
        expect(hasRipple(element)).toBe(true);
    }));

    it('should be styled differently when disabled', (() => {
        const { fixture, iconToggle, testComponent } = setup();
        expect(iconToggle.disabled).toBe(false);
        testComponent.disabled = true;
        fixture.detectChanges();
        expect(iconToggle.disabled).toBe(true);
    }));

    it('should toggle state when clicked', (() => {
        const { fixture, iconToggle, testComponent, element } = setup();
        
        expect(iconToggle.on).toBe(false); // initial value from 'favorite' property
        expect(testComponent.favorite).toBeUndefined(); // not yet initialized, so undefined (coerced to false on button)
        expect(element.classList).not.toContain('mdc-icon-button--on');

        clickAndCheck(true);
        clickAndCheck(false);
        clickAndCheck(true);

        function clickAndCheck(expected) {
            element.click();
            expect(iconToggle.on).toBe(expected);
            expect(testComponent.favorite).toBe(expected);
            if (expected)
                expect(element.classList).toContain('mdc-icon-button--on');
            else
                expect(element.classList).not.toContain('mdc-icon-button--on');
        }

        // TODO check that labels change
    }));

    it('value changes must be emitted via onChange', (() => {
        const { fixture, iconToggle, testComponent } = setup();
                
        iconToggle._elm.nativeElement.click(); fixture.detectChanges();
        expect(testComponent.changes).toEqual([true]);
        iconToggle._elm.nativeElement.click(); fixture.detectChanges();
        expect(testComponent.changes).toEqual([true, false]);
    }));

    it("programmatic value changes must be emitted via onChange", (() => {
        const { fixture, testComponent } = setup();

        testComponent.favorite = true; fixture.detectChanges();
        testComponent.favorite = false; fixture.detectChanges();
        testComponent.favorite = true; fixture.detectChanges();

        expect(testComponent.changes).toEqual([true, false, true]);
    }));

    @Component({
        template: `
            <button mdcIconToggle (onChange)="changeValue($event)" (click)="action()" [disabled]="disabled" [on]="favorite">
                <i mdcIcon="on" class="fa fa-heart"></i>
                <i mdcIcon class="fa fa-heart-o"></i>
            </button>`
    })
    class TestIconIsClassComponent {
    }
    it("iconIsClass property", fakeAsync(() => {
        const { element } = setup(TestIconIsClassComponent);
        expect(element.classList).toContain('mdc-icon-button');
        expect(hasRipple(element)).toBe(true);
    }));
});

describe('mdcIconToggle with FormsModule', () => {
    @Component({
        template: `
            <button mdcIconToggle #ngModel="ngModel" [ngModel]="favorite" (ngModelChange)="changeValue($event)"
                (click)="action()" [disabled]="disabled">
                <i mdcIcon="on" class="material-icons">favorite</i>
                <i mdcIcon class="material-icons">favorite_border</i>
            </button>
        `
    })
    class TestComponent {
        @ViewChild('ngModel') ngModel: NgModel;
        favorite: any;
        disabled = false;
        changes = [];
        actions = [];
        changeValue(val: any) {
            this.changes.push(val);
            this.favorite = val;
        }
        action() {
            this.actions.push(this.favorite);
        }
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [MdcIconToggleDirective, MdcFormsIconButtonDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconToggleDirective)).injector.get(MdcIconToggleDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        return { fixture, iconToggle, testComponent };
    }

    it('value changes must be emitted via ngModelChange', (() => {
        const { fixture, iconToggle, testComponent } = setup();
                
        iconToggle._elm.nativeElement.click(); fixture.detectChanges();
        expect(testComponent.changes).toEqual([true]);
        
        iconToggle._elm.nativeElement.click(); fixture.detectChanges();
        expect(testComponent.changes).toEqual([true, false]);
    }));

    it("programmatic changes of 'ngModel don't trigger ngModelChange events", fakeAsync(() => {
        const { fixture, testComponent } = setup();

        testComponent.favorite = true; fixture.detectChanges(); flush();
        testComponent.favorite = false; fixture.detectChanges(); flush();
        testComponent.favorite = true; fixture.detectChanges(); flush();

        expect(testComponent.changes).toEqual([]);
    }));

    it("the disabled property should disable the button", fakeAsync(() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconToggleDirective)).injector.get(MdcIconToggleDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        tick();
        expect(iconToggle._elm.nativeElement.disabled).toBe(false);
        expect(testComponent.ngModel.disabled).toBe(false);
        testComponent.disabled = true;
        fixture.detectChanges();
        tick();
        expect(iconToggle._elm.nativeElement.disabled).toBe(true);
        expect(testComponent.ngModel.disabled).toBe(true);
    }));
});
