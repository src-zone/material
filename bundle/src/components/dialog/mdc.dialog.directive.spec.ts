import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { numbers } from '@material/dialog';
import { FOCUS_TRAP_DIRECTIVES } from '../focus-trap/mdc.focus-trap.directive';
import { DIALOG_DIRECTIVES, MdcDialogDirective } from './mdc.dialog.directive';
import { BUTTON_DIRECTIVES } from '../button/mdc.button.directive';

const templateWithDialog = `
<button id="open" mdcButton (click)="dialog.open()">Open Dialog</button>
<div id="dialog" #dialog="mdcDialog" mdcDialog>
    <div mdcDialogContainer>
        <div id="surface" mdcDialogSurface>
            <h2 mdcDialogTitle>Modal Dialog</h2>
            <div mdcDialogContent>
                Dialog Body
                <div *ngIf="scrollable" style="height: 2000px;">&nbsp;</div>
                <input id="someInput">
                <button mdcButton id="noTrigger">no mdcDialogTrigger</button>
            </div>
            <footer mdcDialogActions>
                <button *ngIf="cancelButton" id="cancel" mdcButton mdcDialogTrigger="close">Decline</button>
                <button *ngIf="acceptButton" id="accept" mdcButton mdcDialogTrigger="accept" mdcDialogDefault>Accept</button>
            </footer>
        </div>
    </div>
    <div mdcDialogScrim></div>
</div>
`;

