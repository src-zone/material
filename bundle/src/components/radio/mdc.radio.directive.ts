import { AfterContentInit, Component, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, HostListener,
  Input, OnDestroy, OnInit, Optional, Output, Provider, Renderer2, Self, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCRadioFoundation } from '@material/radio';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcRadioAdapter } from './mdc.radio.adapter';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Directive for the input element of an <code>MdcRadioDirective</code>.
 */
@Directive({
    selector: 'input[mdcRadioInput][type=radio]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcRadioInputDirective) }]
})
export class MdcRadioInputDirective extends AbstractMdcInput {
    @HostBinding('class.mdc-radio__native-control') _cls = true;
    private _id: string;
    private _disabled = false;

    constructor(public _elm: ElementRef, @Optional() @Self() public _cntr: NgControl) {
        super();
    }

    /** @docs-private */
    @HostBinding()
    @Input() get id() {
        return this._id;
    }
  
    set id(value: string) {
        this._id = value;
    }

    /** @docs-private */
    @HostBinding()
    @Input() get disabled() {
        return this._cntr ? this._cntr.disabled : this._disabled;
    }

    set disabled(value: any) {
        this._disabled = asBoolean(value);
    }
}

/**
 * Directive for creating a Material Design radio button. The radio button is driven by an
 * underlying native radio input, which must use the <code>MdcRadioInputDirective</code>
 * directive.
 * The current implementation will add all other required DOM elements (such as the
 * background).
 * Future implementations will also support supplying (customized) background
 * elements.
 * </p><p>
 * This directive can be used together with an <code>mdcFormField</code> to
 * easily position radio buttons and their labels, see
 * <a href="#/directives/form-field">mdcFormField</a>.
 */
@Directive({
    selector: '[mdcRadio]'
})
export class MdcRadioDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-radio') _cls = true;
    @ContentChild(MdcRadioInputDirective) _input: MdcRadioInputDirective;
    private mdcAdapter: MdcRadioAdapter = {
        addClass: (className: string) => {
            this.renderer.addClass(this.root.nativeElement, className);
        },
        removeClass: (className: string) => {
            this.renderer.removeClass(this.root.nativeElement, className);
        },
        getNativeControl: () => this._input ? this._input._elm.nativeElement : null
    };
    private foundation: { init: Function, destroy: Function } = new MDCRadioFoundation(this.mdcAdapter);

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry) {
        super(root, renderer, registry);
    }

    ngAfterContentInit() {
        this.addBackground();
        this.initRipple();
        this.foundation.init();
    }

    ngOnDestroy() {
        this.destroyRipple();
        this.foundation.destroy();
    }

    private addBackground() {
        let outerCircle = this.renderer.createElement('div');
        this.renderer.addClass(outerCircle, 'mdc-radio__outer-circle');
        let innerCircle = this.renderer.createElement('div');
        this.renderer.addClass(innerCircle, 'mdc-radio__inner-circle');
        let bg = this.renderer.createElement('div');
        this.renderer.appendChild(bg, outerCircle);
        this.renderer.appendChild(bg, innerCircle);
        this.renderer.addClass(bg, 'mdc-radio__background');
        this.renderer.appendChild(this.root.nativeElement, bg);
    }

    /** @docs-private */
    protected getRippleInteractionElement() {
        return this._input ? this._input._elm : null;
    }

    /** @docs-private */
    isRippleUnbounded() {
        return true;
    }

    /** @docs-private */
    isRippleSurfaceActive() {
        // This is what the @material/radio MDCRadio component does, with the following comment:
        // "Radio buttons technically go 'active' whenever there is *any* keyboard interaction.
        //  This is not the UI we desire."
        return false;
    }

    /** @docs-private */
    protected computeRippleBoundingRect() {
        const dim = 40;
        const {left, top} = this.root.nativeElement.getBoundingClientRect();
        return {
            top,
            left,
            right: left + dim,
            bottom: top + dim,
            width: dim,
            height: dim
        };
    }

    @HostBinding('class.mdc-radio--disabled') get _disabled() {
        return this._input == null || this._input.disabled;
    }
}
