import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MdcSnackbarService } from './mdc.snackbar.service';
import { numbers } from '@material/snackbar/constants';
import { simulateKey } from '../../testutils/page.test';

const template = `<div>Testing Snackbar</div>`;

describe('MdcSnackbarService', () => {
    let service: MdcSnackbarService = null;
    @Component({
        template: template
    })
    class TestComponent {
        constructor(public snackbar: MdcSnackbarService) {}
    }

    function setup(testComponentType: any = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [testComponentType]
        }).createComponent(testComponentType);
        fixture.detectChanges();
        service = fixture.debugElement.injector.get(MdcSnackbarService);
        return { fixture, service };
    }

    afterEach(() => {
        if (service) {
            service.onDestroy();
            service = null;
        }
    });

    it('not initialized before it is used', fakeAsync(() => {
        const { service } = setup(TestComponent);
        // reading the proprties does not initialize anything yet:
        expect(service.leading).toBe(false);
        expect(service.closeOnEscape).toBe(true);
        expect(document.querySelector('.mdc-snackbar')).toBeNull();
        // setting the leading property forces initialization of elements and foundation:
        service.leading = true;
        expect(document.querySelector('.mdc-snackbar')).not.toBeNull();
        // check the new values of properties:
        expect(service.leading).toBe(true);
        expect(service.closeOnEscape).toBe(true);
    }));

    it('should show and queue messages', fakeAsync(() => {
        const { service } = setup(TestComponent);
        expect(document.querySelector('.mdc-snackbar__label')).toBeNull();
        
        // show first message:
        const ref1 = service.show({
            message: 'Hello my old friend'
        });
        tick(1);
        // queue next message:
        const ref2 = service.show({
          message: 'People talking without speaking'
        });
        tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
        tick(numbers.ARIA_LIVE_DELAY_MS);
        expect(document.querySelector('.mdc-snackbar__label').textContent).toBe('Hello my old friend');
        tick(numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS - numbers.ARIA_LIVE_DELAY_MS);
        tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
        expect(document.querySelector('.mdc-snackbar').classList).toContain('mdc-snackbar--closing');
        waitForNotClass('mdc-snackbar--closing');
        expect(document.querySelector('.mdc-snackbar').classList).toContain('mdc-snackbar--opening');
        tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS + numbers.ARIA_LIVE_DELAY_MS);
        expect(document.querySelector('.mdc-snackbar__label').textContent).toBe('People talking without speaking');
        flush();
    }));

    it('should send afterOpened, and afterClosed events', fakeAsync(() => {
        const { service } = setup(TestComponent);
        expect(document.querySelector('.mdc-snackbar__label')).toBeNull();
        const ref = service.show({
            message: 'Hello my old friend'
        });
        let events = [];
        ref.afterOpened().subscribe(() => events.push('afterOpened'));
        ref.afterClosed().subscribe(reason => events.push('afterClosed#' + reason));
        ref.action().subscribe(() => events.push('action'));
        tick(1);

        expect(events).toEqual([]);
        tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
        waitForNotClass('mdc-snackbar--opening');
        expect(events).toEqual(['afterOpened']);
        tick(numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS);
        tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
        waitForNotClass('mdc-snackbar--closing');
        expect(events).toEqual(['afterOpened', 'afterClosed#dismiss']);
        flush();
    }));

    it('action click should trigger event and close snackbar', fakeAsync(() => {
        const { service } = setup(TestComponent);
        expect(document.querySelector('.mdc-snackbar__label')).toBeNull();
        const ref = service.show({
            message: 'Hello my old friend'
        });
        let events = [];
        ref.afterOpened().subscribe(() => events.push('afterOpened'));
        ref.afterClosed().subscribe(reason => events.push('afterClosed#' + reason));
        ref.action().subscribe(() => events.push('action'));
        tick(1);

        expect(events).toEqual([]);
        tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
        waitForNotClass('mdc-snackbar--opening');
        (<HTMLElement>document.querySelector('.mdc-snackbar__action')).click();
        expect(events).toEqual(['afterOpened', 'action']);
        tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
        waitForNotClass('mdc-snackbar--closing');
        expect(events).toEqual(['afterOpened', 'action', 'afterClosed#action']);
        flush();
    }));

    it('escape button only closes when closeOnEscape is true (default)', fakeAsync(() => {
        const { service } = setup(TestComponent);
        expect(document.querySelector('.mdc-snackbar__label')).toBeNull();
        
        service.show({message: 'Hello my old friend'});
        const snackbar = document.querySelector('.mdc-snackbar');
        pressEscapeAfterOpened(snackbar);
        expect(snackbar.className).not.toMatch(/.*open.*/); // closed
        flush();

        // when closeOnEscape == false, the snackbar should not be closed:
        service.closeOnEscape = false;
        service.show({message: 'Hello my old friend'});
        pressEscapeAfterOpened(snackbar);
        expect(snackbar.className).toMatch(/.*open.*/); // still open!
        flush();

    }));

    function pressEscapeAfterOpened(snackbar) {
        tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
        waitForNotClass('mdc-snackbar--opening');
        simulateKey(snackbar, 'Escape');
        tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
        waitForNotClass('mdc-snackbar--closing', 20);
    }

    function waitForNotClass(clazz: string, ms = 20) {
        // this should typically take less than 20ms, the rquestAnimationFrame time that we haven't
        // ticked yet.
        for (let i = 0; i != ms && document.querySelector('.mdc-snackbar').classList.contains(clazz); ++i)
            tick(1);
    }
});
