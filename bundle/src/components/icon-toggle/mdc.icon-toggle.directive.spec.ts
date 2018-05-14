import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MDC_EVENT_REGISTRY_PROVIDER } from '../../utils/mdc.event.registry';
import { MdcIconToggleDirective, MdcIconToggleIconDirective } from './mdc.icon-toggle.directive';
import { booleanAttributeStyleTest, hasRipple } from '../../testutils/page.test';

describe('MdcIconToggleDirective standalone', () => {
    @Component({
        template: `
            <i mdcIconToggle
                class="material-icons"
                labelOn="Remove from favorites"
                labelOff="Add to favorites"
                iconOn="favorite"
                iconOff="favorite_border"
                [disabled]="disabled"
                [(isOn)]="favorite"
                (click)="action()"></i>
        `
    })
    class TestComponent {
        disabled: any;
        favorite: any;
        action() {}
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            providers: [ MDC_EVENT_REGISTRY_PROVIDER ],
            declarations: [MdcIconToggleDirective, MdcIconToggleIconDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('should render the icon toggles with icon and ripple styles', fakeAsync(() => {
        const { fixture } = setup();
        const iconToggle = fixture.nativeElement.querySelector('i');
        expect(iconToggle.classList).toContain('mdc-icon-toggle');
        expect(hasRipple(iconToggle)).toBe(true);
    }));

    it('should read behavioral properties from inputs', fakeAsync(() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconToggleDirective)).injector.get(MdcIconToggleDirective);
        expect(iconToggle.iconIsClass).toBeFalsy();
        expect(iconToggle.labelOn).toBe('Remove from favorites');
        expect(iconToggle.labelOff).toBe('Add to favorites');
        expect(iconToggle.iconOn).toBe('favorite');
        expect(iconToggle.iconOff).toBe('favorite_border');
        expect(iconToggle.disabled).toBeFalsy();
    }));

    it('should change appearance when behavioral properties are changed', fakeAsync(() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconToggleDirective)).injector.get(MdcIconToggleDirective);
        
        iconToggle.labelOn = 'Do not like';
        iconToggle.labelOff = 'Like';
        iconToggle.iconOn = 'thumb_up';
        iconToggle.iconOff = 'thumb_down';
        
        fixture.detectChanges();
        tick();
        
        expect(iconToggle._elm.nativeElement.getAttribute('aria-label')).toBe('Like');
        expect(iconToggle._elm.nativeElement.textContent).toBe('thumb_down');
    }));

    it('should toggle state when clicked', fakeAsync(() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconToggleDirective)).injector.get(MdcIconToggleDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        
        expect(iconToggle.isOn).toBe(false); // initial value from 'favorite' property
        expect(testComponent.favorite).toBeFalsy(); // not yet initialized, may be undefined or false
        expect(iconToggle._elm.nativeElement.textContent).toBe('favorite_border');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-label')).toBe('Add to favorites');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-pressed')).toBe('false');
        
        iconToggle._elm.nativeElement.click(); tick(); fixture.detectChanges();
        
        expect(iconToggle.isOn).toBe(true);
        expect(testComponent.favorite).toBe(true);
        expect(iconToggle._elm.nativeElement.textContent).toBe('favorite');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-label')).toBe('Remove from favorites');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-pressed')).toBe('true');
        
        iconToggle._elm.nativeElement.click(); tick(); fixture.detectChanges();

        expect(iconToggle.isOn).toBe(false);
        expect(testComponent.favorite).toBe(false);
        expect(iconToggle._elm.nativeElement.textContent).toBe('favorite_border');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-label')).toBe('Add to favorites');
        expect(iconToggle._elm.nativeElement.getAttribute('aria-pressed')).toBe('false');
    }));
});

describe('MdcIconToggleDirective with MdcIconToggleIconDirective', () => {
    @Component({
        template: `
            <span id="icon" mdcIconToggle
                labelOn="Do not like"
                labelOff="Like"
                iconOn="fa-heart"
                iconOff="fa-heart-o"
                [disabled]="disabled"
                [(isOn)]="like">
              <i mdcIconToggleIcon class="fa"></i>
            </span>
        `
    })
    class TestComponent {
        disabled: boolean = false;
        like: boolean = true;
        action() {}
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            providers: [ MDC_EVENT_REGISTRY_PROVIDER ],
            declarations: [MdcIconToggleDirective, MdcIconToggleIconDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('should render the icon toggles with icon and ripple styles', fakeAsync(() => {
        const { fixture } = setup();
        const iconToggle = fixture.nativeElement.querySelector('span#icon');
        expect(iconToggle.classList).toContain('mdc-icon-toggle');
        expect(hasRipple(iconToggle)).toBe(true);
        const icon = iconToggle.querySelector('i.fa');
        expect(icon).toBeDefined();
        expect(icon.classList).toContain('fa-heart');
        expect(icon.classList).toContain('fa');
    }));

    it('should change appearance when behavioral properties are changed', fakeAsync(() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconToggleDirective)).injector.get(MdcIconToggleDirective);
        const icon = fixture.nativeElement.querySelector('i.fa');
        expect(icon.classList).toContain('fa-heart');
        
        iconToggle.labelOn = 'Open envelope';
        iconToggle.labelOff = 'Close envelope';
        iconToggle.iconOn = 'fa-envelope';
        iconToggle.iconOff = 'fa-envelope-open-o';
        
        fixture.detectChanges();
        tick();
        
        expect(iconToggle._elm.nativeElement.getAttribute('aria-label')).toBe('Open envelope');
        expect(icon.classList.contains('fa-heart')).toBe(false, 'actual classes: ' + icon.classList);
        expect(icon.classList).toContain('fa-envelope');
        expect(icon.classList).toContain('fa');
    }));

    it('should toggle state when clicked', fakeAsync(() => {
        const { fixture } = setup();
        const iconToggle = fixture.debugElement.query(By.directive(MdcIconToggleDirective)).injector.get(MdcIconToggleDirective);
        const icon = fixture.nativeElement.querySelector('i.fa');
        
        expect(icon.classList.contains('fa-heart')).toBe(true, icon.classList);
        expect(icon.classList.contains('fa-heart-o')).toBe(false, icon.classList);
        
        icon.click(); tick(); fixture.detectChanges();
        
        expect(icon.classList.contains('fa-heart')).toBe(false, icon.classList);
        expect(icon.classList.contains('fa-heart-o')).toBe(true, icon.classList);
        
        icon.click(); tick(); fixture.detectChanges();

        expect(icon.classList.contains('fa-heart')).toBe(true, icon.classList);
        expect(icon.classList.contains('fa-heart-o')).toBe(false, icon.classList);
    }));
});
