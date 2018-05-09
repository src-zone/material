import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, HostBinding,
  HostListener, Input, OnDestroy, OnInit, Optional, Output, Provider, QueryList, Renderer2, Self, ViewChild,
  ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCRipple } from '@material/ripple';
import { MDCTextFieldFoundation } from '@material/textfield';
import { MDCTextFieldBottomLineFoundation } from '@material/textfield/bottom-line';
import { MDCTextFieldHelperTextFoundation } from '@material/textfield/helper-text';
import { MdcTextFieldAdapter, MdcTextFieldBottomLineAdapter, MdcTextFieldHelperTextAdapter } from './mdc.text-field.adapter';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { AbstractMdcLabel } from '../abstract/abstract.mdc.label';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

const CLASS_BOTTOM_LINE = 'mdc-text-field__bottom-line';

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
     * assign a unique id by itself. If an <code>mdcTextFielLabel</code> for this text-field
     * is available, the <code>mdcTextFieldLabel</code> will automatically set its <code>for</code>
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

    constructor(public _el: ElementRef) {
    }
}

/**
 * Directive for the label of a text-field (see <code>MdcTextFieldDirective</code>).
 * Add this just after the <code>mdcTextFieldInput</code> as a direct child of an
 * <code>mdcTextField</code>. There is no need to assign the <code>for</code>
 * attribute, the label will automatically get its for attribute assigned to the
 * id of the <code>mdcInput</code>.
 */
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
 * (<code>mdcTextFieldInput</code>), and alabel (<code>mdcTextFieldLabel</code>) as child
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
    @ContentChild(MdcTextFieldLabelDirective) _label: MdcTextFieldLabelDirective;
    @ContentChildren('label', {descendants: true, read: ElementRef}) _labels: QueryList<ElementRef>;
    /**
     * Event emitted when the bottom line has finished the activate or deactivate animation. 
     */
    @Output() bottomLineAnimationEnd: EventEmitter<void> = new EventEmitter<void>();
    private _helperText: MdcTextFieldHelperTextDirective;
    private _initialized = false;
    private _box = false;
    private _dense = false;
    private _bottomLineElm: HTMLElement = null;
    private _valid: boolean = null;
    private mdcBottomLineAdapter: MdcTextFieldBottomLineAdapter = {
        addClass: (className: string) => this.renderer.addClass(this._bottomLineElm, className),
        removeClass: (className: string) => this.renderer.removeClass(this._bottomLineElm, className),
        setAttr: (name: string, value: string) => this.renderer.setAttribute(this._bottomLineElm, name, value),
        registerEventHandler: (evtType: string, handler: EventListener) => this.registry.listenElm(this.renderer, evtType, handler, this._bottomLineElm),
        deregisterEventHandler: (evtType: string, handler: EventListener) => this.registry.unlisten(evtType, handler),
        notifyAnimationEnd: () => this.bottomLineAnimationEnd.emit()
    };
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
                this.renderer.setAttribute(this._icon._el.nativeElement, name, value);
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
            // ignored, the normal (click) event handler is already available for this in angular
        },
        registerInputInteractionHandler: (evtType: string, handler: EventListener) => {
            if (this._input)
                this.registry.listen(this.renderer, evtType, handler, this._input._elm);
        },
        deregisterInputInteractionHandler: (evtType: string, handler: EventListener) => {
            this.registry.unlisten(evtType, handler);
        },
        registerBottomLineEventHandler: (evtType: string, handler: EventListener) => {
            if (this._bottomLineElm)
                this.registry.listenElm(this.renderer, evtType, handler, this._bottomLineElm);
        },
        deregisterBottomLineEventHandler: (evtType: string, handler: EventListener) => {
             this.registry.unlisten(evtType, handler);
        },
        getNativeInput: () => {
            return {
                checkValidity: () => this._valid == null ? this._input.valid : !!this._valid,
                value: this._input.value,
                disabled: this._input.disabled,
                badInput: this._input._isBadInput()
            };
        }
    };
    private bottomLineFoundation: {
        init: Function,
        destroy: Function,
        activate: Function,
        deactivate: Function
    } = new MDCTextFieldBottomLineFoundation(this.mdcBottomLineAdapter);
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
        this.renderer.addClass(this._bottomLineElm, CLASS_BOTTOM_LINE);
        this.renderer.appendChild(this.root.nativeElement, this._bottomLineElm);
        this.initBox();
        this.foundation = new MDCTextFieldFoundation(this.mdcAdapter, {
            bottomLine: this.bottomLineFoundation,
            helperText: this.helperText ? this.helperText._foundation : undefined
        });
        if (this._helperText)
            this._helperText._foundation.init();
        this.bottomLineFoundation.init();
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
        if (this._helperText)
            this._helperText._foundation.destroy();
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
            this.foundation.changeValidity_(this.mdcAdapter.getNativeInput().checkValidity());
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
