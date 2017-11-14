import { AfterContentInit, Component, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, HostListener,
  Input, OnDestroy, OnInit, Optional, Output, Provider, Renderer2, Self, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCCheckboxFoundation } from '@material/checkbox';
import { MdcCheckboxAdapter } from './mdc.checkbox.adapter';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';

/**
 * Directive for the input element of an <code>MdcCheckboxDirective</code>.
 */
@Directive({
    selector: 'input[mdcCheckboxInput][type=checkbox]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcCheckboxInputDirective) }]
})
export class MdcCheckboxInputDirective extends AbstractMdcInput {
    @HostBinding('class.mdc-checkbox__native-control') _cls = true;
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
 * Directive for creating a Material Design checkbox. The checkbox is driven by an
 * underlying native checkbox input, which must use the <code>MdcCheckboxInputDirective</code>
 * directive.
 * The current implementation will add all other required DOM elements (such as the
 * background).
 * Future implementations will also support supplying (customized) background
 * elements.
 * </p><p>
 * This directive can be used together with an <code>mdcFormField</code> to
 * easily position checkboxes and their labels, see
 * <a href="#/directives/form-field">mdcFormField</a>.
 */
@Directive({
    selector: '[mdcCheckbox]'
})
export class MdcCheckboxDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-checkbox') _cls = true;
    @ContentChild(MdcCheckboxInputDirective) _input: MdcCheckboxInputDirective;
    private mdcAdapter: MdcCheckboxAdapter = {
        addClass: (className: string) => {
            this.renderer.addClass(this.root.nativeElement, className);
        },
        removeClass: (className: string) => {
            this.renderer.removeClass(this.root.nativeElement, className);
        },
        registerAnimationEndHandler: (handler: EventListener) => {
            this.registry.listen(this.renderer, 'animationend ', handler, this.root);
        },
        deregisterAnimationEndHandler: (handler: EventListener) => {
            this.registry.unlisten('animationend', handler);
        },
        registerChangeHandler: (handler: EventListener) => {
            if (this._input)
                this.registry.listen(this.renderer, 'change', handler, this._input._elm);
        },
        deregisterChangeHandler: (handler: EventListener) => {
            if (this._input)
                this.registry.unlisten('change', handler);
        },
        getNativeControl: () => this._input ? this._input._elm.nativeElement : null,
        forceLayout: () => this.root.nativeElement.offsetWidth, // force layout
        isAttachedToDOM: () => !!this._input,
    };
    private foundation: { init: Function, destroy: Function } = new MDCCheckboxFoundation(this.mdcAdapter);

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry) {
        super(root, renderer, registry);
    }

    ngAfterContentInit() {
        this.addBackground();
        this.initRipple();
        this.foundation.init();
    }

    ngOnDestroy() {
        this.foundation.destroy();
        this.destroyRipple();
    }

    private addBackground() {
        let path = this.renderer.createElement('path', 'svg');
        this.renderer.addClass(path, 'mdc-checkbox__checkmark__path');
        this.renderer.setAttribute(path, 'fill', 'none');
        this.renderer.setAttribute(path, 'stroke', 'white');
        this.renderer.setAttribute(path, 'd', 'M1.73,12.91 8.1,19.28 22.79,4.59');
        let svg = this.renderer.createElement('svg', 'svg');
        this.renderer.appendChild(svg, path);
        this.renderer.addClass(svg, 'mdc-checkbox__checkmark');
        this.renderer.setAttribute(svg, 'viewBox', '0 0 24 24');
        let mixedmark = this.renderer.createElement('div');
        this.renderer.addClass(mixedmark, 'mdc-checkbox__mixedmark');
        let bg = this.renderer.createElement('div');
        this.renderer.appendChild(bg, svg);
        this.renderer.appendChild(bg, mixedmark);
        this.renderer.addClass(bg, 'mdc-checkbox__background');
        this.renderer.appendChild(this.root.nativeElement, bg);
    }

    /** @docs-private */
    protected getRippleInteractionElement() {
        return this._input ? this._input._elm : null;
    }

    /** @docs-private */
    protected isRippleUnbounded() {
        return true;
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

    @HostBinding('class.mdc-checkbox--disabled') get _disabled() {
        return this._input == null || this._input.disabled;
    }
}
