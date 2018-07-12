import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MdcFabDirective, MdcFabIconDirective } from './mdc.fab.directive';
import { booleanAttributeStyleTest, hasRipple } from '../../testutils/page.test';

describe('MdcFabDirective', () => {
    @Component({
        template: `
          <button mdcFab [mini]="mini" [exited]="exited" [extended]="extended">
            <span mdcFabIcon class="material-icons">favorite_border</span>
            <span *ngIf="extended" mdcFabLabel>Like</span>
          </button>
        `
    })
    class TestComponent {
        mini: any = null;
        exited: any = null;
        extended: any = null;
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcFabDirective, MdcFabIconDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('should render the FAB', (() => {
        const { fixture } = setup();
        const buttons = fixture.nativeElement.querySelectorAll('button');
        expect(buttons.length).toBe(1);
    }));

    it('should have FAB and ripple styling', fakeAsync(() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('button');
        expect(button.classList).toContain('mdc-fab');
        expect(hasRipple(button)).toBe(true, 'floating action buttons should attach a ripple by default');
    }));

    it('should style according to the value of the mini property', (() => {
        const { fixture } = setup();
        testStyle(fixture, 'mini', 'mdc-fab--mini');
    }));

    it('should style according to the value of the exited property', (() => {
        const { fixture } = setup();
        testStyle(fixture, 'exited', 'mdc-fab--exited');
    }));

    it('should style according to the value of the extended property', (() => {
        const { fixture } = setup();
        testStyle(fixture, 'extended', 'mdc-fab--extended');
    }));

    const testStyle = (fixture: ComponentFixture<TestComponent>, property: string, style: string) => {
        const fab = fixture.debugElement.query(By.directive(MdcFabDirective)).injector.get(MdcFabDirective);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        // initial the styles are not set:
        expect(fab[property]).toBe(false);
        expect(fab._elm.nativeElement.classList.contains(style)).toBe(false);
        // test various ways to set the property value, and the result of having the class or not:
        booleanAttributeStyleTest(fixture, testComponent, fab, property, property, style);
    }
});
