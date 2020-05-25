import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Component, Type } from '@angular/core';
import { numbers } from '@material/menu-surface';
import { MENU_SURFACE_DIRECTIVES } from './mdc.menu-surface.directive';
import { simulateKey } from '../../testutils/page.test';

describe('mdcMenuSurface', () => {
    @Component({
        template: `
            <div mdcMenuAnchor id="anchor" tabindex="0">
                <div mdcMenuSurface id="surface" [open]="open" [openFrom]="openFrom"
                  [fixed]="fixed" [hoisted]="hoisted"
                  (openChange)="notify('open', $event)"
                  (afterOpened)="notify('afterOpened', true)"
                  (afterClosed)="notify('afterClosed', true)"
                  tabindex="0"></div>
            </div>
        `,
        styles: [`
            #anchor {
                left: 150px;
                top: 150px;
                width: 80px;
                height: 20px;
                background-color: red;
            }
            #surface {
                width: 150px;
                height: 300px;
            }`
        ]
    })
    class TestComponent {
        notifications = [];
        open = null;
        openFrom = null;
        fixed = null;
        notify(name: string, value: boolean) {
            let notification = {};
            notification[name] = value;
            this.notifications.push(notification);
        }
    }

    it('open and close', fakeAsync(() => {
        const { fixture, anchor, surface, testComponent } = setup();
        expect(anchor).toBeDefined();
        expect(surface.classList).not.toContain('mdc-menu-surface--open');
        testComponent.open = true;
        animationCycle(fixture, () => expect(testComponent.notifications).toEqual([{open: true}]));
        expect(testComponent.notifications).toEqual([{open: true}, {afterOpened: true}]);
        expect(surface.classList).toContain('mdc-menu-surface--open');
        const position = surface.style['transform-origin'].split(' '); // left,bottom or left,top depending on size of window
        expect(position[0]).toBe('left');
        expect(surface.style['transform-origin']).toBe(position.join(' '));
        expect(surface.style[position[0]]).toBe('0px', position[0]);
        expect(surface.style[position[1]]).toBe('0px', position[1]);
        testComponent.notifications = [];
        testComponent.open = false;
        animationCycle(fixture, () => expect(testComponent.notifications).toEqual([{open: false}]));
        expect(testComponent.notifications).toEqual([{open: false}, {afterClosed: true}]);
        expect(surface.classList).not.toContain('mdc-menu-surface--open');

        testComponent.open = true;
        testComponent.openFrom = 'tr';
        animationCycle(fixture);
        expect(surface.classList).toContain('mdc-menu-surface--open');
        expect(surface.style['transform-origin']).toBe(position.join(' '));
        expect(surface.style[position[0]]).toBe('80px', position[0]);
        expect(surface.style[position[1]]).toBe('0px', position[1]);

        testComponent.open = false;
        animationCycle(fixture);
        expect(surface.classList).not.toContain('mdc-menu-surface--open');

        testComponent.open = true;
        testComponent.openFrom = 'br';
        animationCycle(fixture);
        expect(surface.style['transform-origin']).toBe(position.join(' '));
        expect(surface.style[position[0]]).toBe('80px', position[0]);
        expect(surface.style[position[1]]).toBe('20px', position[1]);
    }));

    it('focus restore', fakeAsync(() => {
        const { fixture, surface, anchor, testComponent } = setup();
        anchor.focus();
        expect(document.activeElement).toBe(anchor);
        testComponent.open = true;
        animationCycle(fixture);
        surface.focus();
        expect(document.activeElement).toBe(surface);
        testComponent.open = false;
        animationCycle(fixture);
        expect(document.activeElement).toBe(anchor);
    }));

    it('fixed positioning', fakeAsync(() => {
        const { fixture, surface, testComponent } = setup();
        testComponent.fixed = true;
        testComponent.open = true;
        animationCycle(fixture);
        expect(surface.classList).toContain('mdc-menu-surface--fixed');
    }));

    it('hoisted positioning', fakeAsync(() => {
        const { fixture, anchor, surface, testComponent } = setup();
        expect(anchor).toBeDefined();
        expect(surface.classList).not.toContain('mdc-menu-surface--open');
        testComponent.hoisted = true;
        testComponent.open = true;
        animationCycle(fixture);
        expect(surface.classList).toContain('mdc-menu-surface--open');
        const position = surface.style['transform-origin'].split(' '); // left,bottom or left,top depending on size of window
        expect(position[0]).toBe('left');
        expect(surface.style['transform-origin']).toBe(position.join(' '));
        expect(surface.style[position[0]]).not.toBe('0px', position[0]);
        expect(surface.style[position[1]]).not.toBe('0px', position[1]);
    }));

    it('close by outside bodyclick', fakeAsync(() => {
        const { fixture, surface, testComponent } = setup();
        testComponent.open = true;
        animationCycle(fixture);
        expect(surface.classList).toContain('mdc-menu-surface--open');

        // clicking on surface itself does nothing:
        testComponent.notifications = [];
        surface.click();
        animationCycle(fixture);
        expect(testComponent.notifications).toEqual([]);
        expect(surface.classList).toContain('mdc-menu-surface--open');

        document.body.click();
        animationCycle(fixture, () => expect(testComponent.notifications).toEqual([{open: false}]));
        expect(testComponent.notifications).toEqual([{open: false}, {afterClosed: true}]);
        expect(surface.classList).not.toContain('mdc-menu-surface--open');
    }));

    it('close by outside ESC key', fakeAsync(() => {
        const { fixture, surface, testComponent } = setup();
        testComponent.open = true;
        animationCycle(fixture);
        expect(surface.classList).toContain('mdc-menu-surface--open');

        // TAB key does nothing
        testComponent.notifications = [];
        simulateKey(surface, 'Enter');
        animationCycle(fixture);
        expect(testComponent.notifications).toEqual([]);
        expect(surface.classList).toContain('mdc-menu-surface--open');

        simulateKey(surface, 'Escape');
        animationCycle(fixture, () => expect(testComponent.notifications).toEqual([{open: false}]));
        expect(testComponent.notifications).toEqual([{open: false}, {afterClosed: true}]);
        expect(surface.classList).not.toContain('mdc-menu-surface--open');
    }));

    @Component({
        template: `<div mdcMenuSurface id="surface" [open]="open"></div>`,
        styles: [`
            #surface {
                width: 150px;
                height: 300px;
            }`
        ]
    })
    class TestWithoutAnchorComponent {
        open = null;
    }

    it('no anchor', fakeAsync(() => {
        const { fixture, surface, testComponent } = setup(TestWithoutAnchorComponent);
        expect(surface.classList).not.toContain('mdc-menu-surface--open');
        testComponent.open = true;
        animationCycle(fixture);
        expect(surface.classList).toContain('mdc-menu-surface--open');
        testComponent.open = false;
        animationCycle(fixture);
        expect(surface.classList).not.toContain('mdc-menu-surface--open');
    }));

    function setup(compType: Type<any> = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...MENU_SURFACE_DIRECTIVES, compType]
        }).createComponent(compType);
        fixture.detectChanges();
        const testComponent = fixture.debugElement.injector.get(compType);
        const anchor: HTMLElement = fixture.nativeElement.querySelector('.mdc-menu-surface--anchor');
        const surface: HTMLElement = fixture.nativeElement.querySelector('.mdc-menu-surface');
        return { fixture, anchor, surface, testComponent };
    }

    function animationCycle(fixture, checksBeforeAnimation: () => void = () => {}) {
        fixture.detectChanges();
        checksBeforeAnimation();
        tick(Math.max(numbers.TRANSITION_CLOSE_DURATION, numbers.TRANSITION_OPEN_DURATION));
        flush();
    }
});
