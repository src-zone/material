import { ComponentFixture, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Type } from '@angular/core';

export function booleanAttributeVerify(
    setValue: (value: any) => void,
    expectValue: (value: boolean) => void,
) {
    setValue(null); expectValue(false);
    setValue(true); expectValue(true);
    setValue(false); expectValue(false);
    setValue(''); expectValue(true);
    setValue('f'); expectValue(true);
    setValue('false'); expectValue(false);
    setValue(1); expectValue(true);
    setValue(0); expectValue(true);
    setValue({}); expectValue(true);
    setValue(() => false); expectValue(true);
}

export function booleanAttributeStyleTest(
    fixture: ComponentFixture<any>,
    component: any,
    directive: any,
    componentProperty: string,
    directiveProperty: string,
    directiveStyle: string,
    sync: () => void = () => {}) {
    // test various ways to set the property value:
    booleanAttributeVerify(
        (value) => {component[componentProperty] = value; fixture.detectChanges(); sync(); },
        (expected) => {
            expect(directive[directiveProperty]).toBe(expected, directiveProperty);
            expect(directive._elm.nativeElement.classList.contains(directiveStyle)).toBe(expected, directiveStyle);
        }
    )
}

export function testStyle(fixture: ComponentFixture<any>, property: string, dirProperty: string, style: string,
    type: Type<any>, testComponentType: Type<any>, sync: () => void = () => {}) {
    const element = fixture.debugElement.query(By.directive(type)).injector.get(type);
    const testComponent = fixture.debugElement.injector.get(testComponentType);
    // initial the styles are not set:
    expect(element[dirProperty]).toBe(false);
    expect(element._elm.nativeElement.classList.contains(style)).toBe(false);
    // test various ways to set the property value, and the result of having the class or not:
    booleanAttributeStyleTest(fixture, testComponent, element, property, dirProperty, style, sync);
}

export function hasRipple(el: HTMLElement) {
    if (!el.classList.contains('mdc-ripple-upgraded'))
        tick(20); // wait 16ms needed for requestAnimationFrame of ripple
    return el.classList.contains('mdc-ripple-upgraded');
}

export function cancelledClick(el: HTMLElement) {
    el.dispatchEvent(new MouseEvent('mousedown'));
    event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    return !el.dispatchEvent(event);
}

export function simulateEscape() {
    simulateKey(document, 'Escape');
}

export function simulateKey(element: Element | Document, key: string, name = 'keydown') {
    event = new KeyboardEvent(name, {
        key,
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(event);
}
