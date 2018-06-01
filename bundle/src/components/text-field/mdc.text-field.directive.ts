import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, HostBinding,
  HostListener, Input, OnDestroy, OnInit, Optional, Output, Provider, QueryList, Renderer2, Self, ViewChild,
  ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCRipple } from '@material/ripple';
import { MDCTextFieldFoundation } from '@material/textfield';
import { MDCLineRippleFoundation } from '@material/line-ripple';
import { MDCTextFieldHelperTextFoundation } from '@material/textfield/helper-text';
import { MDCTextFieldIconFoundation } from '@material/textfield/icon';
import { MDCFloatingLabelFoundation } from '@material/floating-label';
import { MdcTextFieldAdapter, MdcTextFieldIconAdapter, MdcTextFieldHelperTextAdapter } from './mdc.text-field.adapter';
import { MdcFloatingLabelAdapter } from '../floating-label/mdc.floating-label.adapter';
import { MdcFloatingLabelDirective } from '../floating-label/mdc.floating-label.directive';
import { MdcLineRippleAdapter } from '../line-ripple/mdc.line-ripple.adapter';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { AbstractMdcLabel } from '../abstract/abstract.mdc.label';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

const CLASS_LINE_RIPPLE = 'mdc-line-ripple';

let nextId = 1;

/**
 * Directive for the native input of a text-field (see <code>MdcTextFieldDirective</code>).
 * Add this as the first child to an <code>mdcTextField</code> (or as the second child
 * when you want to have a leading icon on the text-field).
 */
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

    /**
     * Mirrors the <code>id</code> attribute. If no id is assigned, this directive will
     * assign a unique id by itself. If an <code>mdcFloatingLabel</code> for this text-field
     * is available, the <code>mdcFloatingLabel</code> will automatically set its <code>for</code>
     * attribute to this <code>id</code> value.
     */
    @HostBinding()
    @Input() get id() {
        return this._id;
    }
  
    set id(value: string) {
        this._id = value || this._newId();
    }

    /**
     * If set to a value other than false, the text-field will be in disabled state.
     */
    @HostBinding()
    @Input() get disabled() {
        return this._cntr ? this._cntr.disabled : this._disabled;
    }

    set disabled(value: any) {
        this._disabled = asBoolean(value);
    }

    /** @docs-private */
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

/**
 * Directive for an optional leading or trailing icon on the text-field (see
 * <code>MdcTextFieldDirective</code>). Add this as the first child to an <code>mdcTextField</code>
 * for a leading icon, or as the last child for a trailing icon.
 */
@Directive({
    selector: '[mdcTextFieldIcon]'
})
export class MdcTextFieldIconDirective {
    @HostBinding('class.mdc-text-field__icon') _cls = true;
    _mdcAdapter: MdcTextFieldIconAdapter = {
        getAttr: (name: string) => this._el.nativeElement.getAttribute(name),
        setAttr: (name: string, value: string) => this._rndr.setAttribute(this._el.nativeElement, name, value),
        removeAttr: (name: string) => this._rndr.removeAttribute(this._el.nativeElement, name),
        setContent: (content: string) => this._el.nativeElement.textContent = content,
        registerInteractionHandler: (evtType: string, handler: EventListener) => {
            this._reg.listen(this._rndr, evtType, handler, this._el);
        },
        deregisterInteractionHandler: (evtType: string, handler: EventListener) => {
            this._reg.unlisten(evtType, handler);
        },
        notifyIconAction: () => {
            // ignored, the normal (click) event handler is already available for this in angular
        }
    };
    _foundation: {
        init: Function,
        destroy: Function
    } = new MDCTextFieldIconFoundation(this._mdcAdapter);

    constructor(private _rndr: Renderer2, public _el: ElementRef, private _reg: MdcEventRegistry) {
    }
}

