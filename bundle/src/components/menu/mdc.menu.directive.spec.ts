import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Component, Type } from '@angular/core';
import { DefaultFocusState } from '@material/menu';
import { LIST_DIRECTIVES } from '../list/mdc.list.directive';
import { MENU_SURFACE_DIRECTIVES } from '../menu-surface/mdc.menu-surface.directive';
import { MENU_DIRECTIVES, MdcMenuDirective } from '../menu/mdc.menu.directive';
import { simulateKey } from '../../testutils/page.test';
import { By } from '@angular/platform-browser';

describe('mdcMenu', () => {
    @Component({
        template: `
            <a href="javascript:void(0)">before</a>
            <div id="anchor" mdcMenuAnchor>
                <button id="trigger" [mdcMenuTrigger]="menu">Open Menu</button>
                <div mdcMenu mdcMenuSurface #menu="mdcMenu" id="surface"
                    [(open)]="open" (pick)="notify('pick', $event)">
                    <ul mdcList>
                        <li mdcListItem><span mdcListItemText>A Menu Item</span></li>
                        <li mdcListItem><span mdcListItemText>Another Menu Item</span></li>
                    </ul>
                </div>
            </div>
            <a href="javascript:void(0)">after</a>
        `,
        styles: [`
            #anchor {
                left: 150px;
                top: 150px;
                width: 80px;
                height: 20px;
            }`
        ]
    })
    class TestComponent {
        notifications = [];
        open = null;
        openFrom = null;
        fixed = null;
        notify(name: string, value: any) {
            let notification = {};
            notification[name] = value;
            this.notifications.push(notification);
        }
    }

    it('open with ArrowDown', fakeAsync(() => {
        const { fixture, trigger } = setup();
        validateOpenBy(fixture, () => {
            simulateKey(trigger, 'ArrowDown');
        });
        expect(document.activeElement).toBe(listElement(fixture, 0));
    }));

    it('open with ArrowUp', fakeAsync(() => {
        const { fixture, trigger } = setup();
        validateOpenBy(fixture, () => {
            simulateKey(trigger, 'ArrowUp');
        });
        expect(document.activeElement).toBe(listElement(fixture, 1));
    }));

    it('open with Enter', fakeAsync(() => {
        const { fixture, trigger } = setup();
        validateOpenBy(fixture, () => {
            simulateKey(trigger, 'Enter');
            trigger.click();
            simulateKey(trigger, 'Enter', 'keyup');
        });
        expect(document.activeElement).toBe(listElement(fixture, 0));
    }));

    it('open with Space', fakeAsync(() => {
        const { fixture, trigger } = setup();
        validateOpenBy(fixture, () => {
            simulateKey(trigger, 'Space');
            trigger.click();
            simulateKey(trigger, 'Space', 'keyup');
        });
        expect(document.activeElement).toBe(listElement(fixture, 0));
    }));

    it('open with click', fakeAsync(() => {
        const { fixture, trigger, list } = setup();
        validateOpenBy(fixture, () => {
            trigger.click();
        });
        expect(document.activeElement).toBe(list);
    }));

    it('close restores focus', fakeAsync(() => {
        const { fixture, surface, before } = setup();
        before.focus();
        validateCloseBy(fixture, () => simulateKey(surface, 'Escape'));
        expect(document.activeElement).toBe(before);
    }));

    it('close with tab key does not restore focus', fakeAsync(() => {
        const { fixture, surface, list, before, testComponent } = setup();
        before.focus();
        validateCloseBy(fixture, () => simulateKey(surface, 'Tab'));
        // focus is unchanged from open state - (when a user presses the Tab key, focus will be changed to the next element)
        expect(document.activeElement).toBe(list);
        // no menu item picked:
        expect(testComponent.notifications).toEqual([]);
    }));

    it('close with picking a menu item restores focus', fakeAsync(() => {
        const { fixture, before, testComponent } = setup();
        before.focus();
        validateCloseBy(fixture, () => listElement(fixture, 1).click());
        expect(document.activeElement).toBe(before);
        expect(testComponent.notifications).toEqual([
            {pick: {index: 1, value: undefined}}
        ]);
    }));

    function validateOpenBy(fixture, doOpen: () => void, compType: Type<any> = TestComponent) {
        const { surface } = getElements(fixture, compType);
        expect(surface.classList).not.toContain('mdc-menu-surface--open');
        doOpen();
        animationCycle(fixture);
        expect(surface.classList).toContain('mdc-menu-surface--open');
        validateDefaultFocusState(fixture);
    }

    function validateCloseBy(fixture, doClose: () => void, compType: Type<any> = TestComponent) {
        const { surface, trigger, list } = getElements(fixture, compType);
        validateOpenBy(fixture, () => trigger.click());
        expect(document.activeElement).toBe(list);
        doClose();
        animationCycle(fixture);
        expect(surface.classList).not.toContain('mdc-menu-surface--open');
    }

    function setup(compType: Type<any> = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...LIST_DIRECTIVES, ...MENU_SURFACE_DIRECTIVES, ...MENU_DIRECTIVES, ...LIST_DIRECTIVES, compType]
        }).createComponent(compType);
        fixture.detectChanges();
        return getElements(fixture);
    }

    function getElements(fixture, compType: Type<any> = TestComponent) {
        const testComponent = fixture.debugElement.injector.get(compType);
        const menuDirective = fixture.debugElement.query(By.directive(MdcMenuDirective)).injector.get(MdcMenuDirective);
        const anchor: HTMLElement = fixture.nativeElement.querySelector('.mdc-menu-surface--anchor');
        const surface: HTMLElement = fixture.nativeElement.querySelector('.mdc-menu-surface');
        const trigger: HTMLElement = fixture.nativeElement.querySelector('button');
        const list: HTMLElement = fixture.nativeElement.querySelector('ul');
        const before: HTMLAnchorElement = fixture.nativeElement.querySelectorAll('a').item(0);
        const after: HTMLAnchorElement = fixture.nativeElement.querySelectorAll('a').item(1);
        return { fixture, anchor, surface, trigger, list, testComponent, menuDirective, before, after };
    }

    function animationCycle(fixture) {
        fixture.detectChanges(); flush(); tick(20); flush();
    }

    function listElement(fixture, index) {
        return fixture.nativeElement.querySelectorAll('li').item(index);
    }

    function validateDefaultFocusState(fixture) {
        const menuDirective = fixture.debugElement.query(By.directive(MdcMenuDirective)).injector.get(MdcMenuDirective);
        // default focus state should always NONE when not currently handling an open/close:
        expect(menuDirective['foundation']['defaultFocusState_']).toBe(DefaultFocusState.NONE);
    }
});
