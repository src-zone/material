import { AfterContentInit, Directive, ElementRef, HostBinding,
    Input, OnDestroy, Renderer2 } from '@angular/core';
import { MDCRipple } from '@material/ripple';
import { MDCRippleFoundation } from '@material/ripple';
import { asBoolean, asBooleanOrNull } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Directive for making an element a ripple surface. The ripple can be customized
 * with the provided
 * <a href="https://github.com/material-components/material-components-web/tree/master/packages/mdc-ripple#sass-apis"
 *   target="_blank">Sass Mixins</a>.
 * Alternatively you can set the <code>surface</code> to get a default styled ripple.
 */
@Directive({
    selector: '[mdcRipple]'
})
export class MdcRippleDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    private _initialized = false;
    private _on = false;
    private _disabled: boolean = null;
    private _unbounded = false;
    private _surface = false;
    private _dim = null;

    constructor(private elm: ElementRef, private renderer: Renderer2, private registry: MdcEventRegistry) {
        super(elm, renderer, registry);
    }
  
    ngAfterContentInit() {
        if (this._on)
            this.initRipple();
        this._initialized = true;
    }
  
    ngOnDestroy() {
        this.destroyRipple();
    }

    /** @docs-private */
    protected isRippleUnbounded() {
        return this._unbounded;
    }

    /** @docs-private */
    protected isRippleSurfaceDisabled() {
        return this._disabled == null ? super.isRippleSurfaceDisabled() : this._disabled;
    }

    /** @docs-private */
    protected computeRippleBoundingRect() {
        if (this._dim == null)
            return super.computeRippleBoundingRect();
        const {left, top} = this.elm.nativeElement.getBoundingClientRect();
        return {
            left,
            top,
            width: this._dim,
            height: this._dim,
            right: left + this._dim,
            bottom: left + this._dim,
        };
    }

    /**
     * Set this input to false to remove the ripple effect from the surface.
     */
    @Input() get mdcRipple() {
        return !this._on;
    }

    set mdcRipple(value: any) {
        let newValue = asBoolean(value);
        if (newValue !== this._on) {
            this._on = newValue;
            if (this._initialized) {
                if (newValue)
                    this.initRipple();
                else
                    this.destroyRipple();
            }
        }
    }

    /**
     * When this input has a value other than false, the ripple is unbounded.
     * Surfaces for bounded ripples should have <code>overflow</code> set to hidden,
     * while surfaces for unbounded ripples should have it set to <code>visible</code>.
     */
    @Input() get unbounded() {
        return this._unbounded;
    }

    set unbounded(value: any) {
        let newValue = asBoolean(value);
        if (newValue !== this._unbounded) {
            this._unbounded = newValue;
            this.reInit();
        }
    }

    @HostBinding('attr.data-mdc-ripple-is-unbounded') get _attrUnbounded() {
        return this._unbounded ? "" : null;
    }

    /**
     * This input sets the dimension of the ripple.
     * This input can be set to null for returning to the defaults, which uses the surface
     * element to compute the bounds of the ripple.
     */
    @Input() get dimension() {
        return this._dim;
    }

    set dimension(value: string | number) {
        this._dim = value == null ? null : +value;
        this.layout();
    }

    /**
     * This input can be used to programmatically enable/disable the ripple.
     * When true, the ripple effect will be disabled, when false the ripple
     * effect will be enabled. When not set, or <code>null</code> (default)
     * the ripple effect enabled/disabled state depend on whether or not the
     * surface element has the <code>disabled</code> attribute set.
     */
    @Input() get disabled() {
        return this._disabled;
    }

    set disabled(value: any) {
        this._disabled = asBooleanOrNull(value);
    }

    /**
     * When this input has a value other than false, the ripple element will get the
     * "mdc-ripple-surface" class. That class has styling for bounded and unbounded
     * ripples in accordance with your theme customizations. Without this property,
     * you have to supply your own ripple styles, using the provided
     * <a href="https://github.com/material-components/material-components-web/tree/master/packages/mdc-ripple#sass-apis"
     *   target="_blank">Sass Mixins</a>.
     */
    @Input() @HostBinding('class.mdc-ripple-surface') get surface() {
        return this._surface;
    }

    set surface(value: any) {
        this._surface = asBoolean(value);
    }

    private reInit() {
        if (this._initialized && this.isRippleInitialized()) {
            this.destroyRipple();
            this.initRipple();
        }
    }

    private layout() {
        if (this._initialized && this.isRippleInitialized()) {
            this._rippleFoundation.layout();
        }
    }
}
