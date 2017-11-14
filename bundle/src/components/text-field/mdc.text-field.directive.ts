import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, HostBinding,
  HostListener, Input, OnDestroy, OnInit, Optional, Output, Provider, QueryList, Renderer2, Self, ViewChild,
  ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCRipple } from '@material/ripple';
import { MDCTextFieldFoundation } from '@material/textfield';
import { MdcTextFieldAdapter } from './mdc.text-field.adapter';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { AbstractMdcLabel } from '../abstract/abstract.mdc.label';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

const CLASS_BOTTOM_LINE = 'mdc-text-field__bottom-line';

let nextId = 1;

@Directive({
    selector: 'input[mdcTextFieldInput], textarea[mdcTextFieldInput]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcTextFieldInputDirective) }]
})
export class MdcTextFieldInputDirective extends AbstractMdcInput implements OnInit {
    _onChange = (value) => {};
    private _id: string;
    private _type = 'text';
    private _disabled = false;
    private _required = false;
    private cachedId: string;
    _focused = false;
    @HostBinding('class.mdc-text-field__input') _hostClass = true;

    constructor(public _elm: ElementRef, private renderer: Renderer2, @Optional() @Self() public _cntr: NgControl) {
        super();
    }

    ngOnInit() {
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        if (this._cntr) {
            this._cntr.valueChanges.subscribe(value => {
                this._onChange(value);
            });
        }
    }

    @HostBinding()
    @Input() get id() {
        return this._id;
    }
  
    set id(value: string) {
        this._id = value || this._newId();
    }

    @HostBinding()
    @Input() get disabled() {
        return this._cntr ? this._cntr.disabled : this._disabled;
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
        if (!this._isTextarea()) {
            try {
                this.renderer.setProperty(this._elm.nativeElement, 'type', this._type);
            } catch (e) {
                (<any>this.renderer).setElementProperty(this._elm.nativeElement, 'type', this._type);
            }
        }
    }

    /** @docs-private */
    get value() {
        return this._elm.nativeElement.value;
    }

    /** @docs-private */
    set value(value: string) {
        this._elm.nativeElement.value = value;
        this._onChange(value);
    }

    /** @docs-private */
    focus() {
        this._elm.nativeElement.focus();
    }

    @HostListener('focus') _onFocus() {
        this._focused = true;
    }

    @HostListener('blur') _onBlur() {
       this._focused = false;
    }

    @HostListener('input') _onInput() {
        // Having a listener for input changes forces a change detection for each 'input' event.
        // Necessary in some edge cases.
    }

    /** @docs-private */
    get valid(): boolean {
        return this._cntr ? this._cntr.valid : (this._elm.nativeElement as HTMLInputElement).validity.valid;
    }

    _isBadInput() {
        return (this._elm.nativeElement as HTMLInputElement).validity.badInput;
    }

    _isTextarea() {
        return this._elm.nativeElement.nodeName.toLowerCase() === 'textarea';
    }

    _newId(): string {
        this.cachedId = this.cachedId || `mdc-input-${nextId++}`;
        return this.cachedId;
    }
}

@Directive({
    selector: '[mdcTextFieldIcon]'
})
export class MdcTextFieldIconDirective {
    @HostBinding('class.mdc-text-field__icon') _cls = true;

    constructor(public _el: ElementRef) {
    }
}

@Directive({
    selector: 'label[mdcTextFieldLabel]',
    providers: [{provide: AbstractMdcLabel, useExisting: forwardRef(() => MdcTextFieldLabelDirective) }]
})
export class MdcTextFieldLabelDirective extends AbstractMdcLabel {
    /** @docs-private */
    @HostBinding() for: string;
    @HostBinding('class.mdc-text-field__label') _cls = true;

    constructor(public _elm: ElementRef) {
        super();
    }
}

@Directive({
    selector: '[mdcTextFieldHelptext]',
    exportAs: 'mdcHelptext'
})
export class MdcTextFieldHelptextDirective {
    @HostBinding('class.mdc-text-field-helptext') _cls = true;
    @HostBinding('class.mdc-text-field-helptext--validation-msg') _isValidation = false;
    @HostBinding('class.mdc-text-field-helptext--persistent') _isPersistent = false;
    @Input() forceShow = false; // TODO boolean coercion

