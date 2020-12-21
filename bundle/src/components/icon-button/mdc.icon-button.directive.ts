import { AfterContentInit, Directive, ElementRef, EventEmitter, forwardRef, HostBinding,
    HostListener, Input, OnDestroy, Output, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MDCIconButtonToggleFoundation, MDCIconButtonToggleAdapter, MDCIconButtonToggleEventDetail } from '@material/icon-button';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { AbstractMdcIcon } from './abstract.mdc.icon';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Directive for an icon button. Icon buttons can be used with a font icon library such as
 * <a href="https://material.io/tools/icons" target="_blank">Google Material Icons</a>, SVG
 * elements or images. They provide material styling and a ripple to the icon. Use it on anchor and
 * button tags. For toggling icon buttons, see `MdcIconToggleDirective`.
 */
@Directive({
    selector: 'button[mdcIconButton],a[mdcIconButton]',
    providers: [
        {provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcIconButtonDirective) },
        {provide: AbstractMdcIcon, useExisting: forwardRef(() => MdcIconButtonDirective) }
    ]
})
export class MdcIconButtonDirective extends AbstractMdcIcon implements AfterContentInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-icon-button') readonly _cls = true;

    constructor(_elm: ElementRef, renderer: Renderer2, registry: MdcEventRegistry) {
        super(_elm, renderer, registry);
    }

    ngAfterContentInit() {
        this.initRipple(true);
    }

    ngOnDestroy() {
        this.destroyRipple();
    }
}

/**
 * Directive for the icon to display on one of the toggle states of an `mdcIconToggle`. See
 * `MdcIconToggleDirective` for more information.
 */
@Directive({
    selector: '[mdcIcon]'
})
export class MdcIconDirective  {
    /** @internal */
    @HostBinding('class.mdc-icon-button__icon') readonly _cls = true;
    /** @internal */
    @HostBinding('class.mdc-icon-button__icon--on') _on = false;

    /**
     * Set this input to false to remove the ripple effect from the surface.
     */
    @Input() get mdcIcon() {
        return this._on ? 'on' : '';
    }

    set mdcIcon(value: 'on' | '') {
        this._on = value === 'on';
    }
}

/**
 * Directive for creating a Material Design icon toggle button: a button that toggles state, and
 * switches the icon based on the value of the toggle.
 * 
 * When the applied icon font uses CSS pseudo elements, add a child element for the actual icon,
 * and give that element the <code>mdcIconButtonIcon</code> directive. The icon button will
 * then update the child element with the correct icon if it is toggled.
 */
@Directive({
    selector: '[mdcIconToggle]',
    providers: [
        {provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcIconToggleDirective) },
        {provide: AbstractMdcIcon, useExisting: forwardRef(() => MdcIconToggleDirective) }
    ]
})
export class MdcIconToggleDirective extends AbstractMdcIcon implements AfterContentInit {
    /** @internal */
    @HostBinding('class.mdc-icon-button') readonly _cls = true;
    /**
     * The aria-label to assign to the icon toggle. You can override the value for the
     * on respectively off state by assigning to property `labelOn` or `labelOff`.
     */
    @Input() label: string | null = null;
    /**
     * The aria-label to assign to the icon toggle when it is on. If this input has no value,
     * the aria-label will default to the value of the `label` input.
     */
    @Input() labelOn: string | null = null;
    /**
     * The aria-label to assign to the icon toggle when it is off. If this input has no value,
     * the aria-label will default to the value of the `label` input.
     */
    @Input() labelOff: string | null = null;
    /**
     * Event emitted when the state of the icon toggle changes (for example when a user clicks
     * the icon). 
     */
    @Output() readonly onChange: EventEmitter<boolean> = new EventEmitter();
    private _onChange: (value: any) => void = () => {};
    private _onTouched: () => any = () => {};
    private _on = false;
    private _disabled = false;
    private toggleAdapter: MDCIconButtonToggleAdapter = {
        addClass: (className: string) => this._renderer.addClass(this._elm.nativeElement, className),
        removeClass: (className: string) => this._renderer.removeClass(this._elm.nativeElement, className),
        // TODO return mdc-icon-button__icon--on for on...
        hasClass: (className: string) => this._elm.nativeElement.classList.contains(className),
        setAttr: (name: string, value: string) => this._renderer.setAttribute(this._elm.nativeElement, name, value),
        notifyChange: (evtData: MDCIconButtonToggleEventDetail) => {
            this._on = evtData.isOn;
            this._onChange(this._on);
            this.onChange.emit(this._on);
        }
    };
    private toggleFoundation: MDCIconButtonToggleFoundation | null = null;

