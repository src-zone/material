import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, Type } from '@angular/core';
import { LIST_DIRECTIVES } from './mdc.list.directive';
import { hasRipple } from '../../testutils/page.test';

// TODO tests for checbox/radio input controlled list items

describe('mdcList', () => {
    @Component({
        template: `
            <ul mdcList [selectionMode]="selectionMode" [nonInteractive]="nonInteractive">
                <li *ngFor="let item of items; let i = index" mdcListItem [disabled]="disabled === i"
                    (action)="action(i)" (selectedChange)="active($event, i)">
                    <span mdcListItemText>{{item}}</span>
                </li>
            </ul>
        `
    })
    class TestComponent {
        actions: number[] = [];
        selectedChange: {index: number, value: boolean}[] = [];
        items = ['item 1', 'item 2', 'item 3'];
        nonInteractive = false;
        selectionMode: string = null;
        disabled: number = null;
        action(i: number) {
            this.actions.push(i);
        }
        active(value: boolean, index: number) {
            this.selectedChange.push({index, value});
        }
    }

    it('should render the list and items with correct styles and attributes', fakeAsync(() => {
        const { list, items } = setup();
        expect(list).toBeDefined();
        expect(list.getAttribute('role')).toBeNull();
        expect(list.getAttribute('tabindex')).toBeNull();
        expect(items.length).toBe(3);
        // by default items are set to be focusable, but only the first item is tabbable (tabindex=-1):
        expectTabbable(items, 0);
        expectRoles(items, null);
        expect(items.map(it => it.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
        items.forEach(item => expect(hasRipple(item)).toBe(true));
    }));

    it('clicking an item affects tabindexes', fakeAsync(() => {
        const { fixture, items } = setup();
        
        // focus by clicking:
        focusItem(fixture, items, 1);
        expectTabbable(items, 1);

        // remove focus should restore tabindex=0 on first item:
        blurItem(fixture, items, 1);
        expectTabbable(items, 0);
    }));

    it('keyboard navigation affects tabindexes', fakeAsync(() => {
        const { fixture, items } = setup();

        // tabbing will focus the element with tabindex=0 (default first elm):
        items[0].focus();
        items[0].dispatchEvent(newFocusEvent('focusin'));
        tick(); fixture.detectChanges();
        expectTabbable(items, 0); // tabindexes on items should not have been changed
        // Down key:
        items[0].dispatchEvent(newKeydownEvent('ArrowDown'));
        tick(); fixture.detectChanges();
        expectTabbable(items, 1);
        // focusOut should make first element tabbable again:
        blurItem(fixture, items, 1);
        expectTabbable(items, 0);
    }));

    it('adding items will not change focus', fakeAsync(() => {
        const { fixture, items, testComponent } = setup();

        focusItem(fixture, items, 1);
        testComponent.items = ['new text', ...testComponent.items];
        fixture.detectChanges(); tick();
        const currentItems: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-list-item')];
        expect(currentItems.length).toBe(4);
        expectTabbable(currentItems, 2); // next item, because one was inserted before
        blurItem(fixture, currentItems, 2);
        expectTabbable(currentItems, 0);
    }));

    it('nonInteractive lists ignore interaction and are not focusable', fakeAsync(() => {
        const { fixture, items, testComponent } = setup();
        testComponent.nonInteractive = true;
        fixture.detectChanges();

        expectTabbable(items, -1); // not focusable
        focusItem(fixture, items, 1); // will not focus:
        expectTabbable(items, -1); // not focusable
        // not listening to keyboard input:
        items[0].dispatchEvent(newKeydownEvent('ArrowDown'));
        tick(); fixture.detectChanges();
        expectTabbable(items, -1);
        // no action events have been emitted:
        expect(testComponent.actions).toEqual([]);
        expect(testComponent.selectedChange).toEqual([]);
    }));

    it('disabled items are correctly styled, not actionable, and not selectable', fakeAsync(() => {
        const { fixture, items, testComponent } = setup();
        testComponent.disabled = 1;
        fixture.detectChanges(); tick();
        expectDisabled(items, 1);

        testComponent.selectionMode = 'single';
        fixture.detectChanges(); tick();
        // try to focus and activate disabled item:
        focusItem(fixture, items, 1);
        expectTabbable(items, 1); // is focusable
        expectActive(items, -1, 'selected'); // can not be activated
        // no action events have been emitted:
        expect(testComponent.actions).toEqual([]);
        expect(testComponent.selectedChange).toEqual([]);
    }));

    it('selectionMode=single/current', fakeAsync(() => {
        const { fixture, items, testComponent } = setup();
        testComponent.selectionMode = 'single';
        fixture.detectChanges(); tick();
        validateSelectionMode('selected', -1);
        testComponent.selectionMode = 'active';
        fixture.detectChanges(); tick();
        testComponent.actions.length = 0;
        testComponent.selectedChange.length = 0;
        validateSelectionMode('current', 2);

        function validateSelectionMode(type, initialActive) {
            expectActive(items, initialActive, type);

            // activate on click:
            focusItem(fixture, items, 1);
            expectTabbable(items, 1);
            expectActive(items, 1, type);
            // should also emit action event:
            expect(testComponent.actions).toEqual([1]);
            if (initialActive !== -1)
                expect(testComponent.selectedChange).toEqual([
                    {index: initialActive, value: false},
                    {index: 1, value: true}
                ]);
            else
                expect(testComponent.selectedChange).toEqual([
                    {index: 1, value: true}
                ]);
            testComponent.selectedChange.length = 0;

            // active on keyboard on input:
            items[1].dispatchEvent(newKeydownEvent('ArrowDown'));
            tick(); fixture.detectChanges();
            expectTabbable(items, 2);
            expectActive(items, 1,type);
            items[2].dispatchEvent(newKeydownEvent('Enter'));
            tick(); fixture.detectChanges();
            expectActive(items, 2, type);
            // should also emit action event:
            expect(testComponent.actions).toEqual([1, 2]);
            expect(testComponent.selectedChange).toEqual([
                {index: 1, value: false},
                {index: 2, value: true}
            ]);
        }
    }));

    @Component({
        template: `
            <div mdcListGroup>
                <h3 mdcListGroupSubHeader>Header</h3>
                <ul mdcList>
                    <li mdcListItem>
                        <span mdcListItemGraphic></span>
                        <span mdcListItemText>
                            <span mdcListItemPrimaryText>primary</span>
                            <span mdcListItemSecondaryText>secondary</span>
                        </span>
                        <span mdcListItemMeta></span>
                    </li>
                    <li mdcListDivider [inset]="inset" [padded]="padded"></li>
                </ul>
                <hr mdcListDivider>
            </div>
        `
    })
    class TestOptionalDirectivesComponent {
        inset = null;
        padded = null;
    }
    it('should render optional directives correctly', fakeAsync(() => {
        const { fixture, list, testComponent } = setup(TestOptionalDirectivesComponent);

        expect(fixture.nativeElement.querySelector('div.mdc-list-group')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('h3.mdc-list-group__subheader')).not.toBeNull();
        expect(list.classList).toContain('mdc-list--two-line');
        expect(fixture.nativeElement.querySelector('li.mdc-list-item')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('span.mdc-list-item__text')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('span.mdc-list-item__primary-text')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('span.mdc-list-item__secondary-text')).not.toBeNull();
        const itemDivider = fixture.nativeElement.querySelector('li.mdc-list-divider');
        expect(itemDivider.getAttribute('role')).toBe('separator');
        expect(itemDivider.classList).not.toContain('mdc-list-divider--inset');
        expect(itemDivider.classList).not.toContain('mdc-list-divider--padded');
        const listDivider = fixture.nativeElement.querySelector('hr.mdc-list-divider');
        expect(listDivider.getAttribute('role')).toBeNull();
        expect(fixture.nativeElement.querySelector('span.mdc-list-item__graphic')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('span.mdc-list-item__meta')).not.toBeNull();

        testComponent.inset = true;
        testComponent.padded = true;
        fixture.detectChanges();
        expect(itemDivider.classList).toContain('mdc-list-divider--inset');
        expect(itemDivider.classList).toContain('mdc-list-divider--padded');
    }));

    @Component({
        template: `
            <ul mdcList [selectionMode]="selectionMode" [nonInteractive]="nonInteractive">
                <li *ngFor="let item of items" mdcListItem [value]="item.value" [selected]="item.active" (selectedChange)="active($event, item.value)">
                    <span mdcListItemText>{{item.value}}</span>
                </li>
            </ul>
        `
    })
    class TestProgrammaticActivationComponent {
        selectedChange: {value: string, active: boolean}[] = [];
        items = [
            {value: 'item1', active: true},
            {value: 'item2', active: false},
            {value: 'item3', active: false}
        ];
        nonInteractive = false;
        selectionMode: string = null;
        active(active: boolean, value: string) {
            this.selectedChange.push({value, active});
        }
    }
    it('single selection list: programmatic change of active/selected items', fakeAsync(() => {
        const { fixture, items, testComponent } = setup(TestProgrammaticActivationComponent);
        expectActive(items, 0, 'selected', true); // first item selected, no aria-selected, because plain list should not have aria-selected attributes
        expect(testComponent.selectedChange).toEqual([{active: true, value: 'item1'}]);
        // switch to single selection mode:
        testComponent.selectionMode = 'single';
        testComponent.selectedChange = [];
        fixture.detectChanges(); tick();
        expectActive(items, 0, 'selected');
        testComponent.items[0].active = false;
        testComponent.items[2].active = true;
        fixture.detectChanges(); tick();
        expectActive(items, 2, 'selected');
        expect(testComponent.selectedChange).toEqual([
            {active: false, value: 'item1'},
            {active: true, value: 'item3'},
        ]);

        testComponent.selectionMode = 'active';
        fixture.detectChanges(); tick();
        expectActive(items, 2, 'current');
        testComponent.items[1].active = true;
        fixture.detectChanges(); tick();
        expectActive(items, 1, 'current'); // only the first of the two 'active' items selected
    }));

    it('simple list: programmatic change of active/selected items', fakeAsync(() => {
        const { fixture, items, testComponent } = setup(TestProgrammaticActivationComponent);
        expectActive(items, 0, 'selected', true);
        expect(testComponent.selectedChange).toEqual([{active: true, value: 'item1'}]);
        testComponent.selectedChange = [];
        // activate all items:
        testComponent.items[1].active = true;
        testComponent.items[2].active = true;
        fixture.detectChanges(); tick();
        expectActive(items, [0, 1, 2], 'selected', true);
        expect(testComponent.selectedChange).toEqual([
            {active: true, value: 'item2'},
            {active: true, value: 'item3'},
        ]);

        testComponent.nonInteractive = true;
        testComponent.items[0].active = false;
        fixture.detectChanges(); tick();
        expectActive(items, [1, 2], 'selected', true);
    }));

    function expectTabbable(items: HTMLElement[], index: number) {
        const expected = Array.apply(null, Array(items.length)).map((_, i) => i === index ? '0' : '-1');
        expect(items.map(it => it.getAttribute('tabindex'))).toEqual(expected);
    }

    function expectRoles(items: HTMLElement[], role: string) {
        items.forEach(item => expect(item.getAttribute('role')).toBe(role));
    }

    function expectActive(items: HTMLElement[], index: number | number[], type: 'current' | 'selected' | 'checked' | null, noAria = false) {
        const indexes = typeof index === 'number' ? [index] : index;
        const expectSelected = Array.apply(null, Array(items.length)).map((_, i) => indexes.indexOf(i) !== -1 && type === 'selected');
        const expectActived = Array.apply(null, Array(items.length)).map((_, i) => indexes.indexOf(i) !== -1 && type === 'current');
        const expectAriaSelected = Array.apply(null, Array(items.length)).map((_, i) => ariaValueForType('selected', i, noAria));
        const expectAriaCurrent = Array.apply(null, Array(items.length)).map((_, i) => ariaValueForType('current', i, noAria));
        const expectAriaChecked = Array.apply(null, Array(items.length)).map((_, i) => ariaValueForType('checked', i, noAria));
        expect(items.map(it => it.classList.contains('mdc-list-item--selected'))).toEqual(expectSelected);
        expect(items.map(it => it.classList.contains('mdc-list-item--activated'))).toEqual(expectActived);
        expect(items.map(it => it.getAttribute('aria-selected'))).toEqual(expectAriaSelected);
        expect(items.map(it => it.getAttribute('aria-current'))).toEqual(expectAriaCurrent);
        expect(items.map(it => it.getAttribute('aria-checked'))).toEqual(expectAriaChecked);

        function ariaValueForType(forType: 'current' | 'selected' | 'checked', i, noAria) {
            if (!noAria && type === forType)
                return  indexes.indexOf(i) !== -1 ? 'true' : 'false';
            return null;
        }
    }

    function expectDisabled(items: HTMLElement[], index: number) {
        const expected = Array.apply(null, Array(items.length)).map((_, i) => i === index);
        expect(items.map(it => it.classList.contains('mdc-list-item--disabled'))).toEqual(expected);
        expect(items.map(it => !!it.getAttribute('aria-disabled'))).toEqual(expected);
        expect(items.map(it => it.getAttribute('aria-disabled') === 'true')).toEqual(expected);
    }

    function newFocusEvent(name: string) {
        const event = document.createEvent('FocusEvent');
        event.initEvent(name, true, true);
        return event;
    }

    function newKeydownEvent(key: string) {
        let event = new KeyboardEvent('keydown', {key});
        event.initEvent('keydown', true, true);
        return event;
    }

    function newClickEvent() {
        let event = document.createEvent('MouseEvent');
        event.initEvent('click', true, true);
        return event;
    }

    function blurActive() {
        (<HTMLElement>document.activeElement).blur();
    }

    function focusItem(fixture, items: HTMLElement[], index: number) {
        items[index].focus();
        items[index].dispatchEvent(newFocusEvent('focusin'));
        items[index].dispatchEvent(newClickEvent());
        tick(); fixture.detectChanges();
    }

    function blurItem(fixture, items, focusedIndex) {
        blurActive();
        items[focusedIndex].dispatchEvent(newFocusEvent('focusout'));
        tick(); fixture.detectChanges();
    }

    function setup(compType: Type<any> = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...LIST_DIRECTIVES, compType]
        }).createComponent(compType);
        fixture.detectChanges();
        const testComponent = fixture.debugElement.injector.get(compType);
        const list: HTMLElement = fixture.nativeElement.querySelector('.mdc-list');
        const items: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-list-item')];
        return { fixture, list, items, testComponent };
    }
});
