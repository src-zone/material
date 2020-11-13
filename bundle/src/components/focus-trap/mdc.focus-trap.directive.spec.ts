import { Component } from '@angular/core';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FOCUS_TRAP_DIRECTIVES, MdcFocusInitialDirective, MdcFocusTrapDirective } from './mdc.focus-trap.directive';

describe('mdcFocusTrap', () => {
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
        const mdcFocusTrap = fixture.debugElement.query(By.directive(MdcFocusTrapDirective)).injector.get(MdcFocusTrapDirective);
        const anchors = [...fixture.nativeElement.querySelectorAll('a')];
        expect(anchors.length).toBe(4);
        return { fixture, mdcFocusTrap, anchors };
    }

    it('should not trap the focus when not activated', (() => {
        const { fixture } = setup();
        const sentinels = [...fixture.nativeElement.querySelectorAll('.mdc-dom-focus-sentinel')];
        expect(sentinels.length).toBe(0);
    }));

    it('should trap focus when activated', (() => {
        const { fixture, mdcFocusTrap, anchors } = setup();
        anchors[0].focus();
        let trap = mdcFocusTrap.trapFocus();
        expect(trap.active).toBe(true);

        // should have moved focus to first element:
        expect(document.activeElement).toBe(anchors[1]);
        // sentinels are added to trap the focus:
        const sentinels = [...fixture.nativeElement.querySelectorAll('.mdc-dom-focus-sentinel')];
        expect(sentinels.length).toBe(2);
        // when trying to focus before the region, the trap focuses the last element:
        sentinels[0].dispatchEvent(new Event('focus'));
        expect(document.activeElement).toBe(anchors[2]);
        // when trying to focus after the region, the trap focuses the last element:
        sentinels[1].dispatchEvent(new Event('focus'));
        expect(document.activeElement).toBe(anchors[1]);

        trap.untrap();
        expect(trap.active).toBe(false);
        // element from before tarp should have gotten focus back:
        expect(document.activeElement).toBe(anchors[0]);

    }));

    it('can not activate when a trap is already active', (() => {
        const { mdcFocusTrap } = setup();
        
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
        const { mdcFocusTrap } = setup();
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

describe('mdcFocusInitial', () => {
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
        const mdcFocusTrap = fixture.debugElement.query(By.directive(MdcFocusTrapDirective)).injector.get(MdcFocusTrapDirective);
        const anchors = fixture.nativeElement.querySelectorAll('a');
        expect(anchors.length).toBe(4);
        return { fixture, mdcFocusTrap, anchors };
    }

    it('should get focus when trap activates', fakeAsync(() => {
        const { mdcFocusTrap, anchors } = setup();

        anchors[3].focus();
        let trap = mdcFocusTrap.trapFocus();
        expect(document.activeElement).toBe(anchors[2]); // mdcFocusInitial
        trap.untrap();
        expect(document.activeElement).toBe(anchors[3]); // focus returns to previously focused element
    }));
});
