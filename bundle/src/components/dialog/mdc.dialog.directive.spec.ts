import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FOCUS_TRAP_DIRECTIVES } from '../focus-trap/mdc.focus-trap.directive';
import { DIALOG_DIRECTIVES, MdcDialogDirective, MdcDialogBodyDirective } from './mdc.dialog.directive';
import { MdcButtonDirective } from '../button/mdc.button.directive';
import { cancelledClick, booleanAttributeStyleTest } from '../../testutils/page.test';

const templateWithDialog = `
<button id="open" mdcButton (click)="dialog.open()">Open Dialog</button>
<aside id="dialog" #dialog="mdcDialog" mdcDialog mdcFocusTrap>
    <div id="surface" mdcDialogSurface>
        <header mdcDialogHeader>
            <h2 mdcDialogHeaderTitle>Modal Dialog</h2>
        </header>
        <section mdcDialogBody [scrollable]="scrollable">
            Dialog Body
        </section>
        <footer mdcDialogFooter>
            <button *ngIf="cancelButton" id="cancel" mdcButton mdcDialogCancel>Decline</button>
            <button *ngIf="acceptButton" id="accept" mdcButton mdcDialogAccept>Accept</button>
        </footer>
    </div>
    <div mdcDialogBackdrop></div>
</aside>
`;

describe('MdcDialogDirective', () => {
    @Component({
        template: templateWithDialog
    })
    class TestComponent {
        scrollable = false;
        cancelButton = true;
        acceptButton = true;
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            declarations: [...DIALOG_DIRECTIVES, ...FOCUS_TRAP_DIRECTIVES, MdcButtonDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('should only display the dialog when opened', (() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const dialog = fixture.nativeElement.querySelector('#dialog');
        const cancel = fixture.nativeElement.querySelector('#cancel');
        const accept = fixture.nativeElement.querySelector('#accept');
        
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(false, 'dialog must be in closed state');
        button.click();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(true, 'dialog must be in opened state');
        cancel.click();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(false, 'dialog must be in closed state');
        button.click();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(true, 'dialog must be in opened state');
        accept.click();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(false, 'dialog must be in closed state');
    }));

    it('should trap focus to the dialog when opened', (() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const dialog = fixture.nativeElement.querySelector('#dialog');
        const accept = fixture.nativeElement.querySelector('#accept');
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(false, 'dialog must be in closed state');
        button.click();
        // focusTrap is activated on animation 'transitionend', so simulate that event
        //  (as tick() and friends won't wait for it):
        fixture.nativeElement.querySelector('#surface').dispatchEvent(new TransitionEvent('transitionend', {}));
        // clicks on the button should now be cancelled:
        expect(cancelledClick(button)).toBe(true);
        // clicks on buttons inside the dialog should not be cancelled:
        expect(cancelledClick(accept)).toBe(false);
    }));

    it('should apply dialog button styling to buttons dynamically added', (() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const dialog = fixture.nativeElement.querySelector('#dialog');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.cancelButton = false;
        testComponent.acceptButton = false;
        fixture.detectChanges();

        button.click();
        expect(fixture.nativeElement.querySelector('#cancel')).toBeNull();
        testComponent.cancelButton = true;
        testComponent.acceptButton = true;
        fixture.detectChanges();
        const cancel = fixture.nativeElement.querySelector('#cancel');
        expect(cancel.classList).toContain('mdc-dialog__footer__button');
        const accept = fixture.nativeElement.querySelector('#accept');
        expect(accept.classList).toContain('mdc-dialog__footer__button');
        expect(accept.classList).toContain('mdc-dialog__footer__button--accept');
    }));

    it('should emit the accept event', (() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const mdcDialog = fixture.debugElement.query(By.directive(MdcDialogDirective)).injector.get(MdcDialogDirective);
        const accept = fixture.nativeElement.querySelector('#accept');
        button.click();
        let accepted = false;
        mdcDialog.accept.subscribe(() => { accepted = true; });
        accept.click();
        expect(accepted).toBe(true);
    }));

    it('should emit the cancel event', (() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const mdcDialog = fixture.debugElement.query(By.directive(MdcDialogDirective)).injector.get(MdcDialogDirective);
        const cancel = fixture.nativeElement.querySelector('#cancel');
        button.click();
        let canceled = false;
        mdcDialog.cancel.subscribe(() => { canceled = true; });
        cancel.click();
        expect(canceled).toBe(true);
    }));

    it('should style the body according to the scrollable property', (() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const dialog = fixture.nativeElement.querySelector('#dialog');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const mdcDialogBody = fixture.debugElement.query(By.directive(MdcDialogBodyDirective)).injector.get(MdcDialogBodyDirective);

        button.click();
        booleanAttributeStyleTest(
            fixture,
            testComponent,
            mdcDialogBody,
            'scrollable',
            'scrollable',
            'mdc-dialog__body--scrollable');
    }));
});
