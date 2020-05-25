import { TestBed, fakeAsync, ComponentFixture, tick, flush } from '@angular/core/testing';
import { Component, Type } from '@angular/core';
import { MdcFloatingLabelDirective } from '../floating-label/mdc.floating-label.directive';
import { SELECT_DIRECTIVES, MdcSelectDirective } from './mdc.select.directive';
import { MENU_DIRECTIVES } from '../menu/mdc.menu.directive';
import { LIST_DIRECTIVES } from '../list/mdc.list.directive';
import { MENU_SURFACE_DIRECTIVES } from '../menu-surface/mdc.menu-surface.directive';
import { NOTCHED_OUTLINE_DIRECTIVES } from '../notched-outline/mdc.notched-outline.directive';
import { hasRipple, simulateKey } from '../../testutils/page.test';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// TODO: test disabled options
// TODO: test structure when surface open
// TODO: test structure when required
// TODO: test mdcSelect with FormsModule

describe('MdcSelectDirective', () => {
    it('filled: test DOM, aria properties, and ripple', fakeAsync(() => {
        const { fixture, testComponent } = setup(TestStaticComponent);
        const root = fixture.nativeElement.querySelector('.mdc-select');
        const { anchor } = validateDom(root);
        expect(hasRipple(anchor)).toBe(true, 'the ripple element should be attached to the anchor');

        testComponent.disabled = true;
        fixture.detectChanges(); tick(5);
        validateDom(root, {disabled: true});

        testComponent.labeled = false; testComponent.disabled = false;
        fixture.detectChanges(); tick(5);
        validateDom(root, {labeled: false});
    }));

    it('outlined: test DOM, aria properties, and ripple', fakeAsync(() => {
        const { fixture, testComponent } = setup(TestStaticOutlinedComponent);
        const root = fixture.nativeElement.querySelector('.mdc-select');
        const { anchor } = validateDom(root, {outlined: true});
        expect(hasRipple(anchor)).toBe(false, 'no ripple allowed for outlined variant');

        testComponent.disabled = true;
        fixture.detectChanges(); tick(5);
        validateDom(root, {outlined: true, disabled: true});

        testComponent.labeled = false; testComponent.disabled = false;
        fixture.detectChanges(); tick(5);
        validateDom(root, {outlined: true, labeled: false});
    }));

    it('filled: floating label must float when input has focus', fakeAsync(() => {
        const { fixture } = setup(TestStaticComponent);
        validateFloatOnFocus(fixture);
    }));

    it('outlined: floating label must float when input has focus', fakeAsync(() => {
        const { fixture } = setup(TestStaticOutlinedComponent);
        validateFloatOnFocus(fixture);
    }));

    it('value can be changed programmatically', fakeAsync(() => {
        const { fixture, testComponent } = setup(TestStaticComponent);
        
        expect(testComponent.value).toBe(null);
        setAndCheck(fixture, 'vegetables', TestStaticComponent);
        setAndCheck(fixture, '', TestStaticComponent);
        setAndCheck(fixture, 'fruit', TestStaticComponent);
        setAndCheck(fixture, null, TestStaticComponent);
        setAndCheck(fixture, 'invalid', TestStaticComponent);
    }));

    it('value can be changed by user', fakeAsync(() => {
        const { fixture, testComponent } = setup();

        expect(testComponent.value).toBe(null);
        selectAndCheck(fixture, 0, 2, 'vegetables');
        selectAndCheck(fixture, 2, 3, 'fruit');
        selectAndCheck(fixture, 3, 0, '');
    }));

    function setAndCheck(fixture: ComponentFixture<any>, value: any, type = TestComponent) {
        const testComponent = fixture.debugElement.injector.get(type);
        const mdcSelect = fixture.debugElement.query(By.directive(MdcSelectDirective))?.injector.get(MdcSelectDirective);
        testComponent.value = value;
        fixture.detectChanges(); flush(); fixture.detectChanges(); flush(); fixture.detectChanges(); flush();
        if (value === 'invalid')
            value = '';
        expect(mdcSelect.value).toBe(value || '');
        expect(testComponent.value).toBe(value || '');

        checkFloating(fixture, value != null && value.length > 0);
    }

    function selectAndCheck(fixture: ComponentFixture<any>, focusIndex: number, selectIndex: number, value: string, type: Type<any> = TestComponent) {
        const testComponent = fixture.debugElement.injector.get(type);
        const text = fixture.nativeElement.querySelector('.mdc-select__selected-text');
        const items = [...fixture.nativeElement.querySelectorAll('.mdc-list-item')];
        const mdcSelect = fixture.debugElement.query(By.directive(MdcSelectDirective))?.injector.get(MdcSelectDirective);
        text.dispatchEvent(new Event('focus'));
        simulateKey(text, 'ArrowDown');
        animationCycle(fixture);
        expect(document.activeElement).toBe(items[focusIndex]);
        let selected = focusIndex;
        while (selected < selectIndex) {
            simulateKey(items[selected], 'ArrowDown');
            fixture.detectChanges(); flush();
            expect(document.activeElement).toBe(items[++selected]);
        }
        while (selected > selectIndex) {
            simulateKey(items[selected], 'ArrowUp');
            fixture.detectChanges(); flush();
            expect(document.activeElement).toBe(items[--selected]);
        }
        simulateKey(items[selected], 'Enter');
        animationCycle(fixture);
        
        expect(mdcSelect.value).toBe(value);
        expect(testComponent.value).toBe(value);

        checkFloating(fixture, value != null && value.length > 0);
    }

    @Component({
        template: `
            <div mdcSelect [(value)]="value">
                <div mdcSelectAnchor>
                    <div mdcSelectText>{{value}}</div>
                    <span mdcFloatingLabel>Pick a Food Group</span>
                </div>            
                <div mdcSelectMenu>
                    <ul mdcList>
                        <li mdcListItem value="" aria-selected="true"></li>
                        <li mdcListItem value="grains">Bread, Cereal, Rice, and Pasta</li>
                        <li mdcListItem value="vegetables">Vegetables</li>
                        <li mdcListItem value="fruit">Fruit</li>
                    </ul>
                </div>
            </div>
            <div>selected: {{value}}</div>
        `
    })
    class TestComponent {
        value: any = null;
    }

    @Component({
        template: `
            <div mdcSelect [(value)]="value" [disabled]="disabled">
                <div mdcSelectAnchor>
                    <div mdcSelectText>{{value}}</div>
                    <span *ngIf="labeled" mdcFloatingLabel>Pick a Food Group</span>
                </div>            
                <div mdcSelectMenu>
                    <ul mdcList>
                        <li mdcListItem value="" aria-selected="true"></li>
                        <li mdcListItem value="grains">Bread, Cereal, Rice, and Pasta</li>
                        <li mdcListItem value="vegetables">Vegetables</li>
                        <li mdcListItem value="fruit">Fruit</li>
                    </ul>
                </div>
            </div>
            <div>selected: {{value}}</div>
        `
    })
    class TestStaticComponent {
        value: any = null;
        labeled = true;
        disabled = false;
    }

    @Component({
        template: `
            <div mdcSelect [(value)]="value" [disabled]="disabled">
                <div mdcSelectAnchor>
                    <div mdcSelectText>{{value}}</div>
                    <span mdcNotchedOutline>
                        <span *ngIf="labeled" mdcNotchedOutlineNotch>
                            <span mdcFloatingLabel>Floating Label</span>
                        </span>
                    </span>
                </div>            
                <div mdcSelectMenu>
                    <ul mdcList>
                        <li mdcListItem value="" aria-selected="true"></li>
                        <li mdcListItem value="grains">Bread, Cereal, Rice, and Pasta</li>
                        <li mdcListItem value="vegetables">Vegetables</li>
                        <li mdcListItem value="fruit">Fruit</li>
                    </ul>
                </div>
            </div>
            <div>selected: {{value}}</div>
        `
    })
    class TestStaticOutlinedComponent {
        value: any = null;
        labeled = true;
        disabled = false;
    }

    function setup(compType: Type<any> = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [
                ...SELECT_DIRECTIVES,
                ...MENU_DIRECTIVES,
                ...MENU_SURFACE_DIRECTIVES,
                ...LIST_DIRECTIVES,
                MdcFloatingLabelDirective,
                ...NOTCHED_OUTLINE_DIRECTIVES,
                compType]
        }).createComponent(compType);
        fixture.detectChanges(); flush();
        const testComponent = fixture.debugElement.injector.get(compType);
        const select = fixture.nativeElement.querySelector('.mdc-select');
        return { fixture, testComponent, select };
    }
});

