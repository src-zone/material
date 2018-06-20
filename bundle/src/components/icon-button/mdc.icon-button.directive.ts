import { AfterContentInit, Directive, ContentChild, ElementRef, EventEmitter, forwardRef, HostBinding,
    HostListener, Input, OnDestroy, Output, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MDCRipple } from '@material/ripple';
import { MDCIconButtonToggleFoundation } from '@material/icon-button';
import { MdcIconButtonToggleAdapter } from './mdc.icon-button.adapter';
import { asBoolean, asBooleanOrNull } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { AbstractMdcIcon } from './abstract.mdc.icon';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Directive for an icon nested inside a <code>MdcIconButtonDirective</code>.
 * This directive is only required when the icon font for an <code>mdcIconButton</code>
 * uses CSS pseudo-elements in order to provide the icon. This is how Font Awesome, and many
 * other icon font libraries provide their icons. These pseudo elements would interfere
 * with the pseudo elements that <code>mdcIconButton</code> uses to provide a ripple
 * effect. This can be solved by having a child element in your <code>mdcIconButton</code>
 * and set this directive on it. The icon classes will then be applied to the child
 * element, and won't interfere with the icon button pseudo elements anymore.
 * </p><p>
 * For icon fonts that don't use pseudo elements (such as the Material
 * Design Icons from Google), this directive is not necessary.
 */
@Directive({
    selector: '[mdcIconButtonIcon]'
})
export class MdcIconButtonIconDirective {
}

/**
 * Directive for an icon button. Icon buttons can be used with a font icon library such as
 * <a href="https://material.io/tools/icons" target="_blank">Google Material Icons</a>, or
 * svg elements. They provide material styling and a ripple to the icon. Use it on anchor and
 * button tags. For toggling icon buttons, see <code>MdcIconButtonToggleDirective</code>.
 * When the applied icon font uses CSS pseudo elements, make the icon a child element of the
 * <code>mdcIconButton</code>, and give it the <code>mdcIconButtonIcon</code> directive.
 */
@Directive({
    selector: '[mdcIconButton]:not([iconOn])',
    providers: [
        {provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcIconButtonDirective) },
        {provide: AbstractMdcIcon, useExisting: forwardRef(() => MdcIconButtonDirective) }
    ]
})
export class MdcIconButtonDirective extends AbstractMdcIcon implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-icon-button') _hostClass = true;
    private _disabled = false;

    constructor(_elm: ElementRef, renderer: Renderer2, registry: MdcEventRegistry) {
        super(_elm, renderer, registry);
    }

    ngAfterContentInit() {
        this.initRipple();
    }

    ngOnDestroy() {
        this.destroyRipple();
    }

    /**
     * To disable the icon, set this input to true.
     */
    @Input()
    @HostBinding('class.mdc-icon-button--disabled')
    get disabled() {
        return this._disabled;
    }

    set disabled(value: any) {
        this._disabled = asBoolean(value);
    }

    /** @docs-private */
    protected isRippleUnbounded() {
        return true;
    }
}


/**
 * Directive for creating a Material Design icon toggle button: a button that toggles state, and
 * switches the icon based on the value of the toggle.
 * </p><p>
 * When the applied icon font uses CSS pseudo elements, add a child element for the actual icon,
 * and give that element the <code>mdcIconButtonIcon</code> directive. The icon button will
 * then update the child element with the correct icon if it is toggled.
 */