const tickTime = Math.max(numbers.DIALOG_ANIMATION_CLOSE_TIME_MS, numbers.DIALOG_ANIMATION_OPEN_TIME_MS);

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
            declarations: [...DIALOG_DIRECTIVES, ...FOCUS_TRAP_DIRECTIVES, ...BUTTON_DIRECTIVES, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges();
        return { fixture };
    }

    it('accessibility and structure', fakeAsync(() => {
        const { fixture } = setup();
        validateDom(fixture.nativeElement.querySelector('#dialog'));
    }));

    it('should only display the dialog when opened', fakeAsync(() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const dialog = fixture.nativeElement.querySelector('#dialog');
        const mdcDialog = fixture.debugElement.query(By.directive(MdcDialogDirective)).injector.get(MdcDialogDirective);
        const cancel = fixture.nativeElement.querySelector('#cancel');
        const accept = fixture.nativeElement.querySelector('#accept');
        
        // open/close by button:
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(false, 'dialog must be in closed state');
        button.click(); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(true, 'dialog must be in opened state');
        cancel.click(); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(false, 'dialog must be in closed state');
        button.click(); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(true, 'dialog must be in opened state');
        accept.click(); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(false, 'dialog must be in closed state');

        // open/close with function calls:
        mdcDialog.open(); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(true, 'dialog must be in opened state');
        mdcDialog.close('accept'); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(false, 'dialog must be in closed state');
    }));

    it('should trap focus to the dialog when opened', fakeAsync(() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const dialog = fixture.nativeElement.querySelector('#dialog');
        const accept = fixture.nativeElement.querySelector('#accept');
        
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(false, 'dialog must be in closed state');
        // no sentinels means no focus trapping:
        expect([...fixture.nativeElement.querySelectorAll('.mdc-dom-focus-sentinel')].length).toBe(0);

        button.click(); tick(tickTime); flush();
        // should now have focus trap sentinels:
        expect([...fixture.nativeElement.querySelectorAll('.mdc-dom-focus-sentinel')].length).toBe(2);

        accept.click(); tick(tickTime); flush();
        // focus trap should be cleaned up:
        expect([...fixture.nativeElement.querySelectorAll('.mdc-dom-focus-sentinel')].length).toBe(0);
    }));

    it('should initially focus mdcDialogDefault', fakeAsync(() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const accept = fixture.nativeElement.querySelector('#accept');
        
        button.click(); tick(tickTime); flush();
        expect(document.activeElement).toBe(accept);
    }));

    it('should apply dialog button styling to buttons dynamically added', fakeAsync(() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.cancelButton = false;
        testComponent.acceptButton = false;
        fixture.detectChanges();

        button.click(); tick(tickTime); flush();
        expect(fixture.nativeElement.querySelector('#cancel')).toBeNull();
        testComponent.cancelButton = true;
        testComponent.acceptButton = true;
        fixture.detectChanges();
        const cancel = fixture.nativeElement.querySelector('#cancel');
        expect(cancel.classList).toContain('mdc-dialog__button');
        const accept = fixture.nativeElement.querySelector('#accept');
        expect(accept.classList).toContain('mdc-dialog__button');
        expect(cancel.classList).toContain('mdc-dialog__button');
    }));

    it('should emit the accept event', fakeAsync(() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const mdcDialog = fixture.debugElement.query(By.directive(MdcDialogDirective)).injector.get(MdcDialogDirective);
        const accept = fixture.nativeElement.querySelector('#accept');
        button.click(); tick(tickTime); flush();
        let accepted = false;
        mdcDialog.accept.subscribe(() => { accepted = true; });
        accept.click(); tick(tickTime); flush();
        expect(accepted).toBe(true);
    }));

    it('should emit the cancel event', fakeAsync(() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const mdcDialog = fixture.debugElement.query(By.directive(MdcDialogDirective)).injector.get(MdcDialogDirective);
        const cancel = fixture.nativeElement.querySelector('#cancel');
        button.click(); tick(tickTime); flush();
        let canceled = false;
        mdcDialog.cancel.subscribe(() => { canceled = true; });
        cancel.click(); tick(tickTime); flush();
        expect(canceled).toBe(true);
    }));

    it('should style the body according to the scrollable property', fakeAsync(() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const dialog = fixture.nativeElement.querySelector('#dialog');
        const testComponent = fixture.debugElement.injector.get(TestComponent);

        testComponent.scrollable = true;
        fixture.detectChanges();
        button.click(); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--scrollable')).toBe(true, 'dialog content must be scrollable');
    }));

    it('button without mdcDialogTrigger should not close the dialog', fakeAsync(() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const dialog = fixture.nativeElement.querySelector('#dialog');
        const noTrigger = fixture.nativeElement.querySelector('#noTrigger');
        
        button.click(); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(true, 'dialog must be in opened state');
        noTrigger.click(); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(true, 'dialog must be in opened state');
    }));

    it('enter should trigger mdcDialogDefault', fakeAsync(() => {
        const { fixture } = setup();
        const button = fixture.nativeElement.querySelector('#open');
        const dialog = fixture.nativeElement.querySelector('#dialog');
        const mdcDialog = fixture.debugElement.query(By.directive(MdcDialogDirective)).injector.get(MdcDialogDirective);
        const input = fixture.nativeElement.querySelector('#someInput');
        let accepted = false;
        mdcDialog.accept.subscribe(() => { accepted = true; });
        
        button.click(); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(true, 'dialog must be in opened state');
        input.focus();
        expect(document.activeElement).toBe(input);
        input.dispatchEvent(newKeydownEvent('Enter')); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(false, 'dialog must be in closed state');
        expect(accepted).toBe(true);
    }));

    it('escape should trigger cancel', fakeAsync(() => {
        const { fixture } = setup();
        const dialog = fixture.nativeElement.querySelector('#dialog');
        const mdcDialog = fixture.debugElement.query(By.directive(MdcDialogDirective)).injector.get(MdcDialogDirective);
        let canceled = false;
        mdcDialog.cancel.subscribe(() => { canceled = true; });
        
        mdcDialog.open(); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(true, 'dialog must be in opened state');
        document.body.dispatchEvent(newKeydownEvent('Escape')); tick(tickTime); flush();
        expect(dialog.classList.contains('mdc-dialog--open')).toBe(false, 'dialog must be in closed state');
        expect(canceled).toBe(true);
    }));

    function validateDom(dialog) {
        expect(dialog.classList).toContain('mdc-dialog');
        expect(dialog.children.length).toBe(2);
        const container = dialog.children[0];
        const scrim = dialog.children[1];
        expect(container.classList).toContain('mdc-dialog__container');
        expect(container.children.length).toBe(1);
        const surface = container.children[0];
        expect(surface.classList).toContain('mdc-dialog__surface');
        expect(surface.getAttribute('role')).toBe('alertdialog');
        expect(surface.getAttribute('aria-modal')).toBe('true');
        const labelledBy = surface.getAttribute('aria-labelledby');
        expect(labelledBy).toMatch(/[a-zA-Z0-9_-]+/);
        const describedBy = surface.getAttribute('aria-describedby');
        expect(describedBy).toMatch(/[a-zA-Z0-9_-]+/);
        expect(surface.children.length).toBe(3);
        const title = surface.children[0];
        const content = surface.children[1];
        const footer: Element = surface.children[2];
        expect(title.classList).toContain('mdc-dialog__title');
        expect(title.id).toBe(labelledBy);
        expect(content.classList).toContain('mdc-dialog__content');
        expect(content.id).toBe(describedBy);
        expect(footer.classList).toContain('mdc-dialog__actions');
        const buttons = [].slice.call(footer.children);
        for (let button of buttons) {
            expect(button.classList).toContain('mdc-button');
            expect(button.classList).toContain('mdc-dialog__button');
        }
        expect(scrim.classList).toContain('mdc-dialog__scrim');
    }

    function newKeydownEvent(key: string) {
        let event = new KeyboardEvent('keydown', {key});
        event.initEvent('keydown', true, true);
        return event;
    }
});
