import { Directive, ElementRef, HostBinding, Input, AfterContentInit, Renderer2 } from '@angular/core';
import { MDCRipple } from '@material/ripple';
import { MDCRippleFoundation } from '@material/ripple';
import { asBoolean, asBooleanOrNull } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';

/**
 * Directive for elevating an element above its surface.
 */
@Directive({
    selector: '[mdcElevation]'
})
export class MdcElevationDirective implements AfterContentInit {
    private _z: number = null;
    private _transition;

    constructor(private rndr: Renderer2, private elm: ElementRef) {
    }

    ngAfterContentInit() {
        if (this._z == null)
            this.mdcElevation = 1;
    }

    /**
     * Input for setting the elevation (z-space). The value sould be in the range [0, 24].
     * When set to 0, the element will not be elevated! The default value is 1.
     */
    @Input() get mdcElevation() {
        return this._z;
    }

    set mdcElevation(value: string | number) {
        let newValue = (value == null || value === '') ? 1 : +value;
        if (newValue < 0)
            newValue = 0;
        if (newValue > 24)
            newValue = 24;
        if (newValue !== this._z) {
            if (this._z != null)
                this.rndr.removeClass(this.elm.nativeElement, 'mdc-elevation--z' + this._z);
            this.rndr.addClass(this.elm.nativeElement, 'mdc-elevation--z' + newValue);
        }
        this._z = newValue;
    }

    /**
     * When this input is defined and does not have value false, changes of the elevation
     * will be animated.
     */
    @HostBinding('class.mdc-elevation-transition')
    @Input() get animateTransition() {
        return this._transition;
    }

    set animateTransition(value: any) {
        this._transition = asBoolean(value);
    }
}
