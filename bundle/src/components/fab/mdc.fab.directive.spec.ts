import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MdcFabDirective, MdcFabIconDirective, MdcFabLabelDirective } from './mdc.fab.directive';
import { testStyle, hasRipple } from '../../testutils/page.test';
import { asBoolean } from '../../utils/value.utils';

describe('MdcFabDirective', () => {
    @Component({
        template: `
          <button mdcFab [mini]="mini" [exited]="exited">
            <span mdcFabIcon class="material-icons">favorite_border</span>
            <span *ngIf="extended" mdcFabLabel>Like</span>
          </button>
        `
    })
    class TestComponent {
        mini: any = null;
        exited: any = null;
        _extended = false;
        get extended() {
            return this._extended;
        }
        set extended(value: any) {
            this._extended = asBoolean(value);
        }
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcFabDirective, MdcFabLabelDirective, MdcFabIconDirective, TestComponent]
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
        testStyle(fixture, 'mini', 'mini', 'mdc-fab--mini', MdcFabDirective, TestComponent);
    }));

    it('should style according to the value of the exited property', (() => {
        const { fixture } = setup();
        testStyle(fixture, 'exited', 'exited', 'mdc-fab--exited', MdcFabDirective, TestComponent);
    }));

    it('should set extended styling for fabs with labels', fakeAsync(() => {
        const { fixture } = setup();
        testStyle(fixture, 'extended', 'extended', 'mdc-fab--extended', MdcFabDirective, TestComponent);
    }));
});
