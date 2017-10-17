import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, HostBinding,
    HostListener, Input, OnDestroy, OnInit, Output, Provider, QueryList, Renderer2, Self, ViewChild,
    ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MDCRipple } from '@material/ripple';
import { MDCIconToggleFoundation } from '@material/icon-toggle';
import { MdcIconToggleAdapter } from './mdc.icon-toggle.adapter';
import { asBoolean, asBooleanOrNull } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

interface MdcIconToggleChangeEvent {
    isOn: boolean
}

/**
 * Directive for an icon nested inside a <code>MdcIconToggleDirective</code>.
 * This directive is only needed when the icon font uses CSS pseudo-elements in order
 * to provide the icon. This is how Font Awesome, and many other icon font libraries
 * provide the icons.
 * For icon fonts that don't use pseudo elements (such as the Material Design Icons from Google),
 * this directive is not necessary.
 */
@Directive({
    selector: '[mdcIconToggleIcon]'
})
export class MdcIconToggleIconDirective {
}

/**
 * Directive for creating a Material Design icon toggle button.
 * The icon toggle is fully accessible, and works with any icon font.
 * When the icon font uses CSS pseudo-elements in order to display the icon,
 * embed an <code>MdcIconToggleIconDirective</code> inside this directive for
 * the actual icon. (Otherwise the pseudo-elements used for showing the icon
 * will interfere with the pseudo-elements this directive uses for showing
 * ripple styles).
 */
@Directive({
    selector: '[mdcIconToggle]'
})
export class MdcIconToggleDirective extends AbstractMdcRipple implements AfterContentInit {
    @HostBinding('class.mdc-icon-toggle') _hostClass = true;
    @HostBinding('attr.role') _role: string = 'button';
    @ContentChild(MdcIconToggleIconDirective, {read: ElementRef}) _innerIcon: ElementRef;
    /**
     * Event emitted when the state of the icon changes (for example when a user clicks
     * the icon).
     */
    @Output() mdcIsOnChange: EventEmitter<boolean> = new EventEmitter();
    private _onChange: (value: any) => void = (value) => {};
    private _onTouched: () => any = () => {};
    private _beforeInitQueu: Array<() => any> = [];
    private _initialized = false;
    private _labelOn: string;
    private _labelOff: string;
    private _iconOn: string;
    private _iconOff: string;
    private _iconIsClass: boolean;
    private mdcAdapter: MdcIconToggleAdapter = {
        addClass: (className: string) => {
            let inner = this._innerIcon && this._iconIsClass !== false && (className === this._iconOn || className === this._iconOff);
            this.renderer.addClass(inner ? this._innerIcon.nativeElement : this.elm.nativeElement, className);
        },
        removeClass: (className: string) => {
            let inner = this._innerIcon && this._iconIsClass !== false && (className === this._iconOn || className === this._iconOff);            
            this.renderer.removeClass(inner ? this._innerIcon.nativeElement : this.elm.nativeElement, className);
        },
        registerInteractionHandler: (type: string, handler: EventListener) => {
            this.registry.listen(this.renderer, type, handler, this.elm);
        },
        deregisterInteractionHandler: (type: string, handler: EventListener) => {
            this.registry.unlisten(type, handler);
        },
        setText: (text: string) => {
            if (this._innerIcon)
                this._innerIcon.nativeElement.textContent = text;
            else
                this.elm.nativeElement.textContent = text;
        },
        getTabIndex: () => this.elm.nativeElement.tabIndex,
        setTabIndex: (tabIndex: number) => { this.elm.nativeElement.tabIndex = tabIndex; },
        getAttr: (name: string) => this.elm.nativeElement.getAttribute(name),
        setAttr: (name: string, value: string) => { this.renderer.setAttribute(this.elm.nativeElement, name, value); },
        rmAttr: (name: string) => { this.renderer.removeAttribute(this.elm.nativeElement, name); },
        notifyChange: (evtData: MdcIconToggleChangeEvent) => {
            this._onChange(evtData.isOn);
            this.mdcIsOnChange.emit(evtData.isOn);
        }
    };
    private foundation: {
        init(),
        destroy(),
        setDisabled(disabled: boolean),
        isDisabled(): boolean,
        isOn(): boolean,
        toggle(isOn?: boolean)
        refreshToggleData(),
        isKeyboardActivated(): boolean
    } = new MDCIconToggleFoundation(this.mdcAdapter);

