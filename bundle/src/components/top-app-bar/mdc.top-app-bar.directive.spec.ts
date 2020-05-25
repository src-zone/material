import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ICON_BUTTON_DIRECTIVES } from '../icon-button/mdc.icon-button.directive';
import { TOP_APP_BAR_DIRECTIVES, MdcTopAppBarDirective } from './mdc.top-app-bar.directive';

const template = `
<header [mdcTopAppBar]="type" [collapsed]="collapsed" [prominent]="prominent" [dense]="dense" [fixedAdjust]="fixedAdjust">
  <div mdcTopAppBarRow>
    <section mdcTopAppBarSection alignStart>
      <button mdcIconButton mdcTopAppBarNavIcon class="material-icons">menu</button>
      <span mdcTopAppBarTitle>Title</span>
    </section>
    <section mdcTopAppBarSection alignEnd role="toolbar">
      <button *ngFor="let item of actionItems" mdcTopAppBarAction mdcIconButton class="material-icons" [label]="item.label">{{item.icon}}</button>
    </section>
  </div>
</header>
<main #fixedAdjust>
  <p *ngFor="let p of [1,2,3,4,5,6,7,8,9,10]"> 
    <span *ngFor="let s of [1,2,3,4,5,6,7,8,9,10]">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </span>
  </p>
</main>
`;