    constructor(_elm: ElementRef, rndr: Renderer2, registry: MdcEventRegistry) {
        super(_elm, rndr, registry);
    }
  
    ngAfterContentInit() {
        this.initRipple(true);
        this.toggleFoundation = new MDCIconButtonToggleFoundation(this.toggleAdapter);
        this.toggleFoundation.init();
    }
  
    ngOnDestroy() {
        this.destroyRipple();
        this.toggleFoundation?.destroy();
        this.toggleFoundation = null;
    }

    /** @internal */
    writeValue(obj: any) {
        this.on = !!obj;
    }

    /** @internal */
    registerOnChange(onChange: (value: any) => void) {
        this._onChange = onChange;
    }

    /** @internal */
    registerOnTouched(onTouched: () => any) {
        this._onTouched = onTouched;
    }

    /** @internal */
    setDisabledState(disabled: boolean) {
        this._disabled = disabled;
    }

    /**
     * The current state of the icon (true for on/pressed, false for off/unpressed).
     */
    @Input() get on() {
        return this.toggleFoundation ? this.toggleFoundation.isOn() : this._on;
    }

    set on(value: boolean) {
        const old = this.toggleFoundation ? this.toggleFoundation.isOn() : this._on;
        this._on = asBoolean(value);
        if (this.toggleFoundation)
            this.toggleFoundation.toggle(this._on);
        if (this._on !== old)
            this.onChange.emit(this._on);
    }

    static ngAcceptInputType_on: boolean | '';

    /** @internal */
    @HostBinding('attr.aria-label') get _label() {
        return this._on ? (this.labelOn || this.label) : (this.labelOff || this.label);
    }
    
    /** @internal */
    @HostListener('click') _onClick() {
        this.toggleFoundation?.handleClick();
    }

    /** @internal */
    @HostListener('blur') _onBlur() {
        this._onTouched();
    }

    /**
     * To disable the icon, set this input to true.
     */
    @Input()
    @HostBinding()
    get disabled() {
        return this._disabled;
    }

    set disabled(value: boolean) {
        this._disabled = asBoolean(value);
    }

    static ngAcceptInputType_disabled: boolean | '';
}

/**
 * Directive for adding Angular Forms (<code>ControlValueAccessor</code>) behavior to an
 * <code>MdcIconToggleDirective</code>. Allows the use of the Angular Forms API with
 * icon toggle buttons, e.g. binding to <code>[(ngModel)]</code>, form validation, etc.
 */
@Directive({
    selector: '[mdcIconToggle][formControlName],[mdcIconToggle][formControl],[mdcIconToggle][ngModel]',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MdcFormsIconButtonDirective), multi: true}
    ]
})
export class MdcFormsIconButtonDirective implements ControlValueAccessor {
    constructor(@Self() private mdcIconButton: MdcIconToggleDirective) {
    }

    /** @internal */
    writeValue(obj: any) {
        this.mdcIconButton.writeValue(obj);
    }

    /** @internal */
    registerOnChange(onChange: (value: any) => void) {
        this.mdcIconButton.registerOnChange(onChange);
    }

    /** @internal */
    registerOnTouched(onTouched: () => any) {
        this.mdcIconButton.registerOnTouched(onTouched);
    }

    /** @internal */
    setDisabledState(disabled: boolean) {
        this.mdcIconButton.setDisabledState(disabled);
    }
}

export const ICON_BUTTON_DIRECTIVES = [
    MdcIconDirective, MdcIconButtonDirective, MdcIconToggleDirective, MdcFormsIconButtonDirective
];
