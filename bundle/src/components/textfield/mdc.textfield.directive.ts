import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, HostBinding,
  HostListener, Input, OnDestroy, OnInit, Optional, Output, Provider, QueryList, Renderer2, Self, ViewChild,
  ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';
import { MDCRipple } from '@material/ripple';
import { MDCTextfieldFoundation } from '@material/textfield';
import { MdcTextfieldAdapter } from './mdc.textfield.adapter';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { AbstractMdcLabel } from '../abstract/abstract.mdc.label';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

const CLASS_BOTTOM_LINE = 'mdc-textfield__bottom-line';

let nextId = 1;

@Directive({
    selector: 'input[mdcTextfieldInput], textarea[mdcTextfieldInput]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcTextfieldInputDirective) }]
})
export class MdcTextfieldInputDirective extends AbstractMdcInput implements OnInit {
    _onChange = (value) => {};
    private _id: string;
    private _type = 'text';
    private _disabled = false;
    private _required = false;
    private cachedId: string;
    _focused = false;
    @HostBinding('class.mdc-textfield__input') _hostClass = true;

    constructor(public elementRef: ElementRef, private renderer: Renderer2, @Optional() @Self() public ngControl: NgControl) {
        super();
    }

    ngOnInit() {
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        if (this.ngControl) {
            this.ngControl.valueChanges.subscribe(value => {
                this._onChange(value);
            });
        }
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
        this._onChange(value);
    }

    focus() {
        this.elementRef.nativeElement.focus();
    }

    @HostListener('focus') onFocus() {
        this._focused = true;
    }

    @HostListener('blur') onBlur() {
       this._focused = false;
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
    selector: '[mdcTextfieldIcon]'
})
export class MdcTextfieldIconDirective {
    @HostBinding('class.mdc-textfield__icon') _hasHostClass = true;

    constructor(public _el: ElementRef) {
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
    selector: '[mdcTextfield]',
    providers: [{provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcTextfieldDirective) }]
})
export class MdcTextfieldDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-textfield') hasHostClass = true;
    @ContentChild(MdcTextfieldIconDirective) mdcTextfieldIcon: MdcTextfieldIconDirective;
    @ContentChild(MdcTextfieldInputDirective) mdcInput: MdcTextfieldInputDirective;
    @ContentChild(MdcTextfieldLabelDirective) mdcLabel: MdcTextfieldLabelDirective;
    @ContentChildren('label', {descendants: true, read: ElementRef}) labels: QueryList<ElementRef>;
    @Input() mdcHelptext: MdcTextfieldHelptextDirective;
    private _initialized = false;
    private _box = false;
    private _dense = false;
    private _bottomLineElm: HTMLElement = null;
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
        setIconAttr: (name: string, value: string) => {
            if (this.mdcTextfieldIcon)
                this.mdcTextfieldIcon._el.nativeElement.setAttribute(name, value);
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
        registerInputInteractionHandler: (evtType: string, handler: EventListener) => {
            if (this.mdcInput)
                this.registry.listen(this.renderer, evtType, handler, this.mdcInput.elementRef);
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
            if (this.mdcHelptext)
                this.renderer.setAttribute(this.mdcHelptext.elementRef.nativeElement, name, value);
        },
        removeHelptextAttr: (name: string) => {
            if (this.mdcHelptext)
                this.renderer.removeAttribute(this.mdcHelptext.elementRef.nativeElement, name);
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
    private foundation: {
        init: Function,
        destroy: Function,
        useCustomValidityChecking_: boolean,
        setValid(isValid: boolean),
        changeValidity_(isValid: boolean)
    } = new MDCTextfieldFoundation(this.mdcAdapter);

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry) {
        super(root, renderer, registry);
    }

    ngAfterContentInit() {
        if (this.mdcLabel && this.mdcInput && !this.mdcLabel.for)
            this.mdcLabel.for = this.mdcInput.id;
        this._initialized = true;
        this._bottomLineElm = this.renderer.createElement('div');
        this.renderer.addClass(this._bottomLineElm, CLASS_BOTTOM_LINE);
        this.renderer.appendChild(this.root.nativeElement, this._bottomLineElm);
        this.initBox();
        this.foundation.init();
        // TODO: we should actually reassign this if mdcInput changes, eg via ngContentChanges hook
        if (this.mdcInput)
            this.mdcInput._onChange = (value) => {
                if (this.mdcInput && !this.mdcInput._focused) {
                    // programmatic changes to the input value are not seen by the foundation,
                    // but some states should be updated with the new value:
                    if (value == null || value.toString().length === 0)
                        this.mdcAdapter.removeClassFromLabel('mdc-textfield__label--float-above');
                    else
                        this.mdcAdapter.addClassToLabel('mdc-textfield__label--float-above');
                }
            }
    }

    ngOnDestroy() {
        this.destroyRipple();
        this.foundation.destroy();
        this.mdcInput._onChange = (value) => {};
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
        if (value == null) {
            this.valid = null; // reset to null, validity now managed by the input control.
            this.foundation.useCustomValidityChecking_ = false;
            this.foundation.changeValidity_(this.mdcAdapter.getNativeInput().checkValidity());
        } else if (value !== this.valid) {
            this.valid = asBoolean(value);
            this.foundation.setValid(this.valid);
        }
    }

    @HostBinding('class.mdc-textfield--textarea') get mdcTexterea(): boolean {
        return this.mdcInput.isTextarea();
    }

    @HostBinding('class.mdc-textfield--box') @Input()
    get mdcBox() {
        return this._box;
    }

    @HostBinding('class.mdc-textfield--with-leading-icon') get mdcLeadingIcon(): boolean {
        return this.mdcTextfieldIcon && !this.mdcTextfieldIcon._el.nativeElement.previousElementSibling;
    }

    @HostBinding('class.mdc-textfield--with-trailing-icon') get mdcTrailingIcon(): boolean {
        return this.mdcTextfieldIcon && this.mdcTextfieldIcon._el.nativeElement.previousElementSibling;
    }

    set mdcBox(val: any) {
        this._box = asBoolean(val);
        this.initBox();
    }

    @HostBinding('class.mdc-textfield--dense') @Input()
    get mdcDense() {
        return this._dense;
    }

    set mdcDense(val: any) {
        this._dense = asBoolean(val);
    }
}
