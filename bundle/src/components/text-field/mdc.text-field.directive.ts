import { AfterContentInit, ContentChildren, Directive, ElementRef, forwardRef, HostBinding,
  HostListener, Input, OnDestroy, OnInit, Optional, QueryList, Renderer2, Self, Output, EventEmitter, Attribute } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCTextFieldFoundation, MDCTextFieldAdapter } from '@material/textfield';
import { MDCLineRippleFoundation, MDCLineRippleAdapter } from '@material/line-ripple';
import { MDCTextFieldHelperTextFoundation, MDCTextFieldHelperTextAdapter } from '@material/textfield/helper-text';
import { MDCTextFieldIconFoundation, MDCTextFieldIconAdapter } from '@material/textfield/icon';
import { MdcFloatingLabelDirective } from '../floating-label/mdc.floating-label.directive';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { asBoolean, asNumberOrNull } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcNotchedOutlineDirective } from '../notched-outline/mdc.notched-outline.directive';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { Subject, merge } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

let nextId = 1;

/**
 * Directive for the native input of an `mdcTextField`. 
 */
@Directive({
    selector: 'input[mdcTextFieldInput], textarea[mdcTextFieldInput]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcTextFieldInputDirective) }]
})
export class MdcTextFieldInputDirective extends AbstractMdcInput implements OnInit, OnDestroy {
    @HostBinding('class.mdc-text-field__input') _hostClass = true;
    @HostBinding('attr.aria-labelledby') _labeledBy: string | null = null;
    @Output() readonly _valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();
    private onDestroy$: Subject<any> = new Subject();
    private _id: string;
    private _type = 'text';
    private _value = '';
    private _disabled = false;
    private cachedId: string;

    constructor(public _elm: ElementRef, private renderer: Renderer2, @Optional() @Self() public _cntr: NgControl) {
        super();
    }

