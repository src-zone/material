import { AfterContentInit, Component, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, HostListener,
  Input, OnDestroy, OnInit, Optional, Output, Provider, Renderer2, Self, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCCheckboxFoundation } from '@material/checkbox';
import { MdcCheckboxAdapter } from './mdc.checkbox.adapter';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';

@Directive({
    selector: 'input[mdcCheckboxInput][type=checkbox]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcCheckboxInputDirective) }]
})
export class MdcCheckboxInputDirective extends AbstractMdcInput {
    @HostBinding('class.mdc-checkbox__native-control') hasHostClass = true;
    private _id: string;
    private _disabled = false;

    constructor(public elementRef: ElementRef, @Optional() @Self() public ngControl: NgControl) {
        super();
    }

    @HostBinding()
    @Input() get id() {
        return this._id;
    }
  
    set id(value: string) {
        this._id = value;
    }

    @HostBinding()
    @Input() get disabled() {
        return this.ngControl ? this.ngControl.disabled : this._disabled;
    }

    set disabled(value: any) {
        this._disabled = asBoolean(value);
    }
}

@Directive({
    selector: '[mdcCheckbox]'
})
export class MdcCheckboxDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-checkbox') hasHostClass = true;
    @ContentChild(MdcCheckboxInputDirective) mdcInput: MdcCheckboxInputDirective;
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
            if (this.mdcInput)
                this.registry.listen(this.renderer, 'change', handler, this.mdcInput.elementRef);
        },
        deregisterChangeHandler: (handler: EventListener) => {
            if (this.mdcInput)
                this.registry.unlisten('change', handler);
        },
        getNativeControl: () => this.mdcInput ? this.mdcInput.elementRef.nativeElement : null,
        forceLayout: () => this.root.nativeElement.offsetWidth, // force layout
        isAttachedToDOM: () => !!this.mdcInput,
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
        return this.mdcInput ? this.mdcInput.elementRef : null;
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

    @HostBinding('class.mdc-checkbox--disabled') get disabled() {
        return this.mdcInput == null || this.mdcInput.disabled;
    }
}
