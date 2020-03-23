import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';
import { MdcIconButtonIconDirective, MdcIconButtonDirective, MdcIconButtonToggleDirective, MdcFormsIconButtonDirective } from './mdc.icon-button.directive';
import { booleanAttributeStyleTest, hasRipple } from '../../testutils/page.test';

describe('mdcIconButton as action button', () => {
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

        iconButton.click();
        expect(testComponent.clickCount).toBe(1);
    }));
});

describe('mdcIconButton as toggle', () => {
    @Component({
        template: `
            <button mdcIconButton
                class="material-icons"
                labelOn="Remove from favorites"
                labelOff="Add to favorites"
                iconOn="favorite"
                iconOff="favorite_border"
                [disabled]="disabled"
                [on]="favorite"
                (onChange)="changeValue($event)"
                (click)="action()"></button>
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
            declarations: [MdcIconButtonToggleDirective, testComponentType]
        }).createComponent(testComponentType);
        fixture.detectChanges();
        return { fixture };
    }

    it('should render the icon toggles with icon and ripple styles', fakeAsync(() => {
        const { fixture } = setup();
        const iconToggle = fixture.nativeElement.querySelector('button');
        expect(iconToggle.classList).toContain('mdc-icon-button');
        expect(hasRipple(iconToggle)).toBe(true);
    }));

    it('should read behavioral properties from inputs', (() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
        expect(iconToggle.iconIsClass).toBeFalsy();
        expect(iconToggle.labelOn).toBe('Remove from favorites');
        expect(iconToggle.labelOff).toBe('Add to favorites');
        expect(iconToggle.iconOn).toBe('favorite');
        expect(iconToggle.iconOff).toBe('favorite_border');
        expect(iconToggle.disabled).toBeFalsy();
    }));

    it('should change appearance when behavioral properties are changed', (() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
        
        iconToggle.labelOn = 'Do not like';
        iconToggle.labelOff = 'Like';
        iconToggle.iconOn = 'thumb_up';
        iconToggle.iconOff = 'thumb_down';
        
        fixture.detectChanges();
        
        expect(iconToggle._elm.nativeElement.getAttribute('aria-label')).toBe('Like');
        expect(iconToggle._elm.nativeElement.textContent).toBe('thumb_down');
    }));

    it('should be styled differently when disabled', (() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        expect(iconToggle.disabled).toBe(false);
        testComponent.disabled = true;
        fixture.detectChanges();
        expect(iconToggle.disabled).toBe(true);
    }));

    it('should toggle state when clicked', (() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        
        expect(iconToggle.on).toBe(false); // initial value from 'favorite' property
        expect(testComponent.favorite).toBeFalsy(); // not yet initialized, may be undefined or false
        expect(iconToggle._elm.nativeElement.textContent).toBe('favorite_border');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-label')).toBe('Add to favorites');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-pressed')).toBe('false');
        
        iconToggle._elm.nativeElement.click();
        fixture.detectChanges();
        
        expect(iconToggle.on).toBe(true);
        expect(testComponent.favorite).toBe(true);
        expect(iconToggle._elm.nativeElement.textContent).toBe('favorite');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-label')).toBe('Remove from favorites');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-pressed')).toBe('true');
        
        iconToggle._elm.nativeElement.click();
        fixture.detectChanges();

        expect(iconToggle.on).toBe(false);
        expect(testComponent.favorite).toBe(false);
        expect(iconToggle._elm.nativeElement.textContent).toBe('favorite_border');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-label')).toBe('Add to favorites');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-pressed')).toBe('false');
    }));

    it('value changes must be emitted via onChange', (() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
                
        iconToggle._elm.nativeElement.click(); fixture.detectChanges();
        expect(testComponent.changes).toEqual([true]);
        iconToggle._elm.nativeElement.click(); fixture.detectChanges();
        expect(testComponent.changes).toEqual([true, false]);
    }));

    it("programmatic changes of 'on' should not trigger 'onChange' events", (() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);

        testComponent.favorite = true; fixture.detectChanges();
        testComponent.favorite = false; fixture.detectChanges();
        testComponent.favorite = true; fixture.detectChanges();

        expect(testComponent.changes).toEqual([]);
    }));

    @Component({
        template: `
            <button mdcIconButton
                class="fa"
                labelOn="Do not like"
                labelOff="Like"
                iconOn="fa-heart"
                iconOff="fa-heart-o"
                iconIsClass>
        `
    })
    class TestIconIsClassComponent {
    }
    it("iconIsClass property", (() => {
        const { fixture } = setup(TestIconIsClassComponent);
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
        
        expect(iconToggle._elm.nativeElement.classList).toContain('fa-heart-o');
        expect(iconToggle._elm.nativeElement.textContent.trim()).toBe('');

        iconToggle.iconIsClass = true; // setting to existing value should be allowed
        // change value:
        expect(() => {iconToggle.iconIsClass = false; }).toThrowError(/iconIsClass property.*changed.*/);
    }));


    it("iconIsClass property can not be changed after initialization", (() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);

        // change value (default is undefined, so both true and false as value should be rejected after init):
        expect(() => {iconToggle.iconIsClass = false; }).toThrowError(/iconIsClass property.*changed.*/);
        expect(() => {iconToggle.iconIsClass = true; }).toThrowError(/iconIsClass property.*changed.*/);
    }));
});

describe('mdcIconButton with FormsModule', () => {
    @Component({
        template: `
            <button mdcIconButton #ngModel="ngModel"
                class="material-icons"
                labelOn="Remove from favorites"
                labelOff="Add to favorites"
                iconOn="favorite"
                iconOff="favorite_border"
                [disabled]="disabled"
                [ngModel]="favorite"
                (ngModelChange)="changeValue($event)"
                (click)="action()"></button>
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
            declarations: [MdcIconButtonToggleDirective, MdcFormsIconButtonDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('value changes must be emitted via ngModelChange', (() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
                
        iconToggle._elm.nativeElement.click(); fixture.detectChanges();
        expect(testComponent.changes).toEqual([true]);
        
        iconToggle._elm.nativeElement.click(); fixture.detectChanges();
        expect(testComponent.changes).toEqual([true, false]);
    }));

    it("programmatic changes of 'ngModel' should not trigger 'ngModelChange' events", (() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);

        testComponent.favorite = true; fixture.detectChanges();
        testComponent.favorite = false; fixture.detectChanges();
        testComponent.favorite = true; fixture.detectChanges();

        expect(testComponent.changes).toEqual([]);
    }));

    it("the disabled property should disable the button", fakeAsync(() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
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

describe('MdcIconButton with nested MdcIconButtonIcon', () => {
    @Component({
        template: `
            <button id="icon" mdcIconButton
                labelOn="Do not like"
                labelOff="Like"
                iconOn="fa-heart"
                iconOff="fa-heart-o"
                [disabled]="disabled"
                [(on)]="like">
              <i mdcIconButtonIcon class="fa"></i>
            </button>
        `
    })
    class TestComponent {
        disabled: boolean = false;
        like: boolean = true;
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcIconButtonToggleDirective, MdcIconButtonIconDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('should render iconOn/iconOff styles on the nested element, but ripples on the button', fakeAsync(() => {
        const { fixture } = setup();
        const iconToggle = fixture.nativeElement.querySelector('button#icon');
        expect(iconToggle.classList).toContain('mdc-icon-button');
        expect(hasRipple(iconToggle)).toBe(true);
        const icon = iconToggle.querySelector('i.fa');
        expect(icon).toBeDefined();
        expect(icon.classList).toContain('fa-heart');
        expect(icon.classList).toContain('fa');
    }));

    it('should change appearance when behavioral properties are changed', (() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
        const icon = fixture.nativeElement.querySelector('i.fa');
        expect(icon.classList).toContain('fa-heart');
        
        iconToggle.labelOn = 'Open envelope';
        iconToggle.labelOff = 'Close envelope';
        iconToggle.iconOn = 'fa-envelope';
        iconToggle.iconOff = 'fa-envelope-open-o';
        
        fixture.detectChanges();
        
        expect(iconToggle._elm.nativeElement.getAttribute('aria-label')).toBe('Open envelope');
        expect(icon.classList.contains('fa-heart')).toBe(false, 'actual classes: ' + icon.classList);
        expect(icon.classList).toContain('fa-envelope');
        expect(icon.classList).toContain('fa');
    }));

    it('should toggle state when clicked', (() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconButtonToggleDirective)).injector.get(MdcIconButtonToggleDirective);
        const icon = fixture.nativeElement.querySelector('i.fa');
        
        expect(icon.classList.contains('fa-heart')).toBe(true, icon.classList);
        expect(icon.classList.contains('fa-heart-o')).toBe(false, icon.classList);
        
        icon.click(); fixture.detectChanges();
        
        expect(icon.classList.contains('fa-heart')).toBe(false, icon.classList);
        expect(icon.classList.contains('fa-heart-o')).toBe(true, icon.classList);
        
        icon.click(); fixture.detectChanges();

        expect(icon.classList.contains('fa-heart')).toBe(true, icon.classList);
        expect(icon.classList.contains('fa-heart-o')).toBe(false, icon.classList);
    }));
});