@Directive({
    selector: '[mdcIconButton][iconOn]',
    providers: [
        {provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcIconButtonToggleDirective) },
        {provide: AbstractMdcIcon, useExisting: forwardRef(() => MdcIconButtonToggleDirective) }
    ]
})
export class MdcIconButtonToggleDirective extends AbstractMdcIcon implements AfterContentInit {
    @HostBinding('class.mdc-icon-button') _hostClass = true;
    @ContentChild(MdcIconButtonIconDirective, {read: ElementRef}) _innerIcon: ElementRef;
    /**
     * Event emitted when the state of the icon toggle changes (for example when a user clicks
     * the icon). 
     */
    @Output() onChange: EventEmitter<boolean> = new EventEmitter();
    private _onChange: (value: any) => void = (value) => {};
    private _onTouched: () => any = () => {};
    private _initialized = false;
    private _on = false;
    private _labelOn: string;
    private _labelOff: string;
    private _iconOn: string;
    private _iconOff: string;
    private _iconIsClass: boolean;
    private _disabled: boolean;
    private toggleAdapter: MdcIconButtonToggleAdapter = {
        addClass: (className: string) => this._renderer.addClass(this.iconElm, className),
        removeClass: (className: string) => this._renderer.removeClass(this.iconElm, className),
        registerInteractionHandler: (type: string, handler: EventListener) => this._registry.listen(this._renderer, type, handler, this._elm),
        deregisterInteractionHandler: (type: string, handler: EventListener) => this._registry.unlisten(type, handler),
        setText: (text: string) => this.iconElm.textContent = text,
        getAttr: (name: string) => {
            if (name === 'data-toggle-on-label') return this._labelOn;
            else if (name === 'data-toggle-off-label') return this._labelOff;
            else if (name === 'data-toggle-on-content') return this.iconIsClass ? null : this._iconOn;
            else if (name === 'data-toggle-off-content') return this.iconIsClass ? null : this._iconOff;
            else if (name === 'data-toggle-on-class') return this.iconIsClass ? this._iconOn : null;
            else if (name === 'data-toggle-off-class') return this.iconIsClass ? this._iconOff : null;           
            return this._elm.nativeElement.getAttribute(name);
        },
        setAttr: (name: string, value: string) => this._renderer.setAttribute(this._elm.nativeElement, name, value),
        notifyChange: (evtData: {isOn: boolean}) => {
            this._on = evtData.isOn;
            this.notifyChange();
        }
    };
    private toggleFoundation: {
        init(),
        destroy(),
        isOn(): boolean,
        toggle(isOn?: boolean)
        refreshToggleData()
    };

    constructor(_elm: ElementRef, rndr: Renderer2, registry: MdcEventRegistry) {
        super(_elm, rndr, registry);
    }
  
    ngAfterContentInit() {
        this.initRipple();
        this.toggleFoundation = new MDCIconButtonToggleFoundation(this.toggleAdapter);
        this.toggleFoundation.init();
        // the foundation doesn't initialize the iconOn/iconOff and labelOn/labelOff until
        // toggle is called for the first time,
        // also, this will ensure 'aria-pressed' and 'aria-label' attributes are initialized:
        this.toggleFoundation.toggle(this._on);
        this._initialized = true;
    }
  
    ngOnDestroy() {
        this.destroyRipple();
        this.toggleFoundation.destroy();
    }

    private refreshToggleData() {
        if (this._initialized) {
            this.toggleFoundation.refreshToggleData();
            // refreshToggleData does not actually apply the new config to the icon:
            this.toggleFoundation.toggle(this._on);
        }
    }

    private get iconElm() {
        return this._innerIcon ? this._innerIcon.nativeElement : this._elm.nativeElement;
    }

    private notifyChange() {
        this._onChange(this._on);
        this.onChange.emit(this._on);
    }

    /** @docs-private */
    writeValue(obj: any) {
        let old = this._on;
        this._on = !!obj;
        if (this._initialized)
            this.toggleFoundation.toggle(this._on);
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
        this._disabled = disabled;
    }

    /** @docs-private */
    protected isRippleUnbounded() {
        return true;
    }

    /**
     * The current state of the icon (true for on/pressed, false for off/unpressed).
     */
    @Input() get on() {
        return this._on;
    }

    set on(value: any) {
        let newValue = asBoolean(value);
        if (newValue !== this._on) {
            this._on = newValue;
            if (this._initialized)
                this.toggleFoundation.toggle(this._on);
        }
    }

    /**
     * The aria-label to use for the on/pressed state of the icon.
     */
    @Input() get labelOn() {
        return this._labelOn;
    }

    set labelOn(value: string) {
        this._labelOn = value;
        this.refreshToggleData();
    }

    /**
     * The aria-label to use for the off/unpressed state of the icon.
     */
    @Input() get labelOff() {
        return this._labelOff;
    }