    constructor(public _elm: ElementRef) {
    }

    @Input() set isValidation(value: boolean) {
        this._isValidation = value != null && `${value}` !== 'false';
    }

    @Input() set isPersistent(value: boolean) {
        this._isPersistent = value != null && `${value}` !== 'false';
    }
}

@Directive({
    selector: '[mdcTextField]',
    providers: [{provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcTextFieldDirective) }]
})
export class MdcTextFieldDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-text-field') _cls = true;
    @ContentChild(MdcTextFieldIconDirective) _icon: MdcTextFieldIconDirective;
    @ContentChild(MdcTextFieldInputDirective) _input: MdcTextFieldInputDirective;
    @ContentChild(MdcTextFieldLabelDirective) _label: MdcTextFieldLabelDirective;
    @ContentChildren('label', {descendants: true, read: ElementRef}) _labels: QueryList<ElementRef>;
    @Input() helptext: MdcTextFieldHelptextDirective;
    private _initialized = false;
    private _box = false;
    private _dense = false;
    private _bottomLineElm: HTMLElement = null;
    private valid: boolean = null;
    private mdcAdapter: MdcTextFieldAdapter = {
        addClass: (className: string) => {
            this.renderer.addClass(this.root.nativeElement, className);
        },
        removeClass: (className: string) => {
            this.renderer.removeClass(this.root.nativeElement, className);
        },
        addClassToLabel: (className: string) => {
            if (this._label)
                this.renderer.addClass(this._label._elm.nativeElement, className);
        },
        removeClassFromLabel: (className: string) => {
            if (this._label)
                this.renderer.removeClass(this._label._elm.nativeElement, className);
        },
        setIconAttr: (name: string, value: string) => {
            if (this._icon)
                this._icon._el.nativeElement.setAttribute(name, value);
        },
        eventTargetHasClass: (target: HTMLElement, className: string) => {
            return target.classList.contains(className);
        },
        registerTextFieldInteractionHandler: (evtType: string, handler: EventListener) => {
            this.registry.listen(this.renderer, evtType, handler, this.root);
        },
        deregisterTextFieldInteractionHandler: (evtType: string, handler: EventListener) => {
            this.registry.unlisten(evtType, handler);
        },
        notifyIconAction: () => {
            // TODO
        },
        addClassToBottomLine: (className: string) => {
            if (this._bottomLineElm)
                this.renderer.addClass(this._bottomLineElm, className);
        },
        removeClassFromBottomLine: (className: string) => {
            if (this._bottomLineElm)
                this.renderer.removeClass(this._bottomLineElm, className);
        },
        addClassToHelptext: (className: string) => {
            if (this.helptext)
                this.renderer.addClass(this.helptext._elm.nativeElement, className);
        },
        removeClassFromHelptext: (className: string) => {
            if (this.helptext)
                this.renderer.removeClass(this.helptext._elm.nativeElement, className);
        },
        helptextHasClass: (className: string) => {
            if (this.helptext)
                return this.helptext._elm.nativeElement.classList.contains(className);
        },
        registerInputInteractionHandler: (evtType: string, handler: EventListener) => {
            if (this._input)
                this.registry.listen(this.renderer, evtType, handler, this._input._elm);
        },
        deregisterInputInteractionHandler: (evtType: string, handler: EventListener) => {
            this.registry.unlisten(evtType, handler);
        },
        registerTransitionEndHandler: (handler: EventListener) => {
            if (this._bottomLineElm)
                this.registry.listenElm(this.renderer, 'transitionend', handler, this._bottomLineElm);
        },
        deregisterTransitionEndHandler: (handler: EventListener) => {
            this.registry.unlisten('transitionend', handler);
        },
        setBottomLineAttr: (attr: string, value: string) => {
            if (this._bottomLineElm)
                this._bottomLineElm.setAttribute(attr, value);
        },
        setHelptextAttr: (name: string, value: string) => {
            if (this.helptext)
                this.renderer.setAttribute(this.helptext._elm.nativeElement, name, value);
        },
        removeHelptextAttr: (name: string) => {
            if (this.helptext)
                this.renderer.removeAttribute(this.helptext._elm.nativeElement, name);
        },
        getNativeInput: () => {
            return {
                checkValidity: () => this.valid == null ? this._input.valid : !!this.valid,
                value: this._input.value,
                disabled: this._input.disabled,
                badInput: this._input._isBadInput()
            };
        }
    };
    private foundation: {
        init: Function,
        destroy: Function,
        useCustomValidityChecking_: boolean,
        setValid(isValid: boolean),
        changeValidity_(isValid: boolean)
    } = new MDCTextFieldFoundation(this.mdcAdapter);

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry) {
        super(root, renderer, registry);
    }

    ngAfterContentInit() {
        if (this._label && this._input && !this._label.for)
            this._label.for = this._input.id;
        this._initialized = true;
        this._bottomLineElm = this.renderer.createElement('div');
        this.renderer.addClass(this._bottomLineElm, CLASS_BOTTOM_LINE);
        this.renderer.appendChild(this.root.nativeElement, this._bottomLineElm);
        this.initBox();
        this.foundation.init();
        // TODO: we should actually reassign this if mdcInput changes, eg via ngContentChanges hook
        if (this._input)
            this._input._onChange = (value) => {
                if (this._input && !this._input._focused) {
                    // programmatic changes to the input value are not seen by the foundation,
                    // but some states should be updated with the new value:
                    if (value == null || value.toString().length === 0)
                        this.mdcAdapter.removeClassFromLabel('mdc-text-field__label--float-above');
                    else
                        this.mdcAdapter.addClassToLabel('mdc-text-field__label--float-above');
                }
            }
    }

    ngOnDestroy() {
        this.destroyRipple();
        this.foundation.destroy();
        this._input._onChange = (value) => {};
    }

    private initBox() {
        if (this._box != !!this.isRippleInitialized()) {
            if (this._box)
                this.initRipple();
            else
                this.destroyRipple();
        }
    }

    /**
     * When binding to 'isValid', the value will determine the valid state of the input,
     * instead of it being managed by the underlying input element directly.
     * For most use cases this is not needed. When the input/textarea is an ngControl,
     * the mdcTextField is already aware of that, and is already using the 'valid'
     * property of that control.
     * <p>
     * However, in some specific cases, binding to isValid can help. Example:
     * When you want the mdcTextField to go to  'invalid' state only when the underlying
     * control is invalid AND that control is touched, you can bind as follows:
     * <code>isValid="myControl.valid || !myControl.touched"</code>.
     */
    @Input() set isValid(value: boolean) {
        if (value == null) {
            this.valid = null; // reset to null, validity now managed by the input control.
            this.foundation.useCustomValidityChecking_ = false;
            this.foundation.changeValidity_(this.mdcAdapter.getNativeInput().checkValidity());
        } else if (value !== this.valid) {
            this.valid = asBoolean(value);
            this.foundation.setValid(this.valid);
        }
    }

    @HostBinding('class.mdc-text-field--textarea') get _textArea(): boolean {
        return this._input._isTextarea();
    }

    @HostBinding('class.mdc-text-field--box') @Input()
    get boxed() {
        return this._box;
    }

    @HostBinding('class.mdc-text-field--with-leading-icon') get _leadingIcon(): boolean {
        return this._icon && !this._icon._el.nativeElement.previousElementSibling;
    }

    @HostBinding('class.mdc-text-field--with-trailing-icon') get _trailingIcon(): boolean {
        return this._icon && this._icon._el.nativeElement.previousElementSibling;
    }

    set boxed(val: any) {
        this._box = asBoolean(val);
        this.initBox();
    }

    @HostBinding('class.mdc-text-field--dense') @Input()
    get dense() {
        return this._dense;
    }

    set dense(val: any) {
        this._dense = asBoolean(val);
    }
}