    constructor(private elm: ElementRef, private renderer: Renderer2, private registry: MdcEventRegistry) {
        super(elm, renderer, registry);
    }
  
    ngAfterContentInit() {
        this.initDefaultAttributes();
        this.initializeData();
        this.foundation.init();
        // run all deferred foundation interactions:
        for (let fun of this._beforeInitQueu)
            fun();
        this._beforeInitQueu = [];
        // the foundation doesn't initialize the iconOn/iconOff and labelOn/labelOff until
        // toggle is called for the first time,
        // also, this will ensure 'aria-pressed' and 'aria-label' attributes are initialized:
        this.foundation.toggle(this.foundation.isOn());
        this.initRipple();
        this._initialized = true;
    }
  
    ngOnDestroy() {
        this.destroyRipple();
        this.foundation.destroy();
    }

    private execAfterInit(fun: () => any) {
        if (this._initialized)
            fun();
        else
            this._beforeInitQueu.push(fun);
    }

    private refreshData() {
        if (this._initialized) {
            this.initializeData();
            this.foundation.refreshToggleData();
        }
    }

    private initDefaultAttributes() {
        if (!this.elm.nativeElement.hasAttribute('tabindex'))
            // unless overridden by another tabIndex, we want icon-toggles to
            // participate in tabbing (the foundation will remove the tabIndex
            // when the icon-toggle is disabled):
            this.elm.nativeElement.tabIndex = 0;
    }

    private initializeData() {
        // iconOn/iconOff are classes when the mdcIconIsClass is true, or when mdcIconIsClass is not set,
        //  and _innerIcon is used (because _innerIcon is specifically for cases where icons are set via pseudo elements
        //  by using classes):
        let iconIsClass = this._iconIsClass == null ? this._innerIcon != null : this._iconIsClass;
        this.renderer.setAttribute(this.elm.nativeElement, 'data-toggle-on',
                this.createDataAttrForToggle(this._labelOn, this._iconOn, iconIsClass));
        this.renderer.setAttribute(this.elm.nativeElement, 'data-toggle-off',
                this.createDataAttrForToggle(this._labelOff, this._iconOff, iconIsClass));
    }

    private createDataAttrForToggle(label: string, icon: string, iconIsClass: boolean) {
        let data = {
            label: label
        };
        data[iconIsClass ? 'cssClass' : 'content'] = icon;
        return JSON.stringify(data);
    }

    /** @docs-private */
    writeValue(obj: any) {
        this.execAfterInit(() => this.foundation.toggle(!!obj));
    }

    /** @docs-private */
    registerOnChange(onChange: (value: any) => void) {
        this._onChange = onChange;
    }

    /** @docs-private */
    registerOnTouched(onTouched: () => any) {
        this._onTouched = onTouched;
    }

    /** @docs-private */
    setDisabledState(disabled: boolean) {
        this.mdcDisabled = disabled;
    }

    /** @docs-private */
    protected isRippleUnbounded() {
        return true;
    }

    /** @docs-private */
    protected isRippleSurfaceActive() {
        return this.foundation.isKeyboardActivated();
    }

    /** @docs-private */
    protected computeRippleBoundingRect() {
        const dim = 48;
        const {left, top} = this.elm.nativeElement.getBoundingClientRect();
        return {
            left,
            top,
            width: dim,
            height: dim,
            right: left + dim,
            bottom: left + dim,
        };
    }

    /**
     * The current state of the icon (true for on/pressed, false for off/unpressed).
     */
    @Input() get mdcIsOn() {
        return this.foundation.isOn();
    }