/**
 * Directive for an optional helper-text to show supplemental information or validation
 * messages for an <code>mdcTextField</code>.
 * Add this just after the <code>mdcTextField</code> as a sibbling element to the
 * <code>mdcTextField</code>. Then export it as a <code>mdcHelperText</code>, and
 * assign the exported object to the <code>helperText</code> property of the
 * <code>mdcHelperText</code>. See the examples for hints on how to do this.
 */
@Directive({
    selector: '[mdcTextFieldHelperText]',
    exportAs: 'mdcHelperText'
})
export class MdcTextFieldHelperTextDirective {
    @HostBinding('class.mdc-text-field-helper-text') _cls = true;
    @HostBinding('class.mdc-text-field-helper-text--validation-msg') _validation = false;
    @HostBinding('class.mdc-text-field-helper-text--persistent') _persistent = false;
    _mdcAdapter: MdcTextFieldHelperTextAdapter = {
        addClass: (className: string) => this._rndr.addClass(this._elm.nativeElement, className),
        removeClass: (className: string) => this._rndr.removeClass(this._elm.nativeElement, className),
        hasClass: (className) => this._elm.nativeElement.classList.contains(className),
        setAttr: (name: string, value: string) => this._rndr.setAttribute(this._elm.nativeElement, name, value),
        removeAttr: (name: string) => this._rndr.removeAttribute(this._elm.nativeElement, name),
        setContent: (content: string) => {
            // helperText content can be set by simply wrapping (dynamic) content in the directive.
            // this is much more powerful than setContent, because it can also include html markup
            // therefore there is no reason to do anything with setContent
            throw new Error("MdcTextFieldHelperTextAdapter.setContent not supported");
        }
    };
    _foundation: {
        init(),
        destroy(),
        showToScreenReader(): boolean,
        setValidity(isValid: boolean)
    } = new MDCTextFieldHelperTextFoundation(this._mdcAdapter);

    constructor(private _rndr: Renderer2, public _elm: ElementRef) {
    }

    /**
     * If set to a value other than false, the helper text is treated as a
     * validation message, and only shown when the input is invalid.
     */
    @Input() set validation(value: boolean) {
        this._validation = asBoolean(value);
    }

    /**
     * If set to a value other than false, the helper text is always visible.
     * Otherwise the helper text will only be shown when the input has focus
     * (or when <code>validation</code> is set, when the input is invalid).
     */
    @Input() set persistent(value: boolean) {
        this._persistent = asBoolean(value);
    }
}

/**
 * Material design text-field. It is required to add at least an input
 * (<code>mdcTextFieldInput</code>), and a label (<code>mdcFloatingLabel</code>) as child
 * elements.
 */