    ngOnInit() {
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        
        this._cntr?.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            // (using the value of the elemnt, because the value of the control might be of another type,
            // e.g. the ngModel for type=number inputs is a number)
            this.updateValue(this._elm.nativeElement.value, true);
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    /**
     * Mirrors the <code>id</code> attribute. If no id is assigned, this directive will
     * assign a unique id by itself. If an <code>mdcFloatingLabel</code> for this text-field
     * is available, the <code>mdcFloatingLabel</code> will automatically be associated
     * (either by a `for` attribute on the label, or by an `aria-labelledby` attribute
     * on this input element).
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
                this.renderer.setAttribute(this._elm.nativeElement, 'type', this._type);
            }
        }
    }

    /** @docs-private */
    @Input() get value() {
        return this._value;
    }

    /** @docs-private */
    set value(value: string) {
        this.updateValue(value, false);
    }

    private updateValue(value: any, fromControl: boolean) {
        const newVal = (value ? `${value}` : '');
        if (newVal !== this._value) {
            this._value = this._elm.nativeElement.value = newVal;
            this._valueChange.emit(this._elm.nativeElement.value);
        }
        if (!fromControl && this._cntr && newVal !== this._cntr.value) {
            this._cntr.control.setValue(newVal); // TODO how to convert to the type of value the controlpects?
        }
    }

    @HostListener('input') _onInput() {
        if (!this._cntr)
            this.updateValue(this._elm.nativeElement.value, false);
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
 * `MdcTextFieldDirective`). An icon before the `mdcTextFieldInput` will be styled
 * as a leading icon. An icon after the `mdcTextFieldInput` will be styles as a
 * trailing icon.
 */
@Directive({
    selector: '[mdcTextFieldIcon]'
})
export class MdcTextFieldIconDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-text-field__icon') _cls = true;
    /**
     * Event emitted for icon interactions (a click or an 'enter' keypress). When this output is assigned,
     * the icon will also set the `role=button` and `tabindex=0` attributes, unless you give them another
     * explicit value.
     */
    @Output() readonly interact: EventEmitter<void> = new EventEmitter();
    @HostBinding('class.mdc-text-field__icon--leading') _leading = false;
    @HostBinding('class.mdc-text-field__icon--trailing') _trailing = false;
    private _tabIndex: number | null;
    private _role: string | null;
    
    _mdcAdapter: MDCTextFieldIconAdapter = {
        getAttr: (name: string) => this._el.nativeElement.getAttribute(name),
        setAttr: (name: string, value: string) => this._rndr.setAttribute(this._el.nativeElement, name, value),
        removeAttr: (name: string) => this._rndr.removeAttribute(this._el.nativeElement, name),
        setContent: (content: string) => this._el.nativeElement.textContent = content,
        registerInteractionHandler: (evtType, handler) => this._reg.listen(this._rndr, evtType, handler, this._el),
        deregisterInteractionHandler: (evtType, handler) => this._reg.unlisten(evtType, handler),
        notifyIconAction: () => this.interact.emit()
    };
    _foundation = new MDCTextFieldIconFoundation(this._mdcAdapter);

    constructor(private _rndr: Renderer2, public _el: ElementRef, private _reg: MdcEventRegistry,
        @Attribute('tabindex') private tabIndex: string) {
    }

    ngAfterContentInit() {
        this._foundation.init();
    }

    ngOnDestroy() {
        this._foundation.destroy();
        this._foundation = null;
    }

    /**
     * The `tabindex` for icons defaults to `null` (no tabindex set) for icons without
     * subscriptions to the `interact` output, and to `0` for icons that have an `interact`
     * binding. You can override this default, by setting a non-null value for this property.
     */
    @HostBinding('attr.tabindex') @Input() get tabindex() {
        if (this.interact.observers.length > 0 && this._tabIndex == null)
            return 0;
        return this._tabIndex;
    }

    set tabindex(value) {
        this._tabIndex = asNumberOrNull(value);
    }

    /**
     * The `role` attribute for icons defaults to `null` (no role set) for icons without
     * subscriptions to the `interact` output, and to `button` for icons that have an `interact`
     * binding. You can override this default, by setting a non-null value for this property.
     */
    @HostBinding('attr.role') @Input() get role() {
        if (this.interact.observers.length > 0 && this._role == null)
            return 'button';
        return this._role;
    }

    set role(value) {
        this._role = value;
    }
}

/**
 * This directive wraps an optional `mdcTextFieldHelperText`. It should be the next sibling of the
 * associated `mdcTextField` if used. See `mdcTextFieldHelperText` for more info.
 */
@Directive({
    selector: '[mdcTextFieldHelperLine]',
})
export class MdcTextFieldHelperLineDirective {
    @HostBinding('class.mdc-text-field-helper-line') _cls = true;
}

/**
 * Directive for an optional helper-text to show supplemental information or validation
 * messages for an <code>mdcTextField</code>. This directive should be wrapped inside an
 * `mdcTextFieldHelperLine` that comes directly after the `mdcTextField` it belongs to.
 * Additionally, you must export it as a <code>mdcHelperText</code>, and
 * assign the exported object to the <code>helperText</code> property of the
 * <code>mdcHelperText</code>. See the examples for hints on how to do this.
 */
@Directive({
    selector: '[mdcTextFieldHelperText]',
    exportAs: 'mdcHelperText'
})
export class MdcTextFieldHelperTextDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-text-field-helper-text') _cls = true;
    private _validation = false;
    private _persistent = false;
    _mdcAdapter: MDCTextFieldHelperTextAdapter = {
        addClass: (className: string) => this._rndr.addClass(this._elm.nativeElement, className),
        removeClass: (className: string) => this._rndr.removeClass(this._elm.nativeElement, className),
        hasClass: (className) => this._elm.nativeElement.classList.contains(className),
        setAttr: (name: string, value: string) => this._rndr.setAttribute(this._elm.nativeElement, name, value),
        removeAttr: (name: string) => this._rndr.removeAttribute(this._elm.nativeElement, name),
        setContent: () => {
            // helperText content can be set by simply wrapping (dynamic) content in the directive.
            // this is much more powerful than setContent, because it can also include html markup
            // therefore there is no reason to do anything with setContent
            throw new Error("MdcTextFieldHelperTextAdapter.setContent not supported");
        }
    };
    _foundation: MDCTextFieldHelperTextFoundation;

    constructor(private _rndr: Renderer2, public _elm: ElementRef) {
    }

    ngAfterContentInit() {
        this._foundation = new MDCTextFieldHelperTextFoundation(this._mdcAdapter);
        this._foundation.setPersistent(this._persistent);
        this._foundation.setValidation(this._validation);
    }

    ngOnDestroy() {
        this._foundation.destroy();
        this._foundation = null;
    }

    /**
     * If set to a value other than false, the helper text is treated as a
     * validation message, and only shown when the input is invalid.
     */
    @Input() set validation(value: boolean) {
        this._validation = asBoolean(value);
        if (this._foundation)
            this._foundation.setValidation(this._validation);
    }