describe('MdcTopAppBarDirective', () => {
    @Component({
        template: template
    })
    class TestComponent {
        type: string;
        prominent = false;
        dense = false;
        collapsed: boolean;
        actionItems = [
            {label: 'Download', icon: 'file_download'},
            {label: 'Print this page', icon: 'print'},
            {label: 'Bookmark this page', icon: 'bookmark'},
        ]
    }

    function setup(testComponentType: any = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...ICON_BUTTON_DIRECTIVES, ...TOP_APP_BAR_DIRECTIVES, testComponentType]
        }).createComponent(testComponentType);
        fixture.detectChanges();
        return { fixture };
    }

    it('should apply correct style classes to all elements', (() => {
        const { fixture } = setup();
        expect(fixture.nativeElement.querySelectorAll('header.mdc-top-app-bar').length).toBe(1);
        expect(fixture.nativeElement.querySelectorAll('div.mdc-top-app-bar__row').length).toBe(1);
        expect(fixture.nativeElement.querySelectorAll('section.mdc-top-app-bar__section').length).toBe(2);
        expect(fixture.nativeElement.querySelectorAll('section.mdc-top-app-bar__section--align-start').length).toBe(1);
        expect(fixture.nativeElement.querySelectorAll('section.mdc-top-app-bar__section--align-end').length).toBe(1);

        expect(fixture.nativeElement.querySelector('main').className).toBe('mdc-top-app-bar--fixed-adjust');

        const bar = fixture.debugElement.query(By.directive(MdcTopAppBarDirective)).injector.get(MdcTopAppBarDirective);
        expect(bar.viewport).toBeUndefined();
        expect(bar.fixedAdjust).toBeDefined();
        expect(bar.mdcTopAppBar).toBe('default');
    }));

    it('short app bars should change their width based on the scroll position', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const header: HTMLElement = fixture.nativeElement.querySelector('header.mdc-top-app-bar');
        const spans: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('span');

        expect(header.classList.contains('mdc-top-app-bar--short')).toBe(false);
        expect(header.classList.contains('mdc-top-app-bar--short-collapsed')).toBe(false);
        testComponent.type = 'short';
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--short')).toBe(true);
        expect(header.classList.contains('mdc-top-app-bar--short-collapsed')).toBe(false);
        spans.item(spans.length - 1).scrollIntoView();
        window.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--short')).toBe(true);
        expect(header.classList.contains('mdc-top-app-bar--short-collapsed')).toBe(true);

        window.scrollTo(0,0);
    }));

    it('short app bars collpased state can be overridden with collapsed property', (() => {
        const { fixture } = setup();
        const header: HTMLElement = fixture.nativeElement.querySelector('header.mdc-top-app-bar');
        const spans: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('main span');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.type = 'short';
        fixture.detectChanges();

        spans.item(spans.length - 1).scrollIntoView();
        window.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--short-collapsed')).toBe(true);

        testComponent.collapsed = false;
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--short-collapsed')).toBe(false);

        window.scrollTo(0,0);
        window.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--short-collapsed')).toBe(false);

        testComponent.collapsed = false;
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--short-collapsed')).toBe(false);

        testComponent.collapsed = true;
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--short-collapsed')).toBe(true);
        
        testComponent.collapsed = null;
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--short-collapsed')).toBe(false);

        window.scrollTo(0,0);
    }));

    it('short app bars have the mdc-top-app-bar--short-has-action-item class when there are action items', (() => {
        const { fixture } = setup();
        const header: HTMLElement = fixture.nativeElement.querySelector('header.mdc-top-app-bar');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.type = 'short';
        fixture.detectChanges();

        expect(header.classList.contains('mdc-top-app-bar--short-has-action-item')).toBe(true);

        const prevActionItems = testComponent.actionItems;
        testComponent.actionItems = [];
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--short-has-action-item')).toBe(false);

        testComponent.actionItems = prevActionItems;
        testComponent.type = 'default';
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--short-has-action-item')).toBe(false);
    }));

    it('fixed top-app-bars', (() => {
        const { fixture } = setup();
        const header: HTMLElement = fixture.nativeElement.querySelector('header.mdc-top-app-bar');
        const spans: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('main span');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        expect(header.classList.contains('mdc-top-app-bar--fixed')).toBe(false);

        testComponent.type = 'fixed';
        window.scrollTo(0,0);
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--fixed')).toBe(true);
        expect(header.classList.contains('mdc-top-app-bar--fixed-scrolled')).toBe(false);
        expect(fixture.nativeElement.querySelector('main').className).toBe('mdc-top-app-bar--fixed-adjust');

        spans.item(spans.length - 1).scrollIntoView();
        window.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--fixed-scrolled')).toBe(true);

        window.scrollTo(0,0);
    }));

    it('prominent top-app-bars', (() => {
        const { fixture } = setup();
        const header: HTMLElement = fixture.nativeElement.querySelector('header.mdc-top-app-bar');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        expect(header.classList.contains('mdc-top-app-bar--prominent')).toBe(false);

        testComponent.prominent = true;
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--prominent')).toBe(true);
        expect(fixture.nativeElement.querySelector('main').className).toBe('mdc-top-app-bar--prominent-fixed-adjust');

        testComponent.dense = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('main').className).toBe('mdc-top-app-bar--dense-prominent-fixed-adjust');
    }));

    it('dense top-app-bars', (() => {
        const { fixture } = setup();
        const header: HTMLElement = fixture.nativeElement.querySelector('header.mdc-top-app-bar');
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        expect(header.classList.contains('mdc-top-app-bar--dense')).toBe(false);

        testComponent.dense = true;
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--dense')).toBe(true);
        expect(fixture.nativeElement.querySelector('main').className).toBe('mdc-top-app-bar--dense-fixed-adjust');
    }));

    @Component({
        template: `<div id="viewport" #viewport
            style="position: relative; margin: 0 auto; width:50%; height: 350px; padding: 50px; overflow-y: auto">
          <header mdcTopAppBar="short" [viewport]="viewport" [fixedAdjust]="fixedAdjust">
            <div mdcTopAppBarRow>
              <section mdcTopAppBarSection alignStart>
                <button mdcIconButton mdcTopAppBarNavIcon class="material-icons">menu</button>
                <span mdcTopAppBarTitle>Title</span>
              </section>
              <section mdcTopAppBarSection alignEnd role="toolbar">
                <button mdcIconButton *ngFor="let item of actionItems" mdcTopAppBarAction class="material-icons" [label]="item.label">{{item.icon}}</button>
              </section>
            </div>
          </header>
          <main #fixedAdjust>
            <p *ngFor="let p of [1,2,3,4,5,6,7,8,9,10]"> 
              <span *ngFor="let s of [1,2,3,4,5,6,7,8,9,10]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </span>
            </p>
          </main>
        </div>`
    })
    class TestViewportComponent {
        actionItems = [
            {label: 'Download', icon: 'file_download'}
        ]
    }
    it('top-app-bar with viewport', (() => {
        const { fixture } = setup(TestViewportComponent);
        const header: HTMLElement = fixture.nativeElement.querySelector('header.mdc-top-app-bar');
        const viewport = fixture.nativeElement.querySelector('#viewport');
        const spans: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('main span');
        expect(header.classList.contains('mdc-top-app-bar')).toBe(true);
        expect(header.style.position).toBe('absolute');
        expect(header.getBoundingClientRect().width).toBeLessThan(window.innerWidth / 4 * 3);

        spans.item(spans.length - 1).scrollIntoView();
        viewport.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        expect(header.classList.contains('mdc-top-app-bar--short-collapsed')).toBe(true);
    }));
});
