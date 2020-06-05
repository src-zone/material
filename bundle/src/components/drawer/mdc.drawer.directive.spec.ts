import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FOCUS_TRAP_DIRECTIVES } from '../focus-trap/mdc.focus-trap.directive';
import { DRAWER_DIRECTIVES, MdcDrawerType } from './mdc.drawer.directive';
import { LIST_DIRECTIVES } from '../list/mdc.list.directive';
import { simulateKey } from '../../testutils/page.test';

const templateWithDrawer = `
<aside [mdcDrawer]="type" [(open)]="open" id=drawer
    (openChange)="notify('open', $event)"
    (afterOpened)="notify('afterOpened', true)"
    (afterClosed)="notify('afterClosed', true)"
>
  <div mdcDrawerContent>
    <nav mdcList>
      <a *ngFor="let item of items" mdcListItem href="javascript:void(0)">
        <i mdcListItemGraphic class="material-icons">{{item.icon}}</i>
        <span mdcListItemText>{{item.text}}</span>
      </a>
    </nav>
  </div>
</aside>
<div mdcDrawerScrim id="scrim"></div>
`;

describe('MdcDrawerDirective', () => {
    @Component({
        template: templateWithDrawer
    })
    class TestComponent {
        notifications = [];
        open = false;
        type: 'permanent' | 'dismissible' | 'modal' = 'permanent';
        items = [
            {icon: 'inbox', text: 'Inbox'},
            {icon: 'send', text: 'Outgoing'},
            {icon: 'drafts', text: 'Drafts'},
        ];
        notify(name: string, value: boolean) {
            let notification = {};
            notification[name] = value;
            this.notifications.push(notification);
        }
    }

    function setup(type: MdcDrawerType, open = false) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...DRAWER_DIRECTIVES, ...FOCUS_TRAP_DIRECTIVES, ...LIST_DIRECTIVES, TestComponent]
        }).createComponent(TestComponent);
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.type = type;
        testComponent.open = open;
        fixture.detectChanges();
        const drawer = fixture.nativeElement.querySelector('#drawer');
        if (open)
            animationCycle(drawer);
        //const mdcDrawer = fixture.debugElement.query(By.directive(MdcDrawerDirective)).injector.get(MdcDrawerDirective);
        return { fixture, testComponent, drawer };
    }

    it('dismissible: structure', fakeAsync(() => {
        const { fixture, testComponent, drawer } = setup('dismissible');
        validateDom(drawer, {
            type: 'dismissible',
            open: false
        });

        testComponent.open = true;
        fixture.detectChanges();
        animationCycle(drawer);
        validateDom(drawer, {
            type: 'dismissible'
        });
    }));

    it('modal: structure', fakeAsync(() => {
        const { fixture, testComponent, drawer } = setup('modal');
        validateDom(drawer, {
            type: 'modal',
            open: false
        });

        testComponent.open = true;
        fixture.detectChanges();
        animationCycle(drawer);
        validateDom(drawer, {
            type: 'modal'
        });
    }));

    it('permanent: structure', fakeAsync(() => {
        const { fixture, drawer } = setup('permanent');
        fixture.detectChanges();
        validateDom(drawer, {
            type: 'permanent',
            open: true
        });
    }));

    it('close while opening is handled correctly', fakeAsync(() => {
        const { fixture, testComponent, drawer } = setup('modal', true);
        testComponent.open = false;
        animationCycle(drawer);
        // the first animationCycle completes the opening transition:
        validateDom(drawer, {
            type: 'modal',
            open: true
        });
        fixture.detectChanges();
        animationCycle(drawer);
        // the next animationCycle completes the closing transition:
        validateDom(drawer, {
            type: 'modal',
            open: false
        });
    }));

    it('modal: should trap focus to the drawer when opened', fakeAsync(() => {
        const { fixture, testComponent, drawer } = setup('modal', true);
        // when open: should have focus trap sentinels:
        expect([...fixture.nativeElement.querySelectorAll('.mdc-dom-focus-sentinel')].length).toBe(2);
        testComponent.open = false;
        fixture.detectChanges();
        animationCycle(drawer);
        // focus trap should be cleaned up:
        expect([...fixture.nativeElement.querySelectorAll('.mdc-dom-focus-sentinel')].length).toBe(0);
    }));

    it('modal: clicking scrim closes the modal', fakeAsync(() => {
        const { fixture, drawer } = setup('modal', true);
        validateDom(drawer, {type: 'modal', open: true});
        const scrim = fixture.nativeElement.querySelector('#scrim');
        scrim.click();
        animationCycle(drawer);
        validateDom(drawer, {type: 'modal', open: false});
    }));

    it('modal: ESCAPE closes the modal', fakeAsync(() => {
        const { drawer } = setup('modal', true);
        validateDom(drawer, {type: 'modal', open: true});
        simulateKey(drawer, 'Escape');
        animationCycle(drawer);
        validateDom(drawer, {type: 'modal', open: false});
    }));

    it('modal: should emit the afterOpened/afterClosed/openChange events', fakeAsync(() => {
        const { fixture, testComponent, drawer } = setup('modal', false);
        expect(testComponent.notifications).toEqual([]);
        testComponent.open = true;
        fixture.detectChanges(); animationCycle(drawer);
        expect(testComponent.notifications).toEqual([
            {open: true},
            {afterOpened: true}
        ]);
        testComponent.notifications = [];
        testComponent.open = false;
        fixture.detectChanges(); animationCycle(drawer);
        expect(testComponent.notifications).toEqual([
            {open: false},
            {afterClosed: true}
        ]);
    }));

    it('dismissible: should emit the afterOpened/afterClosed/openChange events', fakeAsync(() => {
        const { fixture, testComponent, drawer } = setup('dismissible', false);
        expect(testComponent.notifications).toEqual([]);
        testComponent.open = true;
        fixture.detectChanges(); animationCycle(drawer);
        expect(testComponent.notifications).toEqual([
            {open: true},
            {afterOpened: true}
        ]);
        testComponent.notifications = [];
        testComponent.open = false;
        fixture.detectChanges(); animationCycle(drawer);
        expect(testComponent.notifications).toEqual([
            {open: false},
            {afterClosed: true}
        ]);
    }));

    function validateDom(drawer, options: Partial<{
        type: MdcDrawerType,
        open: boolean,
        list: boolean
    }> = {}) {
        options = {...{
            type: 'permanent',
            open: true,
            list: true
        }, ...options};

        expect(drawer.classList).toContain('mdc-drawer');
        expect(drawer.classList).not.toContain('mdc-drawer--animate');
        expect(drawer.classList).not.toContain('mdc-drawer--opening');
        expect(drawer.classList).not.toContain('mdc-drawer--closing');
        switch (options.type) {
            case 'dismissible':
                expect(drawer.classList).toContain('mdc-drawer--dismissible');
                expect(drawer.classList).not.toContain('mdc-drawer--modal');
                break;
            case 'modal':
                expect(drawer.classList).toContain('mdc-drawer--modal');
                expect(drawer.classList).not.toContain('mdc-drawer--dismissible');
                break;
            default:
                expect(drawer.classList).not.toContain('mdc-drawer--modal');
                expect(drawer.classList).not.toContain('mdc-drawer--dismissible');
        }
        if (options.open && options.type !== 'permanent')
            expect(drawer.classList).toContain('mdc-drawer--open');
        else
            expect(drawer.classList).not.toContain('mdc-drawer--open');
        // when modal and open, there are focus-trap sentinel children:
        expect(drawer.children.length).toBe(options.open && options.type === 'modal' ? 3 : 1);
        const content = drawer.children[options.open && options.type === 'modal' ? 1 : 0];
        expect(content.classList).toContain('mdc-drawer__content');
        if (options.list) {
            expect(content.children.length).toBe(1);
            const list = content.children[0];
            expect(list.classList).toContain('mdc-list');
        }
    }

    function animationCycle(drawer: HTMLElement) {
        tick(20);
        if (drawer.classList.contains('mdc-drawer--dismissible') || drawer.classList.contains('mdc-drawer--modal')) {
            let event = new TransitionEvent('transitionend');
            event.initEvent('transitionend', true, true);
            drawer.dispatchEvent(event);
        }
    }

    function newKeydownEvent(key: string) {
        let event = new KeyboardEvent('keydown', {key});
        event.initEvent('keydown', true, true);
        return event;
    }
});