    set mdcIsOn(value: any) {
        this.execAfterInit(() => this.foundation.toggle(asBoolean(value)));
    }

    /**
     * The aria-label to use for the on/pressed state of the icon.
     */
    @Input() get mdcLabelOn() {
        return this._labelOn;
    }

    set mdcLabelOn(value: string) {
        this._labelOn = value;
        this.refreshData();
    }

    /**
     * The aria-label to use for the off/unpressed state of the icon.
     */
    @Input() get mdcLabelOff() {
        return this._labelOff;
    }

    set mdcLabelOff(value: string) {
        this._labelOff = value;
        this.refreshData();
    }

    /**
     * The icon to use for the on/pressed state of the icon.
     */
    @Input() get mdcIconOn() {
        return this._iconOn;
    }

    set mdcIconOn(value: string) {
        this._iconOn = value;
        this.refreshData();
    }

    /**
     * The icon to use for the off/unpressed state of the icon.
     */
    @Input() get mdcIconOff() {
        return this._iconOff;
    }

    set mdcIconOff(value: string) {
        this._iconOff = value;
        this.refreshData();
    }

    /**
     * Some icon fonst (such as Font Awesome) use CSS class names to select the icon to show.
     * Others, such as the Material Design Icons from Google use ligatures (allowing selection of
     * the icon by using their textual name). When <code>mdcIconIsClass</code> is true, the directive
     * assumes <code>mdcIconOn</code>, and <code>mdcIconOff</code> represent class names. When
     * <code>mdcIconIsClass</code> is false, the directive assumes the use of ligatures.
     * <p>
     * When <code>mdcIconIsClass</code> is not assigned, the directive bases its decision on whether
     * or not an embedded <code>MdcIconToggleIconDirective</code> is used.
     * In most cases you won't need to set this input, as the default based on an embedded
     * <code>MdcIconToggleIconDirective</code> is typically what you need.
     * </p>
     */
    @Input() get mdcIconIsClass() {
        return this._iconIsClass;
    }

    set mdcIconIsClass(value: any) {
        this._iconIsClass = asBooleanOrNull(value);
        this.refreshData();
    }

    /**
     * To disable the icon toggle, set this input to true.
     */
    @Input() get mdcDisabled() {
        return this.foundation.isDisabled();
    }

    set mdcDisabled(value: any) {
        this.execAfterInit(() => {
            let newValue = asBoolean(value);
            // we only set the disabled state if it changes from the current value.
            // if we don't do that, then calling setDisabled(false) after initialization
            // will clear the tabIndex. So this works around a bug in @material/icon-toggle:
            if (this.foundation.isDisabled() != newValue)
                this.foundation.setDisabled(asBoolean(value));
        });
    }

    @HostListener('(blur') _onBlur() {
        this._onTouched();
    }
}

/**
 * Directive for adding Angular Forms (<code>ControlValueAccessor</code>) behavior to an
 * <code>MdcIconToggleDirective</code>. Allows the use of the Angular Forms API with
 * icon toggles, e.g. binding to <code>[(ngModel)]</code>, form validation, etc.
 */
@Directive({
    selector: '[mdcIconToggle][formControlName],[mdcIconToggle][formControl],[mdcIconToggle][ngModel]',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MdcFormsIconToggleDirective), multi: true}
    ]
})
export class MdcFormsIconToggleDirective implements ControlValueAccessor {
    constructor(@Self() private mdcIconToggle: MdcIconToggleDirective) {
    }

    /** @docs-private */
    writeValue(obj: any) {
        this.mdcIconToggle.writeValue(obj);
    }

    /** @docs-private */
    registerOnChange(onChange: (value: any) => void) {
        this.mdcIconToggle.registerOnChange(onChange);
    }

    /** @docs-private */
    registerOnTouched(onTouched: () => any) {
        this.mdcIconToggle.registerOnTouched(onTouched);
    }

    /** @docs-private */
    setDisabledState(disabled: boolean) {
        this.mdcIconToggle.setDisabledState(disabled);
    }
}