@Directive({
    selector: '[mdcTextField]',
    providers: [{provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcTextFieldDirective) }]
})
export class MdcTextFieldDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-text-field') _cls = true;
    @ContentChild(MdcTextFieldIconDirective) _icon: MdcTextFieldIconDirective;
    @ContentChild(MdcTextFieldInputDirective) _input: MdcTextFieldInputDirective;
    @ContentChild(MdcFloatingLabelDirective) _label: MdcFloatingLabelDirective;
    @ContentChildren('label', {descendants: true, read: ElementRef}) _labels: QueryList<ElementRef>;
    private _helperText: MdcTextFieldHelperTextDirective;
    private _initialized = false;
    private _box = false;
    private _dense = false;
    private _bottomLineElm: HTMLElement = null;
    private _valid: boolean = null;
    private mdcLineRippleAdapter: MdcLineRippleAdapter = {
        addClass: (className: string) => this.renderer.addClass(this._bottomLineElm, className),
        removeClass: (className: string) => this.renderer.removeClass(this._bottomLineElm, className),
        hasClass: (className) => this._bottomLineElm.classList.contains(className),
        setStyle: (name: string, value: string) => this.renderer.setStyle(this._bottomLineElm, name, value),
        registerEventHandler: (evtType: string, handler: EventListener) => this.registry.listenElm(this.renderer, evtType, handler, this._bottomLineElm),
        deregisterEventHandler: (evtType: string, handler: EventListener) => this.registry.unlisten(evtType, handler)
    };
    private mdcAdapter: MdcTextFieldAdapter = {
        addClass: (className: string) => {
            this.renderer.addClass(this.root.nativeElement, className);
        },
        removeClass: (className: string) => {
            this.renderer.removeClass(this.root.nativeElement, className);
        },
        hasClass: (className) => {
            if (className === 'mdc-text-field--dense')
                return this._dense;
            return this.root.nativeElement.classList.contains(className);
        },
        registerTextFieldInteractionHandler: (evtType: string, handler: EventListener) => {
            this.registry.listen(this.renderer, evtType, handler, this.root);
        },
        deregisterTextFieldInteractionHandler: (evtType: string, handler: EventListener) => {
            this.registry.unlisten(evtType, handler);
        },
        registerInputInteractionHandler: (evtType: string, handler: EventListener) => {
            if (this._input)
                this.registry.listen(this.renderer, evtType, handler, this._input._elm);
        },
        deregisterInputInteractionHandler: (evtType: string, handler: EventListener) => {
            this.registry.unlisten(evtType, handler);
        },
        registerValidationAttributeChangeHandler: (handler: (arg: Array<any>) => void) => {
            const getAttributesList = (mutationsList) => mutationsList.map((mutation) => mutation.attributeName);
            const observer = new MutationObserver((mutationsList) => handler(getAttributesList(mutationsList)));
            observer.observe(this._input._elm.nativeElement, {attributes: true});
            return observer;
        },
        deregisterValidationAttributeChangeHandler: (observer: MutationObserver) => observer.disconnect(),
        getNativeInput: () => {
            return {
                value: this._input.value,
                disabled: this._input.disabled,
                validity: {
                    valid: this._valid == null ? this._input.valid : !!this._valid,
                    badInput: this._input._isBadInput()
                }
            };
        },
        isFocused: () => this._input && this._input._focused,
        isRtl: () => getComputedStyle(this.root.nativeElement).getPropertyValue('direction') === 'rtl',
        activateLineRipple: () => this.bottomLineFoundation.activate(),
        deactivateLineRipple: () => this.bottomLineFoundation.deactivate(),
        setLineRippleTransformOrigin: (normalizedX: number) => this.bottomLineFoundation.setRippleCenter(normalizedX),
        shakeLabel: (shouldShake: boolean) => this._label._foundation.shake(shouldShake),
        floatLabel: (shouldFloat: boolean) => this._label._foundation.float(shouldFloat),
        hasLabel: () => !!this._label,
        getLabelWidth: () => this._label._foundation.getWidth()
    };
    private bottomLineFoundation: {
        init: Function,
        destroy: Function,
        activate: Function,
        deactivate: Function,
        setRippleCenter: (x: number) => void
    } = new MDCLineRippleFoundation(this.mdcLineRippleAdapter);
    private foundation: {
        init: Function,
        destroy: Function,
        useCustomValidityChecking_: boolean,
        setValid(isValid: boolean),
        changeValidity_(isValid: boolean)
    };

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry) {
        super(root, renderer, registry);
    }

    ngAfterContentInit() {
        if (this._label && this._input && !this._label.for)
            this._label.for = this._input.id;
        this._initialized = true;
        this._bottomLineElm = this.renderer.createElement('div');
        this.renderer.addClass(this._bottomLineElm, CLASS_LINE_RIPPLE);
        this.renderer.appendChild(this.root.nativeElement, this._bottomLineElm);
        this.initBox();
        this.foundation = new MDCTextFieldFoundation(this.mdcAdapter, {
            lineRipple: this.bottomLineFoundation,
            helperText: this.helperText ? this.helperText._foundation : undefined,
            icon: this._icon ? this._icon._foundation : undefined,
            label: this._label ? this._label._foundation : undefined
        });
        if (this._helperText)
            this._helperText._foundation.init();
        if (this._icon)
            this._icon._foundation.init();
        if (this._label && !this._label._initialized)
            throw new Error('mdcFloatingLabel initialized after parent mdcTextField')
        this.bottomLineFoundation.init();
        this.foundation.init();
        // TODO: we should actually reassign this if mdcInput changes, eg via ngContentChanges hook
        if (this._input)
            this._input._onChange = (value) => {
                if (this._input && this._label && !this._input._focused) {
                    // programmatic changes to the input value are not seen by the foundation,
                    // but some states should be updated with the new value:
                    this._label._foundation.float(value != null && value.toString().length !== 0);
                }
            }
    }

    ngOnDestroy() {
        this.destroyRipple();
        if (this._helperText)
            this._helperText._foundation.destroy();
        if (this._helperText)
            this._helperText._foundation.destroy();
        if (this._icon)
            this._icon._foundation.destroy();
        this.bottomLineFoundation.destroy();
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
     * The <code>valid</code> property provides a way to override the validity checking of the
     * underlying angular form control or native input. A value of true or false will make the
     * text-field validity styling based on this value. A value of <code>null</code>, or
     * <code>undefined</code> will reset the validity styling to the state of the underlying
     * angular form control or native input.
     * </p><p>
     * For most use cases messing with this input is not be needed.
     * When the input/textarea is an ngControl, the mdcTextField is already aware of that,
     * and is already using the 'valid' property of that control.
     * However, in some specific cases, binding to <code>valid</code> can help. Example:
     * When you want the mdcTextField to go to 'invalid' state only when the underlying
     * control is invalid AND that control's value is changed, you can bind as follows:
     * <code>valid="myControl.valid || !myControl.dirty"</code>.
     */
    @Input() set valid(value: boolean) {
        if (value == null) {
            this._valid = null; // reset to null, validity now managed by the input control.
            this.foundation.useCustomValidityChecking_ = false;
            this.foundation.changeValidity_(this.mdcAdapter.getNativeInput().validity.valid);
        } else if (value !== this._valid) {
            this._valid = asBoolean(value);
            this.foundation.setValid(this._valid);
        }
    }

    @HostBinding('class.mdc-text-field--textarea') get _textArea(): boolean {
        return this._input._isTextarea();
    }

    /**
     * When this input is set to a value other than false, the text-field will be styled
     * as a box, and the box will get a ripple animation on click.
     */
    @HostBinding('class.mdc-text-field--box') @Input()
    get box() {
        return this._box;
    }

    set box(val: any) {
        this._box = asBoolean(val);
        this.initBox();
    }

    @HostBinding('class.mdc-text-field--with-leading-icon') get _leadingIcon(): boolean {
        return this._icon && !this._icon._el.nativeElement.previousElementSibling;
    }

    @HostBinding('class.mdc-text-field--with-trailing-icon') get _trailingIcon(): boolean {
        return this._icon && this._icon._el.nativeElement.previousElementSibling;
    }

    /**
     * When this property is defined and does not have value false, the text-field will be styled more
     * compact.
     */
    @HostBinding('class.mdc-text-field--dense') @Input()
    get dense() {
        return this._dense;
    }

    set dense(val: any) {
        this._dense = asBoolean(val);
    }

    /**
     * Assign an <code>mdcTextFieldHelperText</code> (exported as <code>mdcHelperText</code>) to this
     * input to add a helper-text or validation message to the textfield. See the examples for hints
     * on how to do this.
     */
    @Input() get helperText(): MdcTextFieldHelperTextDirective {
        return this._helperText;
    }

    set helperText(helperText: MdcTextFieldHelperTextDirective) {
        if (this._initialized)
            throw new Error("Changing the helperText input of an mdcTextField after initialization is not allowed. " +
                "Change the content of the mdcTextFieldHelperText instead.")
        this._helperText = helperText;
    }

    @HostBinding('class.mdc-text-field--disabled') get _disabled() {
        // TODO: this mirrors what the text-field can update itself from adapter.getNativeInput
        //  is there a way to trigger the textfield to re-read that when the disabled state of
        //  the input changes?
        return this._input ? this._input.disabled : false;
    }
}