    set labelOff(value: string) {
        this._labelOff = value;
        this.refreshToggleData();
    }

    /**
     * The icon to use for the on/pressed state of the icon.
     */
    @Input() get iconOn() {
        return this._iconOn;
    }

    set iconOn(value: string) {
        if (value !== this._iconOn) {
            if (this.iconIsClass)
                // the adapter doesn't clean up old classes; this class may be set,
                // in which case after it's changed the foundation won't be able to remove it anymore:
                this.toggleAdapter.removeClass(this._iconOn);
            this._iconOn = value;
            this.refreshToggleData();
        }
    }

    /**
     * The icon to use for the off/unpressed state of the icon.
     */
    @Input() get iconOff() {
        return this._iconOff;
    }

    set iconOff(value: string) {
        if (value !== this._iconOff) {
            if (this.iconIsClass)
                // the adapter doesn't clean up old classes; this class may be set,
                // in which case after it's changed the foundation won't be able to remove it anymore:
                this.toggleAdapter.removeClass(this._iconOff);
            this._iconOff = value;
            this.refreshToggleData();
        }
    }

    /**
     * Some icon fonts (such as Font Awesome) use CSS class names to select the icon to show.
     * Others, such as the Material Design Icons from Google use ligatures (allowing selection of
     * the icon by using their textual name). When <code>iconIsClass</code> is true, the directive
     * assumes <code>iconOn</code>, and <code>iconOff</code> represent class names. When
     * <code>iconIsClass</code> is false, the directive assumes the use of ligatures.
     * When iconIsClass is not set, the value depends on the availability of a nested
     * <code>mdcIconButtonIcon</code> directive: when that exists, <code>iconOn</code> and <code>iconOff</code>
     * are expected to be classnames, otherwise they are expected to be ligatures. This is usually
     * the intended behaviour, so in most cases you don't need to initialize the <code>iconIsClass</code>
     * property.
     */
    @Input() get iconIsClass() {
        return this._iconIsClass == null ? this._innerIcon != null : this._iconIsClass;
    }

    set iconIsClass(value: any) {
        let newValue = asBooleanOrNull(value);
        if (this._initialized && this._iconIsClass !== newValue)
            throw new Error('iconIsClass property should not be changed after the mdcIconButton is initialized');
        this._iconIsClass = newValue;
    }

    @HostListener('(blur') _onBlur() {
        this._onTouched();
    }

    /**
     * To disable the icon, set this input to true.
     */
    @Input()
    @HostBinding('class.mdc-icon-button--disabled')
    get disabled() {
        return this._disabled;
    }

    set disabled(value: any) {
        this._disabled = asBoolean(value);
    }
}

/**
 * Directive for adding Angular Forms (<code>ControlValueAccessor</code>) behavior to an
 * <code>MdcIconButtonDirective</code>. Allows the use of the Angular Forms API with
 * icon toggle buttons, e.g. binding to <code>[(ngModel)]</code>, form validation, etc.
 */
@Directive({
    selector: '[mdcIconButton][iconOn][formControlName],[mdcIconButton][iconOn][formControl],[mdcIconButton][iconOn][ngModel]',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MdcFormsIconButtonDirective), multi: true}
    ]
})
export class MdcFormsIconButtonDirective implements ControlValueAccessor {
    constructor(@Self() private mdcIconButton: MdcIconButtonToggleDirective) {
    }

    /** @docs-private */
    writeValue(obj: any) {
        this.mdcIconButton.writeValue(obj);
    }

    /** @docs-private */
    registerOnChange(onChange: (value: any) => void) {
        this.mdcIconButton.registerOnChange(onChange);
    }

    /** @docs-private */
    registerOnTouched(onTouched: () => any) {
        this.mdcIconButton.registerOnTouched(onTouched);
    }

    /** @docs-private */
    setDisabledState(disabled: boolean) {
        this.mdcIconButton.setDisabledState(disabled);
    }
}

export const ICON_BUTTON_DIRECTIVES = [
    MdcIconButtonIconDirective, MdcIconButtonDirective, MdcIconButtonToggleDirective, MdcFormsIconButtonDirective
];
