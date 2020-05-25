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
                <div mdcMenu #menu="mdcMenu" id="surface"
                    [(open)]="open" (pick)="notify('pick', $event)">
                    <ul mdcList>
                        <li mdcListItem><span mdcListItemText>A Menu Item</span></li>
                        <li mdcListItem [disabled]="item2disabled"><span mdcListItemText>Another Menu Item</span></li>
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
        item2disabled = null;
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
        const { fixture, surface, before, trigger, list } = setup();
        before.focus();
        validateOpenBy(fixture, () => trigger.click());
        expect(document.activeElement).toBe(list);
        validateCloseBy(fixture, () => simulateKey(surface, 'Escape'));
        expect(document.activeElement).toBe(before);
    }));

    it('close with tab key does not restore focus', fakeAsync(() => {
        const { fixture, surface, list, before, trigger, testComponent } = setup();
        before.focus();
        validateOpenBy(fixture, () => trigger.click());
        expect(document.activeElement).toBe(list);
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

    it('menu list has role=menu; items have role=menuitem', fakeAsync(() => {
        const { list, items } = setup();
        expect(list.getAttribute('role')).toBe('menu');
        items.forEach(item => expect(item.getAttribute('role')).toBe('menuitem'));
    }));

    it('menu list aria attributes and tabindex', fakeAsync(() => {
        const { fixture, surface, list, trigger } = setup();
        expect(list.getAttribute('tabindex')).toBe('-1');
        expect(list.getAttribute('aria-hidden')).toBe('true');
        expect(list.getAttribute('aria-orientation')).toBe('vertical');

        validateOpenBy(fixture, () => trigger.click());
        expect(list.hasAttribute('aria-hidden')).toBeFalse();

        validateCloseBy(fixture, () => simulateKey(surface, 'Escape'));
        expect(list.getAttribute('aria-orientation')).toBe('vertical');
    }));

    it('disabled menu item', fakeAsync(() => {
        const { fixture, testComponent } = setup();
        testComponent.item2disabled = true;
        fixture.detectChanges();

        const items = [...fixture.nativeElement.querySelectorAll('li')];
        expect(items[0].classList).not.toContain('mdc-list-item--disabled');
        expect(items[0].hasAttribute('aria-disabled')).toBeFalse();
        expect(items[1].classList).toContain('mdc-list-item--disabled');
        expect(items[1].getAttribute('aria-disabled')).toBe('true');
    }));

    @Component({
        template: `
            <div mdcMenuAnchor>
                <button [mdcMenuTrigger]="menu">Open Menu</button>
                <div mdcMenu #menu="mdcMenu">
                    <ul *ngIf="firstList" mdcList id="list1">
                        <li mdcListItem><span mdcListItemText>1 - 1</span></li>
                    </ul>
                    <ul *ngIf="!firstList" mdcList id="list2">
                        <li mdcListItem><span mdcListItemText>2 - 1</span></li>
                        <li mdcListItem><span mdcListItemText>2 - 2</span></li>
                    </ul>
                </div>
            </div>
            <a href="javascript:void(0)">after</a>
        `
    })
    class TestChangeListComponent {
        firstList = true;
    }

    it('underlying list can be changed', fakeAsync(() => {
        let { fixture, list, items, trigger, testComponent } = setup(TestChangeListComponent);
        
        expect(list.id).toBe('list1');
        expect(list.getAttribute('role')).toBe('menu');
        items.forEach(item => expect(item.getAttribute('role')).toBe('menuitem'));
        expect(list.getAttribute('tabindex')).toBe('-1');

        testComponent.firstList = false;
        fixture.detectChanges(); tick(); fixture.detectChanges();

        list = fixture.nativeElement.querySelector('ul');
        items = [...fixture.nativeElement.querySelectorAll('li')];
        expect(list.id).toBe('list2');
        expect(list.getAttribute('role')).toBe('menu');
        items.forEach(item => expect(item.getAttribute('role')).toBe('menuitem'));
        expect(list.getAttribute('tabindex')).toBe('-1');

        validateOpenBy(fixture, () => trigger.click(), TestChangeListComponent);
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
        const { surface } = getElements(fixture, compType);
        doClose();
        animationCycle(fixture);
        expect(surface.classList).not.toContain('mdc-menu-surface--open');
    }
    
    function setup(compType: Type<any> = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...LIST_DIRECTIVES, ...MENU_SURFACE_DIRECTIVES, ...MENU_DIRECTIVES, ...LIST_DIRECTIVES, compType]
        }).createComponent(compType);
        fixture.detectChanges(); tick(); fixture.detectChanges();
        return getElements(fixture, compType);
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
        const items: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('li')];
        return { fixture, anchor, surface, trigger, list, testComponent, menuDirective, before, after, items };
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

describe('mdcMenuTrigger', () => {    
    @Component({
        template: `
            <div mdcMenuAnchor>
                <a href="javascript:void(0)" id="trigger1" [mdcMenuTrigger]="menu1">Open Menu1</a>
                <div mdcMenu #menu1="mdcMenu" id="surface1"
                    [(open)]="open[0]">
                    <ul mdcList>
                        <li mdcListItem><span mdcListItemText>A Menu Item</span></li>
                        <li mdcListItem><span mdcListItemText>Another Menu Item</span></li>
                    </ul>
                </div>
            </div>
            <div mdcMenuAnchor>
                <button [mdcMenuTrigger]="menu2">Open Menu2</button>
                <div mdcMenu #menu2="mdcMenu" [(open)]="open[1]">
                    <ul mdcList>
                        <li mdcListItem><span mdcListItemText>A Menu Item</span></li>
                        <li mdcListItem><span mdcListItemText>Another Menu Item</span></li>
                    </ul>
                </div>
            </div>
            <button [mdcMenuTrigger]="">Whatever</button>
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
        open = [false, false, false];
    }

    it('accessibility attributes mdcMenuTrigger', fakeAsync(() => {
        const { fixture, triggers, surfaces } = setup();
        // anchor element as menuTrigger; template assigned id:
        expect(surfaces[0].id).toBe('surface1');
        expect(triggers[0].getAttribute('role')).toBe('button');
        expect(triggers[0].getAttribute('aria-haspopup')).toBe('menu');
        expect(triggers[0].getAttribute('aria-controls')).toBe('surface1');
        expect(triggers[0].hasAttribute('aria-expanded')).toBeFalse();
        // button as menuTrigger, unique id assigned by menu:
        expect(surfaces[1].id).toMatch(/mdc-menu-.*/);
        expect(triggers[1].hasAttribute('role')).toBeFalse();
        expect(triggers[1].getAttribute('aria-haspopup')).toBe('menu');
        expect(triggers[1].getAttribute('aria-controls')).toBe(surfaces[1].id);
        expect(triggers[1].hasAttribute('aria-expanded')).toBeFalse();
        // not attached to a menu:
        expect(triggers[2].hasAttribute('role')).toBeFalse();
        expect(triggers[2].hasAttribute('aria-haspopup')).toBeFalse();
        expect(triggers[2].hasAttribute('aria-controls')).toBeFalse();
        expect(triggers[2].hasAttribute('aria-expanded')).toBeFalse();

        // open:
        triggers[0].click();
        animationCycle(fixture);
        expect(triggers[0].getAttribute('aria-expanded')).toBe('true');

        // close:
        simulateKey(surfaces[0], 'Escape');
        animationCycle(fixture);
        expect(triggers[0].hasAttribute('aria-expanded')).toBeFalse();
    }));

    function setup(compType: Type<any> = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...LIST_DIRECTIVES, ...MENU_SURFACE_DIRECTIVES, ...MENU_DIRECTIVES, ...LIST_DIRECTIVES, compType]
        }).createComponent(compType);
        fixture.detectChanges();
        return getElements(fixture);
    }

    function getElements(fixture, compType: Type<any> = TestComponent) {
        const testComponent = fixture.debugElement.injector.get(compType);
        const surfaces: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-menu-surface')];
        const triggers: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('a,button')];
        return { fixture, surfaces, triggers, testComponent };
    }
});

function animationCycle(fixture) {
    fixture.detectChanges(); tick(300); flush();
}

