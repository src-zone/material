import { AfterContentInit, ContentChild, ContentChildren, forwardRef, Directive, ElementRef, HostBinding, HostListener,
  Input, OnDestroy, Optional, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCFormFieldFoundation } from '@material/form-field';
import { MdcFormFieldAdapter } from './mdc.form-field.adapter';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { AbstractMdcLabel } from '../abstract/abstract.mdc.label';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

let nextId = 1;

@Directive({
    selector: 'input[mdcFormFieldInput], textarea[mdcFormFieldInput]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcFormFieldInputDirective) }]
})
export class MdcFormFieldInputDirective extends AbstractMdcInput {
    private _id: string;
    private _disabled = false;

    constructor(public _elm: ElementRef, @Optional() @Self() public _cntr: NgControl) {
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
        return this._cntr ? this._cntr.disabled : this._disabled;
    }

    set disabled(value: any) {
        this._disabled = asBoolean(value);
    }
}

@Directive({
    selector: 'label[mdcFormFieldLabel]',
    providers: [{provide: AbstractMdcLabel, useExisting: forwardRef(() => MdcFormFieldLabelDirective) }]
})
export class MdcFormFieldLabelDirective extends AbstractMdcLabel {
    @HostBinding() @Input() for: string;

    constructor(public _elm: ElementRef) {
        super();
    }
}

@Directive({
    selector: '[mdcFormField]'
})
export class MdcFormFieldDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-form-field') _cls = true;
    private _alignEnd = false;
    @ContentChild(AbstractMdcRipple) rippleChild: AbstractMdcRipple;
    @ContentChild(AbstractMdcInput) mdcInput: AbstractMdcInput;
    @ContentChild(AbstractMdcLabel) mdcLabel: AbstractMdcLabel;

    private mdcAdapter: MdcFormFieldAdapter = {
        registerInteractionHandler: (type: string, handler: EventListener) => {
            this.registry.listen(this.renderer, type, handler, this.root);
        },
        deregisterInteractionHandler: (type: string, handler: EventListener) => {
            this.registry.unlisten(type, handler);
        },
        activateInputRipple: () => {
            if (this.rippleChild)
                this.rippleChild.activateRipple();
        },
        deactivateInputRipple: () => {
            if (this.rippleChild)
                this.rippleChild.deactivateRipple();
        }
    };
    private foundation: { init: Function, destroy: Function } = new MDCFormFieldFoundation(this.mdcAdapter);

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry) {
    }

    ngAfterContentInit() {
        if (this.mdcInput != null && this.mdcLabel != null) {
            if (this.mdcInput.id == null && this.mdcLabel.for == null)
                this.mdcInput.id = this.mdcLabel.for = `mdc-form-input-${nextId++}`;
            else if (this.mdcInput.id == null)
                this.mdcInput.id = this.mdcLabel.for;
            else if (this.mdcLabel.for == null)
                this.mdcLabel.for = this.mdcInput.id;
        }
        this.foundation.init();
    }

    ngOnDestroy() {
        this.foundation.destroy();
    }

    @Input() @HostBinding('class.mdc-form-field--align-end') get alignEnd() {
        return this._alignEnd;
    }

    set alignEnd(val: any) {
        this._alignEnd = asBoolean(val);
    }
}
