import { ComponentFixture, tick } from '@angular/core/testing';

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
    directiveStyle: string) {
    // test various ways to set the property value:
    booleanAttributeVerify(
        (value) => {component[componentProperty] = value; fixture.detectChanges(); },
        (expected) => {
            expect(directive[directiveProperty]).toBe(expected, directiveProperty);
            expect(directive._elm.nativeElement.classList.contains(directiveStyle)).toBe(expected, directiveStyle);
        }
    )
}

export function hasRipple(el: HTMLElement) {
    if (!el.classList.contains('mdc-ripple-upgraded'))
        tick(20); // wait 16ms needed for requestAnimationFrame of ripple
    return el.classList.contains('mdc-ripple-upgraded');
}