    /**
     * If set to a value other than false, the helper text is always visible.
     * Otherwise the helper text will only be shown when the input has focus
     * (or if `validation` is set, when the input is invalid).
     */
    @Input() set persistent(value: boolean) {
        this._persistent = asBoolean(value);
        if (this._foundation)
            this._foundation.setPersistent(this._persistent);
    }
}

/**
 * Material design text-field. Text fields can be filled or outlined.
 * 
 * Filled text-fields should have the following child directives:
 * * `mdcTextFieldIcon` (optional leading icon)
 * * `mdcTextFieldInput` (required, the native input)
 * * `mdcTextFieldIcon` (optional trailing icon)
 * * `mdcFloatingLabel` (optional floating label)
 * 
 * Outlined text-fields should have the following child directives:
 * * `mdcTextFieldIcon` (optional leading icon)
 * * `mdcTextFieldInput` (required, the native input)
 * * `mdcTextFieldIcon` (optional trailing icon)
 * * `mdcNotchedOutline` (the outline, which can also contain an optional `mdcFloatingLabel`)
 * 
 * Addditionally the text-field can be followed by an `mdcTextFieldHelperLine` containing an
 * `mdcHelperText`.
 */
@Directive({
    selector: '[mdcTextField]',
    providers: [{provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcTextFieldDirective) }]
})
export class MdcTextFieldDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    private onDestroy$: Subject<any> = new Subject();
    private onInputChange$: Subject<any> = new Subject();
    private onHelperTextChange$: Subject<any> = new Subject();
    @HostBinding('class.mdc-text-field') _cls = true;
    @ContentChildren(MdcTextFieldIconDirective) _icons: QueryList<MdcTextFieldIconDirective>;
    @ContentChildren(MdcTextFieldInputDirective) _inputs: QueryList<MdcTextFieldInputDirective>;
    @ContentChildren(MdcFloatingLabelDirective, {descendants: true}) _floatingLabels: QueryList<MdcFloatingLabelDirective>;
    @ContentChildren(MdcNotchedOutlineDirective) _outlines: QueryList<MdcNotchedOutlineDirective>;
    private _leadingIcon: MdcTextFieldIconDirective;
    private _trailingIcon: MdcTextFieldIconDirective;
    private _helperText: MdcTextFieldHelperTextDirective;
    private _bottomLineElm: HTMLElement = null;
    private _valid: boolean = null;
    private mdcLineRippleAdapter: MDCLineRippleAdapter = {
        addClass: (className: string) => this.renderer.addClass(this._bottomLineElm, className),
        removeClass: (className: string) => this.renderer.removeClass(this._bottomLineElm, className),
        hasClass: (className) => this._bottomLineElm.classList.contains(className),
        setStyle: (name: string, value: string) => this.renderer.setStyle(this._bottomLineElm, name, value),
        registerEventHandler: (evtType, handler) => this.registry.listenElm(this.renderer, evtType, handler, this._bottomLineElm),
        deregisterEventHandler: (evtType, handler) => this.registry.unlisten(evtType, handler)
    };
    private mdcAdapter: MDCTextFieldAdapter = {
        addClass: (className) => this.renderer.addClass(this.root.nativeElement, className),
        removeClass: (className) => this.renderer.removeClass(this.root.nativeElement, className),
        hasClass: (className) => this.root.nativeElement.classList.contains(className),
        registerTextFieldInteractionHandler: (evtType, handler) => {
            this.registry.listen(this.renderer, evtType, handler, this.root);
        },
        deregisterTextFieldInteractionHandler: (evtType, handler) => {
            this.registry.unlisten(evtType, handler);
        },
        registerInputInteractionHandler: (evtType, handler) => this._input && this.registry.listen(this.renderer, evtType, handler, this._input._elm),
        deregisterInputInteractionHandler: (evtType, handler) => this.registry.unlisten(evtType, handler),
        registerValidationAttributeChangeHandler: (handler: (arg: Array<any>) => void) => {
            const getAttributesList = (mutationsList) => mutationsList
                .map(mutation => mutation.attributeName)
                .filter(attrName => attrName);
            const observer = new MutationObserver((mutationsList) => handler(getAttributesList(mutationsList)));
            observer.observe(this._input._elm.nativeElement, {attributes: true});
            return observer;
        },
        deregisterValidationAttributeChangeHandler: (observer: MutationObserver) => observer.disconnect(),
        getNativeInput: () => ({
            value: this._input.value,
            disabled: this._input.disabled,
            maxLength: this._input._elm.nativeElement.maxLength,
            type: this._input.type,
            validity: {
                valid: this._valid == null ? this._input.valid : !!this._valid,
                badInput: this._input._isBadInput()
            }
        }),
        isFocused: () => !!this._input && document.activeElement === this._input._elm.nativeElement,
        shakeLabel: (shouldShake: boolean) => this._floatingLabel?.shake(shouldShake),
        floatLabel: (shouldFloat: boolean) => this._floatingLabel?.float(shouldFloat),
        hasLabel: () => !!this._floatingLabel,
        getLabelWidth: () => this._floatingLabel ? this._floatingLabel.getWidth() : 0,
        activateLineRipple: () => this.bottomLineFoundation?.activate(),
        deactivateLineRipple: () => this.bottomLineFoundation?.deactivate(),
        setLineRippleTransformOrigin: (normalizedX: number) => this.bottomLineFoundation?.setRippleCenter(normalizedX),
        hasOutline: () => !!this._outline,
        notchOutline: (labelWidth: number) => this._outline?.open(labelWidth),
        closeOutline: () => this._outline?.close()
    };
    private bottomLineFoundation: MDCLineRippleFoundation;
    private foundation: MDCTextFieldFoundation;

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry) {
        super(root, renderer, registry);
    }

    ngAfterContentInit() {        
        merge(
            this._floatingLabels.changes,
            this._icons.changes,
            this._inputs.changes,
            this._outlines.changes,
            this.onHelperTextChange$
        ).pipe(
            takeUntil(this.onDestroy$),
            debounceTime(2)
        ).subscribe(() => {
            this.reconstructComponent();
        });
        this.initComponent();
    }

    ngOnDestroy() {
        this.onInputChange$.next(); this.onInputChange$.complete();
        this.onDestroy$.next(); this.onDestroy$.complete();
        this.onHelperTextChange$.complete();
        this.destroyComponent();
    }

    private initComponent() {
        if (this._input && !this._outline && !this._input._isTextarea()) {
            this.addRippleSurface('mdc-text-field__ripple', true);
            this.initRipple();
            this.initLineRipple();
        }
        this.attachLabelToInput();
        this.initIcons();
        this.foundation = new MDCTextFieldFoundation(this.mdcAdapter, {
            helperText: this.helperText ? this.helperText._foundation : undefined,
            leadingIcon: this._leadingIcon ? this._leadingIcon._foundation : undefined,
            trailingIcon: this._trailingIcon ? this._trailingIcon._foundation : undefined
        });
        this.foundation.init();
        this.subscribeInputChanges();
    }

    private destroyComponent() {
        this.destroyRippleSurface();
        this.destroyRipple();
        this.destroyLineRipple();
        this.foundation.destroy();
        this.foundation = null;
    }

    private reconstructComponent() {
        this.destroyComponent();
        this.initComponent();
        this.recomputeOutline(); // TODO check if we still need this with latest material-components-web
    }

    private initLineRipple() {
        if (!this._outline) {
            this._bottomLineElm = this.renderer.createElement('div');
            this.renderer.addClass(this._bottomLineElm, 'mdc-line-ripple');
            this.renderer.appendChild(this.root.nativeElement, this._bottomLineElm);
            this.bottomLineFoundation = new MDCLineRippleFoundation(this.mdcLineRippleAdapter);
            this.bottomLineFoundation.init();
        }
    }

    private destroyLineRipple() {
        if (this._bottomLineElm) {
            this.bottomLineFoundation.destroy();
            this.bottomLineFoundation = null;
            this.renderer.removeChild(this.root.nativeElement, this._bottomLineElm);
            this._bottomLineElm = null;
        }
    }

    private recomputeOutline() {
        if (this._outline) {
            // the outline may not be valid after re-initialisation, recompute outline when all
            // style/structural changes have been employed:
            setTimeout(() => {this.foundation.notchOutline(this.foundation.shouldFloat); }, 0);
        }
    }

    private initIcons() {
        this._leadingIcon = this.computeLeadingIcon();
        this._trailingIcon = this.computeTrailingIcon(this._leadingIcon);
        this._icons.forEach(icon => {
            icon._leading = icon === this._leadingIcon;
            icon._trailing = icon === this._trailingIcon;
        });
    }

    private computeLeadingIcon() {
        if (this._icons.length > 0) {
            let icon = this._icons.first;
            let prev = this.previousElement(icon._el.nativeElement);
            let last = icon._el.nativeElement;
            while (true) {
                // if it is contained in another element, check the siblings of the container too:
                if (prev == null && last != null && last.parentElement !== this.root.nativeElement)
                    prev = last.parentElement;
                // no more elements before, must be the leading icon:
                if (prev == null)
                    return icon;
                // comes after the text, so it's not the leading icon:
                if (this._input && (prev === this._input._elm.nativeElement || prev.contains(this._input._elm.nativeElement)))
                    return null;
                last = prev;
                prev = this.previousElement(prev);
            }
        }
        return null;
    }

    private computeTrailingIcon(leading: MdcTextFieldIconDirective) {
        if (this._icons.length > 0) {
            let icon = this._icons.last;
            if (icon === leading)
                return null;
            // if not the leading icon, it must be the trailing icon:
            return icon;
        }
        return null;
    }

    private previousElement(el: Element): Element {
        let result = el.previousSibling;
        while (result != null && !(result instanceof Element))
            result = result.previousSibling;
        return <Element>result;
    }

    private attachLabelToInput() {
        // if the mdcTextField is a LABEL element wrapping the input OR the floatingLabel is NOT a LABEL element,
        //  the input gets an aria-labelledby attaching it to the floatingLabel;
        // otherwise the floatingLabel gets a 'for' attribute, attaching it to the input:
        let first = true;
        const needLabeledBy = this.root.nativeElement.nodeName.toLowerCase() === 'label' || !this._floatingLabel?.isLabelElement();
        this._inputs.forEach(input => {
            input._labeledBy = (first && needLabeledBy) ? this._floatingLabel?.id : null;
            first = false;
        });
        first = true;
        this._floatingLabels.forEach(label => {
            label.for = (first && !needLabeledBy && this._floatingLabel?.isLabelElement()) ? this._input?.id : null;
            first = false;
        });
    }

    private subscribeInputChanges() {
        this.onInputChange$.next();
        this._input?._valueChange.asObservable().pipe(takeUntil(this.onInputChange$)).subscribe((value) => {
            this.foundation.setValue(value);
        });
    }

    protected getRippleInteractionElement() {
        return this._input?._elm;
    }

    /**
     * The <code>valid</code> property provides a way to override the validity checking of the
     * underlying angular form control or native input. A value of true or false will make the
     * text-field validity styling based on this value. A value of <code>null</code>, or
     * <code>undefined</code> will reset the validity styling to the state of the underlying
     * angular form control or native input.
     * 
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
            this.foundation.setUseNativeValidation(true);
            // foundation doesn't change style when we switch to native validation;
            // trigger possible new style:
            this.foundation['styleValidity_'](this.mdcAdapter.getNativeInput().validity.valid);
        } else if (value !== this._valid) {
            this._valid = asBoolean(value);
            this.foundation.setValid(this._valid);
        }
    }

    @HostBinding('class.mdc-text-field--textarea') get _textArea(): boolean {
        return this._input._isTextarea();
    }

    /** @docs-private */
    @HostBinding('class.mdc-text-field--outlined') @Input()
    get outlined() {
        return !!this._outline;
    }

    /** @docs-private */
    @HostBinding('class.mdc-text-field--no-label') @Input()
    get noLabel() {
        return !this._floatingLabel;
    }

    @HostBinding('class.mdc-text-field--with-leading-icon') get _leading(): boolean {
        return !!this._leadingIcon;
    }

    @HostBinding('class.mdc-text-field--with-trailing-icon') get _trailing(): boolean {
        return !!this._trailingIcon;
    }

    /**
     * Assign an <code>mdcTextFieldHelperText</code> (exported as <code>mdcHelperText</code>) to this
     * input to add a helper-text or validation message to the text-field. See the examples for hints
     * on how to do this.
     */
    @Input() get helperText(): MdcTextFieldHelperTextDirective {
        return this._helperText;
    }

    set helperText(helperText: MdcTextFieldHelperTextDirective) {
        this._helperText = helperText;
        this.onHelperTextChange$.next();
    }

    @HostBinding('class.mdc-text-field--disabled') get _disabled() {
        // TODO: this mirrors what the text-field can update itself from adapter.getNativeInput
        //  is there a way to trigger the textfield to re-read that when the disabled state of
        //  the input changes?
        return this._input ? this._input.disabled : false;
    }

    private get _input() {
        return this._inputs?.first;
    }

    private get _floatingLabel() {
        return this._floatingLabels?.first;
    }

    private get _outline() {
        return this._outlines?.first;
    }
}

export const TEXT_FIELD_DIRECTIVES = [
    MdcTextFieldInputDirective,
    MdcTextFieldIconDirective,
    MdcTextFieldHelperLineDirective,
    MdcTextFieldHelperTextDirective,
    MdcTextFieldDirective
];
