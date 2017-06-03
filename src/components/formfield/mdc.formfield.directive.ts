import { AfterContentInit, ContentChild, ContentChildren, forwardRef, QueryList, Directive, ElementRef, HostBinding, HostListener,
  Input, OnDestroy, Optional, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCFormFieldFoundation } from '@material/form-field';
import { MdcFormfieldAdapter } from './mdc.formfield.adapter';
import { AbstractMdcRipple } from '../ripple';
import { AbstractMdcInput, AbstractMdcLabel } from '../abstract';
import { asBoolean, MdcEventRegistry } from '../../utils';

let nextId = 1;

@Directive({
    selector: 'input[mdcFormfieldInput], textarea[mdcFormfieldInput]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcFormfieldInputDirective) }]
})
export class MdcFormfieldInputDirective extends AbstractMdcInput {
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
    selector: 'label[mdcFormfieldLabel]',
    providers: [{provide: AbstractMdcLabel, useExisting: forwardRef(() => MdcFormfieldLabelDirective) }]
})
export class MdcFormfieldLabelDirective extends AbstractMdcLabel {
    @HostBinding() @Input() for: string;

    constructor(public elementRef: ElementRef) {
        super();
    }
}

@Directive({
    selector: '[mdcFormfield]'
})
export class MdcFormfieldDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-form-field') hasHostClass = true;
    private _alignEnd = false;
    @ContentChild(AbstractMdcRipple) rippleChild: AbstractMdcRipple;
    @ContentChild(AbstractMdcInput) mdcInput: AbstractMdcInput;
    @ContentChild(AbstractMdcLabel) mdcLabel: AbstractMdcLabel;

    private mdcAdapter: MdcFormfieldAdapter = {
        registerInteractionHandler: (type: string, handler: EventListener) => {
            this.registry.listen(this.renderer, type, handler, this.root);
        },
        deregisterInteractionHandler: (type: string, handler: EventListener) => {
            this.registry.unlisten(type, handler);
        },
        activateInputRipple: () => {
            if (this.rippleChild)
                this.rippleChild.activateInputRipple();
        },
        deactivateInputRipple: () => {
            if (this.rippleChild)
                this.rippleChild.deactivateInputRipple();
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

    @Input() @HostBinding('class.mdc-form-field--align-end') get mdcAlignEnd() {
        return this._alignEnd;
    }

    set mdcAlignEnd(val: any) {
        this._alignEnd = asBoolean(val);
    }
}
