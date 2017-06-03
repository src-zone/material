import { AfterViewInit, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, HostBinding,
  HostListener, Input, OnDestroy, OnInit, Optional, Output, Provider, QueryList, Renderer2, Self, ViewChild,
  ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCTextfieldFoundation } from '@material/textfield';
import { MdcTextfieldAdapter } from './mdc.textfield.adapter';
import { AbstractMdcInput, AbstractMdcLabel } from '../abstract';
import { asBoolean, MdcEventRegistry } from '../../utils';

let nextId = 1;

@Directive({
    selector: 'input[mdcTextfieldInput], textarea[mdcTextfieldInput]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcTextfieldInputDirective) }]
})
export class MdcTextfieldInputDirective extends AbstractMdcInput implements OnInit {
    private _id: string;
    private _type = 'text';
    private _disabled = false;
    private _required = false;
    private cachedId: string;
    private focused = false;
    @HostBinding('class.mdc-textfield__input') hasHostClass = true;

    constructor(public elementRef: ElementRef, private renderer: Renderer2, @Optional() @Self() public ngControl: NgControl) {
        super();
    }

    ngOnInit() {
        // Force setter to be called in case id was not specified.
        this.id = this.id;
    }

    @HostBinding()
    @Input() get id() {
        return this._id;
    }
  
    set id(value: string) {
        this._id = value || this.newId();
    }

    @HostBinding()
    @Input() get disabled() {
        return this.ngControl ? this.ngControl.disabled : this._disabled;
    }

    set disabled(value: any) {
        this._disabled = value != null && `${value}` !== 'false';
    }

    @HostBinding()
    @Input() get required() {
        return this._required;
    }
    
    set required(value: any) {
        this._required = value != null && `${value}` !== 'false';
    }

    @Input() get type() {
        return this._type;
    }

    set type(value: string) {
        this._type = value || 'text';

        // Angular Input is not automatically set on the native input element:
        if (!this.isTextarea()) {
            try {
                this.renderer.setProperty(this.elementRef.nativeElement, 'type', this._type);
            } catch (e) {
                (<any>this.renderer).setElementProperty(this.elementRef.nativeElement, 'type', this._type);
            }
        }
    }

    get value() {
        return this.elementRef.nativeElement.value;
    }

    set value(value: string) {
        this.elementRef.nativeElement.value = value;
    }

    focus() {
        this.elementRef.nativeElement.focus();
    }

    @HostListener('focus') onFocus() {
        this.focused = true;
    }

    @HostListener('blur') onBlur() {
       this.focused = false;
    }

    @HostListener('input') onInput() {
        // Having a listener for input changes forces a change detection for each 'input' event.
        // Necessary in some edge cases.
    }

    get valid(): boolean {
        return this.ngControl ? this.ngControl.valid : (this.elementRef.nativeElement as HTMLInputElement).validity.valid;
    }

    isBadInput() {
        return (this.elementRef.nativeElement as HTMLInputElement).validity.badInput;
    }

    isTextarea() {
        return this.elementRef.nativeElement.nodeName.toLowerCase() === 'textarea';
    }

    newId(): string {
        this.cachedId = this.cachedId || `mdc-input-${nextId++}`;
        return this.cachedId;
    }
}

@Directive({
    selector: 'label[mdcTextfieldLabel]',
    providers: [{provide: AbstractMdcLabel, useExisting: forwardRef(() => MdcTextfieldLabelDirective) }]
})
export class MdcTextfieldLabelDirective extends AbstractMdcLabel {
    @HostBinding() for: string;
    @HostBinding('class.mdc-textfield__label') hasHostClass = true;

    constructor(public elementRef: ElementRef) {
        super();
    }
}

@Directive({
    selector: '[mdcTextfieldHelptext]',
    exportAs: 'mdcHelptext'
})
export class MdcTextfieldHelptextDirective {
    @HostBinding('class.mdc-textfield-helptext') hasHostClass = true;
    @HostBinding('class.mdc-textfield-helptext--validation-msg') _mdcValidation = false;
    @HostBinding('class.mdc-textfield-helptext--persistent') _mdcPersistent = false;
    @Input() mdcForceShow = false; // TODO boolean coercion

    constructor(public elementRef: ElementRef) {
    }

    @Input() set mdcValidation(value: boolean) {
        this._mdcValidation = value != null && `${value}` !== 'false';
    }

    @Input() set mdcPersistent(value: boolean) {
        this._mdcPersistent = value != null && `${value}` !== 'false';
    }
}

