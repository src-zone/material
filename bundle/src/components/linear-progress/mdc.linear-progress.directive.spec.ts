import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MdcLinearProgressDirective } from './mdc.linear-progress.directive';

describe('mdcLinearProgress', () => {
    @Component({
        template: `
        <div mdcLinearProgress [progressValue]="progress" [bufferValue]="buffer"
            [indeterminate]="indeterminate" [reversed]="reversed" [closed]="closed" label="My Progress"></div>
        `
    })
    class TestComponent {
        progress = 0;
        buffer = 0;
        closed = false;
        indeterminate = false;
        reversed = false;
    }

    function setup() {
        const fixture = TestBed.configureTestingModule({
            declarations: [MdcLinearProgressDirective, TestComponent]
        }).createComponent(TestComponent);
        fixture.detectChanges(); tick();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const linearProgress = fixture.debugElement.query(By.directive(MdcLinearProgressDirective)).injector.get(MdcLinearProgressDirective);
        const element = fixture.nativeElement.querySelector('.mdc-linear-progress');
        return { fixture, linearProgress, element, testComponent };
    }

    it('should render with default values, styles, and attributes', fakeAsync(() => {
        const { element } = setup();
        expect(element).toBeDefined();
        expect(element.classList).not.toContain('mdc-linear-progress--indeterminate');
        expect(element.getAttribute('role')).toBe('progressbar');
        expect(element.getAttribute('aria-valuemin')).toBe('0');
        expect(element.getAttribute('aria-valuemax')).toBe('1');
        expect(element.getAttribute('aria-valuenow')).toBe('0');
        expect(element.getAttribute('aria-label')).toBe('My Progress');
    }));

    it('should show buffer and progress changes', fakeAsync(() => {
        const { fixture, element, testComponent } = setup();
        const primaryBar = fixture.nativeElement.querySelector('.mdc-linear-progress__primary-bar');
        const buffer = fixture.nativeElement.querySelector('.mdc-linear-progress__buffer');

        expect(element.getAttribute('aria-valuenow')).toBe('0');
        expect(primaryBar.style.transform).toBe('scaleX(0)');
        expect(buffer.style.transform).toBe('scaleX(0)');
        testComponent.progress = 0.2;
        testComponent.buffer = 0.9;
        fixture.detectChanges(); tick();
        expect(element.getAttribute('aria-valuenow')).toBe('0.2');
        expect(primaryBar.style.transform).toBe('scaleX(0.2)');
        expect(buffer.style.transform).toBe('scaleX(0.9)');
    }));

    it('can be shown reversed', fakeAsync(() => {
        const { fixture, element, testComponent } = setup();

        expect(element.classList).not.toContain('mdc-linear-progress--reversed');
        testComponent.progress = 0.3;
        testComponent.buffer = 0.6;
        testComponent.reversed = true;
        fixture.detectChanges(); tick();
        expect(element.classList).toContain('mdc-linear-progress--reversed');
        expect(element.getAttribute('aria-valuenow')).toBe('0.3');

        testComponent.reversed = false;
        fixture.detectChanges(); tick();
        expect(element.classList).not.toContain('mdc-linear-progress--reversed');
    }));

    it('can be indeterminate', fakeAsync(() => {
        const { fixture, element, testComponent } = setup();
        const primaryBar = fixture.nativeElement.querySelector('.mdc-linear-progress__primary-bar');
        const buffer = fixture.nativeElement.querySelector('.mdc-linear-progress__buffer');

        expect(element.classList).not.toContain('mdc-linear-progress--indeterminate');
        testComponent.progress = 0.3;
        testComponent.buffer = 0.6;
        testComponent.indeterminate = true;
        fixture.detectChanges(); tick();
        expect(element.classList).toContain('mdc-linear-progress--indeterminate');
        expect(element.getAttribute('aria-valuenow')).toBeNull();
        expect(primaryBar.style.transform).toBe('scaleX(1)');
        expect(buffer.style.transform).toBe('scaleX(1)');

        testComponent.indeterminate = false;
        fixture.detectChanges(); tick();
        expect(element.classList).not.toContain('mdc-linear-progress--indeterminate');
        expect(element.getAttribute('aria-valuenow')).toBe('0.3');
        expect(primaryBar.style.transform).toBe('scaleX(0.3)');
        expect(buffer.style.transform).toBe('scaleX(0.6)');
    }));

    it('can be closed', fakeAsync(() => {
        const { fixture, element, testComponent } = setup();
        const primaryBar = fixture.nativeElement.querySelector('.mdc-linear-progress__primary-bar');
        const buffer = fixture.nativeElement.querySelector('.mdc-linear-progress__buffer');

        expect(element.classList).not.toContain('mdc-linear-progress--indeterminate');
        testComponent.progress = 0.3;
        testComponent.buffer = 0.6;
        testComponent.closed = true;
        fixture.detectChanges(); tick();
        expect(element.classList).toContain('mdc-linear-progress--closed');
        expect(element.getAttribute('aria-valuenow')).toBe('0.3');
        expect(primaryBar.style.transform).toBe('scaleX(0.3)');
        expect(buffer.style.transform).toBe('scaleX(0.6)');
        // TODO-UPSTREAM: shouldn't this be aria-hidden?

        testComponent.closed = false;
        fixture.detectChanges(); tick();
        expect(element.classList).not.toContain('mdc-linear-progress--closed');
        expect(element.getAttribute('aria-valuenow')).toBe('0.3');
    }));
});