function validateDom(select, options: Partial<{
        outlined: boolean,
        expanded: boolean,
        disabled: boolean,
        required: boolean,
        labeled: boolean,
        selected: number,
        values: boolean
    }> = {}) {
    options = {...{
        outlined: false,
        expanded: false,
        disabled: false,
        required: false,
        labeled: true,
        selected: -1,
        values: true
    }, ...options};

    expect(select.classList).toContain('mdc-select');
    if (!options.labeled)
        expect(select.classList).toContain('mdc-select--no-label');
    else
        expect(select.classList).not.toContain('mdc-select--no-label');
    if (options.disabled)
        expect(select.classList).toContain('mdc-select--disabled');
    else
        expect(select.classList).not.toContain('mdc-select--disabled');
    if (options.required)
        expect(select.classList).toContain('mdc-select--required');
    else
        expect(select.classList).not.toContain('mdc-select--required');
    expect(select.children.length).toBe(2);

    const anchor = select.children[0];
    if (options.outlined)
        expect(anchor.children.length).toBe(3);
    else
        expect(anchor.children.length).toBe(options.labeled ? 4 : 3);
    const dropDownIcon = anchor.children[0];
    const selectedText = anchor.children[1];
    expect(selectedText.id).toMatch(/mdc-u-id-.*/);
    const floatingLabel = anchor.querySelector('.mdc-floating-label');
    expect(!!floatingLabel).toBe(options.labeled);
    if (floatingLabel) {
        expect(floatingLabel.id).toMatch(/mdc-u-id-.*/);
        expect(floatingLabel.classList).toContain('mdc-floating-label');
    }
    if (options.outlined) {
        const notchedOutline = anchor.children[2];
        expect(notchedOutline.classList).toContain('mdc-notched-outline');
        expect(notchedOutline.children.length).toBe(options.labeled ? 3 : 2);
        expect(notchedOutline.children[0].classList).toContain('mdc-notched-outline__leading');
        expect(notchedOutline.children[notchedOutline.children.length - 1].classList).toContain('mdc-notched-outline__trailing');
        if (floatingLabel) {
            expect(notchedOutline.children[1].classList).toContain('mdc-notched-outline__notch');
            const notch = notchedOutline.children[1];
            expect(notch.children.length).toBe(1);
            expect(notch.children[0]).toBe(floatingLabel);
        }
    } else {
        const lineRipple = anchor.children[anchor.children.length - 1];
        expect(lineRipple.classList).toContain('mdc-line-ripple');
        if (floatingLabel)
            expect(anchor.children[2]).toBe(floatingLabel);
    }
    expect(dropDownIcon.classList).toContain('mdc-select__dropdown-icon');
    expect(selectedText.classList).toContain('mdc-select__selected-text');
    expect(selectedText.getAttribute('tabindex')).toBe(options.disabled ? '-1': '0');
    expect(selectedText.getAttribute('aria-disabled')).toBe(`${options.disabled}`);
    expect(selectedText.getAttribute('aria-required')).toBe(`${options.required}`);
    expect(selectedText.getAttribute('role')).toBe('button');
    expect(selectedText.getAttribute('aria-haspopup')).toBe('listbox');
    expect(selectedText.getAttribute('aria-labelledBy')).toBe(`${floatingLabel ? floatingLabel.id + ' ' : ''}${selectedText.id}`);
    expect(selectedText.getAttribute('aria-expanded')).toBe(options.expanded ? 'true' : 'false');

    expect(anchor.classList).toContain('mdc-select__anchor');

    const menu = select.children[1];
    expect(menu.classList).toContain('mdc-select__menu');
    expect(menu.classList).toContain('mdc-menu');
    expect(menu.classList).toContain('mdc-menu-surface');
    expect(menu.children.length).toBe(1);

    const list = menu.children[0];
    expect(list.classList).toContain('mdc-list');
    expect(list.getAttribute('role')).toBe('listbox');
    expect(list.getAttribute('aria-labelledBy')).toBe(floatingLabel ? floatingLabel.id : null);
    expect(list.getAttribute('tabindex')).toBe('0');
    const items = [...list.querySelectorAll('li')];
    let index = 0;
    items.forEach(item => {
        expect(item.classList).toContain('mdc-list-item');
        expect(item.getAttribute('role')).toBe('option');
        expect(item.getAttribute('tabindex')).toMatch(/0|-1/);
        const selected = options.selected === index
        expect(item.getAttribute('aria-selected')).toBe(selected ? 'true' : 'false');
        if (selected)
            expect(item.classList).toContain('mdc-list-item--selected');
        else
            expect(item.classList).not.toContain('mdc-list-item--selected');
        expect(item.hasAttribute('value')).toBe(options.values);
        ++index;
    });
    return { anchor, menu, list, items };
}

function validateFloatOnFocus(fixture) {
    const floatingLabelElm = fixture.nativeElement.querySelector('.mdc-floating-label');
    const text = fixture.nativeElement.querySelector('.mdc-select__selected-text');
    expect(floatingLabelElm.classList).not.toContain('mdc-floating-label--float-above');
    text.dispatchEvent(new Event('focus')); tick();
    expect(floatingLabelElm.classList).toContain('mdc-floating-label--float-above');
    text.dispatchEvent(new Event('blur')); tick();
    expect(floatingLabelElm.classList).not.toContain('mdc-floating-label--float-above');
}

function checkFloating(fixture: ComponentFixture<any>, expected: boolean) {
    // when not empty, the label must be floating:
    const floatingLabelElm = fixture.nativeElement.querySelector('.mdc-floating-label');
    if (floatingLabelElm) {
        if (expected)
            expect(floatingLabelElm.classList).toContain('mdc-floating-label--float-above');
        else
            expect(floatingLabelElm.classList).not.toContain('mdc-floating-label--float-above');
    }
}

function animationCycle(fixture) {
    fixture.detectChanges(); tick(300); flush();
}
