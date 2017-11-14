import { AfterContentInit, Component, ContentChild, Directive, ElementRef, EventEmitter, HostBinding, HostListener,
  Input, Optional, Output, Provider, Renderer2, Self, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { asBoolean } from '../../utils/value.utils';

/**
 * Directive for the input element of an <code>MdcSwitchDirective</code>.
 */
@Directive({
    selector: 'input[mdcSwitchInput][type=checkbox]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcSwitchInputDirective) }]
})
export class MdcSwitchInputDirective extends AbstractMdcInput {
    @HostBinding('class.mdc-switch__native-control') _cls = true;
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
 * Directive for creating a Material Design switch component. The switch is driven by an
 * underlying native checkbox input, which must use the <code>MdcSwitchInputDirective</code>
 * directive.
 * The current implementation will add all other required DOM elements (such as the
 * background).
 * Future implementations will also support supplying (customized) background
 * elements.
 * </p><p>
 * This directive can be used together with an <code>mdcFormField</code> to
 * easily position switches and their labels, see
 * <a href="#/directives/form-field">mdcFormField</a>.
 */
@Directive({
    selector: '[mdcSwitch]'
})
export class MdcSwitchDirective implements AfterContentInit {
    @HostBinding('class.mdc-switch') _cls = true;
    @ContentChild(MdcSwitchInputDirective) _input: MdcSwitchInputDirective;

    constructor(private rndr: Renderer2, private root: ElementRef) {
    }

    ngAfterContentInit() {
        this.addBackground();
    }

    private addBackground() {
        let knob = this.rndr.createElement('div');
        this.rndr.addClass(knob, 'mdc-switch__knob');
        let bg = this.rndr.createElement('div');
        this.rndr.addClass(bg, 'mdc-switch__background');
        this.rndr.appendChild(bg, knob);
        this.rndr.appendChild(this.root.nativeElement, bg);
    }

    @HostBinding('class.mdc-switch--disabled') get _disabled() {
        return this._input == null || this._input.disabled;
    }
}
