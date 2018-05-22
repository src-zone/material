import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FOCUS_TRAP_DIRECTIVES, MdcFocusInitialDirective, MdcFocusTrapDirective } from './mdc.focus-trap.directive';
import { cancelledClick, simulateEscape } from '../../testutils/page.test';

describe('MdcFocusTrapDirective', () => {
    @Component({
        template: `
            <a id="o1" href="javascript:void(0)">outside 1</a>
            <div mdcFocusTrap>
                <a id="i1" href="javascript:void(0)">inside 1</a>
                <a id="i2" href="javascript:void(0)">inside 2</a>
            </div>
            <a id="o2" href="javascript:void(0)">outside 2</a>
        `
    })
    class TestComponent {
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            declarations: [...FOCUS_TRAP_DIRECTIVES, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('should not trap the focus when not activated', (() => {
        const { fixture } = setup();
        const anchors = fixture.nativeElement.querySelectorAll('a');
        expect(anchors.length).toBe(4);

        // check that clicks on the anchors are not cancelled:
        for (let i = 0; i != anchors.length; ++i) {
            expect(cancelledClick(anchors[i])).toBe(false);
        }
    }));

    it('should trap the focus when activated', fakeAsync(() => {
        const { fixture } = setup();
        const mdcFocusTrap = fixture.debugElement.query(By.directive(MdcFocusTrapDirective)).injector.get(MdcFocusTrapDirective);
        const anchors = fixture.nativeElement.querySelectorAll('a');
        expect(anchors.length).toBe(4);
        
        anchors[3].focus();
        let trap = mdcFocusTrap.trapFocus();
        expect(document.activeElement).toBe(anchors[1]); // first element of trap focused
        expect(cancelledClick(anchors[0])).toBe(true); // outside focus trap
        expect(cancelledClick(anchors[1])).toBe(false);
        expect(cancelledClick(anchors[2])).toBe(false);
        expect(cancelledClick(anchors[3])).toBe(true); // outside focus trap
        // none of this should have affected the trap:
        expect(trap.active).toBe(true);
        trap.untrap();
        expect(trap.active).toBe(false);
        tick(); // restoring old focus is async
        expect(document.activeElement).toBe(anchors[3]); // focus returns to previously focused element
        // no more canceling of clicks:
        expect(cancelledClick(anchors[0])).toBe(false);
        expect(cancelledClick(anchors[1])).toBe(false);
        expect(cancelledClick(anchors[2])).toBe(false);
        expect(cancelledClick(anchors[3])).toBe(false);
    }));

    it('should deactivate on outside click when untrapOnOutsideClick is set', (() => {
        const { fixture } = setup();
        const mdcFocusTrap = fixture.debugElement.query(By.directive(MdcFocusTrapDirective)).injector.get(MdcFocusTrapDirective);
        mdcFocusTrap.untrapOnOutsideClick = true;
        const anchors = fixture.nativeElement.querySelectorAll('a');
        expect(anchors.length).toBe(4);
        
        anchors[3].focus();
        let trap = mdcFocusTrap.trapFocus();
        expect(document.activeElement).toBe(anchors[1]); // first element of trap focused
        // clicks outside trap are not cancelled, but deactivate the trap:
        expect(cancelledClick(anchors[0])).toBe(false);
        expect(trap.active).toBe(false);
    }));

    it('should honor the ignoreEscape setting', (() => {
        const { fixture } = setup();
        const mdcFocusTrap = fixture.debugElement.query(By.directive(MdcFocusTrapDirective)).injector.get(MdcFocusTrapDirective);
        const anchors = fixture.nativeElement.querySelectorAll('a');

        let trap = mdcFocusTrap.trapFocus();
        expect(trap.active).toBe(true);
        simulateEscape();
        expect(trap.active).toBe(false);
        trap.untrap();

        mdcFocusTrap.ignoreEscape = true;
        trap = mdcFocusTrap.trapFocus();
        expect(trap.active).toBe(true);
        simulateEscape();
        expect(trap.active).toBe(true);
    }));

    it('should be initialized with the correct defaults', (() => {
        const { fixture } = setup();
        const mdcFocusTrap = fixture.debugElement.query(By.directive(MdcFocusTrapDirective)).injector.get(MdcFocusTrapDirective);
        expect(mdcFocusTrap.ignoreEscape).toBe(false);
        expect(mdcFocusTrap.untrapOnOutsideClick).toBe(false);
    }));

    it('stacking of traps is not yet supported', (() => {
        const { fixture } = setup();
        const mdcFocusTrap = fixture.debugElement.query(By.directive(MdcFocusTrapDirective)).injector.get(MdcFocusTrapDirective);
        
        let trap1 = mdcFocusTrap.trapFocus();
        let error: Error = null;
        try {
            mdcFocusTrap.trapFocus();
        } catch (e) {
            error = e;
        }
        expect(error).toBeTruthy();
        expect(error.message).toContain('mdcFocusTrap is already active');
        expect(trap1.active).toBe(true);
        trap1.untrap();
        
        let trap2 = mdcFocusTrap.trapFocus();
        expect(trap1.active).toBe(false);
        expect(trap2.active).toBe(true);
        trap2.untrap();

        expect(trap1.active).toBe(false);
        expect(trap2.active).toBe(false);
    }));

    let leftActiveTrap = null;
    it('should deactivate on destroy', (() => {
        const { fixture } = setup();
        const mdcFocusTrap = fixture.debugElement.query(By.directive(MdcFocusTrapDirective)).injector.get(MdcFocusTrapDirective);
        leftActiveTrap = mdcFocusTrap.trapFocus();
        expect(leftActiveTrap.active).toBe(true);
        
        // rest of the test below in afterEach!
    }));

    afterEach(() => {
        // test that onDestroy will untrap focus traps that are left in active state:
        if (leftActiveTrap != null) {
            // make sure the test component is destroyed:
            TestBed.resetTestingModule();
            expect(leftActiveTrap.active).toBe(false);
        }
    });
});

describe('MdcFocusInitialDirective', () => {
    @Component({
        template: `
            <a id="o1" href="javascript:void(0)">outside 1</a>
            <div mdcFocusTrap>
                <a id="i1" href="javascript:void(0)">inside 1</a>
                <a mdcFocusInitial id="i2" href="javascript:void(0)">inside 2</a>
            </div>
            <a id="o2" href="javascript:void(0)">outside 2</a>
        `
    })
    class TestComponent {
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcFocusTrapDirective, MdcFocusInitialDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('should get focus when trap activates', fakeAsync(() => {
        const { fixture } = setup();
        const mdcFocusTrap = fixture.debugElement.query(By.directive(MdcFocusTrapDirective)).injector.get(MdcFocusTrapDirective);
        const anchors = fixture.nativeElement.querySelectorAll('a');
        expect(anchors.length).toBe(4);
        
        anchors[3].focus();
        let trap = mdcFocusTrap.trapFocus();
        expect(document.activeElement).toBe(anchors[2]); // mdcFocusInitial
        trap.untrap();
        tick(); // restoring old focus is async
        expect(document.activeElement).toBe(anchors[3]); // focus returns to previously focused element
    }));
});