@Directive({
    selector: '[mdcTextfield]'
})
export class MdcTextfieldDirective implements OnInit, OnDestroy {
    @HostBinding('class.mdc-textfield') hasHostClass = true;
    @ContentChild(MdcTextfieldInputDirective) mdcInput: MdcTextfieldInputDirective;
    @ContentChild(MdcTextfieldLabelDirective) mdcLabel: MdcTextfieldLabelDirective;
    @ContentChildren('label', {descendants: true, read: ElementRef}) labels: QueryList<ElementRef>;
    @Input() mdcHelptext: MdcTextfieldHelptextDirective;
    private valid: boolean = null;
    private mdcAdapter: MdcTextfieldAdapter = {
        addClass: (className: string) => {
            this.renderer.addClass(this.root.nativeElement, className);
        },
        removeClass: (className: string) => {
            this.renderer.removeClass(this.root.nativeElement, className);
        },
        addClassToLabel: (className: string) => {
            if (this.mdcLabel)
                this.renderer.addClass(this.mdcLabel.elementRef.nativeElement, className);
        },
        removeClassFromLabel: (className: string) => {
            if (this.mdcLabel)
                this.renderer.removeClass(this.mdcLabel.elementRef.nativeElement, className);
        },
        addClassToHelptext: (className: string) => {
            if (this.mdcHelptext)
                this.renderer.addClass(this.mdcHelptext.elementRef.nativeElement, className);
        },
        removeClassFromHelptext: (className: string) => {
            if (this.mdcHelptext)
                this.renderer.removeClass(this.mdcHelptext.elementRef.nativeElement, className);
        },
        helptextHasClass: (className: string) => {
            if (this.mdcHelptext)
                return this.mdcHelptext.elementRef.nativeElement.classList.contains(className);
        },
        setHelptextAttr: (name: string, value: string) => {
            if (this.mdcHelptext)
                this.renderer.setAttribute(this.mdcHelptext.elementRef.nativeElement, name, value);
        },
        removeHelptextAttr: (name: string) => {
            if (this.mdcHelptext)
                this.renderer.removeAttribute(this.mdcHelptext.elementRef.nativeElement, name);
        },
        registerInputFocusHandler: (handler: EventListener) => {
            if (this.mdcInput)
                this.registry.listen(this.renderer, 'focus', handler, this.mdcInput.elementRef);
        },
        deregisterInputFocusHandler: (handler: EventListener) => {
            this.registry.unlisten('focus', handler);
        },
        registerInputBlurHandler: (handler: EventListener) => {
            if (this.mdcInput)
                this.registry.listen(this.renderer, 'blur', handler, this.mdcInput.elementRef);
        },
        deregisterInputBlurHandler: (handler: EventListener) => {
            this.registry.unlisten('blur', handler);
        },
        registerInputInputHandler: (handler: EventListener) => {
            if (this.mdcInput)
                this.registry.listen(this.renderer, 'input', handler, this.mdcInput.elementRef);
        },
        deregisterInputInputHandler: (handler: EventListener) => {
            this.registry.unlisten('input', handler);
        },
        registerInputKeydownHandler: (handler: EventListener) => {
            if (this.mdcInput)
                this.registry.listen(this.renderer, 'keydown', handler, this.mdcInput.elementRef);
        },
        deregisterInputKeydownHandler: (handler: EventListener) => {
            this.registry.unlisten('keydown', handler);
        },
        getNativeInput: () => {
            return {
                checkValidity: () => this.valid == null ? this.mdcInput.valid : !!this.valid,
                value: this.mdcInput.value,
                disabled: this.mdcInput.disabled,
                badInput: this.mdcInput.isBadInput()
            };
        }
    };
    private foundation: { init: Function, destroy: Function } = new MDCTextfieldFoundation(this.mdcAdapter);

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry) {
    }

    ngOnInit() {
        if (this.mdcLabel && this.mdcInput && !this.mdcLabel.for)
            this.mdcLabel.for = this.mdcInput.id;
        this.foundation.init();
    }

    ngOnDestroy() {
        this.foundation.destroy();
    }

    /**
     * When binding to 'mdcValid', the value will determine the valid state of the input,
     * instead of it being managed by the underlying input element directly.
     * For most use cases this is not needed. When the input/textarea is an ngControl,
     * the mdcTextfield is already aware of that, and is already using the 'valid'
     * property of that control.
     * <p>
     * However, in some specific cases, binding to mdcValid can help. Example:
     * When you want the mdcTextfield to go to  'invalid' state only when the underlying
     * control is invalid AND that control is touched, you can bind as follows:
     * <code>mdcValid="myControl.valid || !myControl.touched"</code>.
     */
    @Input() set mdcValid(value: boolean) {
        let isValid = null;
        if (value == null) {
            this.valid = null; // reset to null, validity now managed by the input control.
            isValid = this.mdcAdapter.getNativeInput().checkValidity();
        } else if (value !== this.valid)
            this.valid = isValid = asBoolean(value);
        if (isValid)
            this.renderer.removeClass(this.root.nativeElement, 'mdc-textfield--invalid');
        else
            this.renderer.addClass(this.root.nativeElement, 'mdc-textfield--invalid');
    }

    @HostBinding('class.mdc-textfield--multiline') get mdcMultiline(): boolean {
        return this.mdcInput.isTextarea();
    }
}
