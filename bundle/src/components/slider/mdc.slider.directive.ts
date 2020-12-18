import { AfterContentInit, AfterViewInit, Directive, ElementRef, EventEmitter, forwardRef,
    HostBinding, HostListener, Inject, Input, OnChanges, OnDestroy, Output, Renderer2, Self, SimpleChange,
    SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MDCSliderFoundation, MDCSliderAdapter } from '@material/slider';
import { events } from '@material/dom';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Directive for creating a Material Design slider input.
 * (Modelled after the <code>&lt;input type="range"/&gt;</code> element).
 * The slider is fully accessible. The current implementation
 * will add and manage all DOM child elements that are required for the wrapped
 * <code>mdc-slider</code> component.
 * Future implementations will also support supplying (customized)
 * DOM children.
 */
@Directive({
    selector: '[mdcSlider]'
})
export class MdcSliderDirective implements AfterContentInit, AfterViewInit, OnChanges, OnDestroy {
    @HostBinding('class.mdc-slider') _cls = true;
    @HostBinding('attr.role') _role: string = 'slider';
    /**
     * Event emitted when the value changes. The value may change because of user input,
     * or as a side affect of setting new min, max, or step values.
     */
    @Output() valueChange: EventEmitter<number> = new EventEmitter();
    /**
     * Event emitted when the min range value changes. This may happen as a side effect
     * of setting a new max value (when the new max is smaller than the old min).
     */
    @Output() minValueChange: EventEmitter<number> = new EventEmitter();
    /**
     * Event emitted when the max range value changes. This may happen as a side effect
     * of setting a new min value (when the new min is larger than the old max).
     */
    @Output() maxValueChange: EventEmitter<number> = new EventEmitter();
    /**
     * Event emitted when the step value changes. This may happen as a side effect
     * of making the slider discrete.
     */
    @Output() stepValueChange: EventEmitter<number> = new EventEmitter();
    private trackCntr: HTMLElement | null = null;
    private _elmThumbCntr: HTMLElement | null = null;
    private _elmSliderPin: HTMLElement | null = null;
    private _elmValueMarker: HTMLElement | null = null;
    private _elmTrack: HTMLElement | null = null;
    private _elmTrackMarkerCntr: HTMLElement | null = null;
    private _reinitTabIndex: number | null = null;
    private _onChange: (value: any) => void = (value) => {};
    private _onTouched: () => any = () => {};
    private _discrete = false;
    private _markers = false;
    private _disabled = false;
    private _value: number = 0;
    private _min = 0;
    private _max = 100;
    private _step = 0;
    private _lastWidth: number | null = null;

    private mdcAdapter: MDCSliderAdapter = {
        hasClass: (className: string) => {
            if (className === 'mdc-slider--discrete')
                return this._discrete;
            if (className === 'mdc-slider--display-markers')
                return this._markers;
            return this._root.nativeElement.classList.contains(className);
        },
        addClass: (className: string) => {
            this._rndr.addClass(this._root.nativeElement, className);
        },
        removeClass: (className: string) => {
            this._rndr.removeClass(this._root.nativeElement, className);
        },
        getAttribute: (name: string) => this._root.nativeElement.getAttribute(name),
        setAttribute: (name: string, value: string) => {
            // skip attributes that we control with angular
            if (!/^aria-(value.*|disabled)$/.test(name))
                this._rndr.setAttribute(this._root.nativeElement, name, value);
        },
        removeAttribute: (name: string) => {this._rndr.removeAttribute(this._root.nativeElement, name); },
        computeBoundingRect: () => this._root.nativeElement.getBoundingClientRect(),
        getTabIndex: () => this._root.nativeElement.tabIndex,
        registerInteractionHandler: (evtType, handler) => this._registry.listen(this._rndr, evtType, handler, this._root, events.applyPassive()),
        deregisterInteractionHandler: (evtType, handler) => this._registry.unlisten(evtType, handler),
        registerThumbContainerInteractionHandler: (evtType, handler) => this._registry.listenElm(this._rndr, evtType, handler, this._elmThumbCntr!, events.applyPassive()),
        deregisterThumbContainerInteractionHandler: (evtType, handler) => this._registry.unlisten(evtType, handler),
        registerBodyInteractionHandler: (evtType, handler) => this._registry.listenElm(this._rndr, evtType, handler, this.document.body),
        deregisterBodyInteractionHandler: (evtType, handler) => this._registry.unlisten(evtType, handler),
        registerResizeHandler: (handler) => this._registry.listenElm(this._rndr, 'resize', handler, window),
        deregisterResizeHandler: (handler) => this._registry.unlisten('resize', handler),
        notifyInput: () => {
            let newValue = this.asNumber(this.foundation!.getValue());
            if (newValue !== this._value) {
                this._value = newValue!;
                this.notifyValueChanged();
            }
        },
        notifyChange: () => {
            // currently not handling this event, if there is a usecase for this, please
            // create a feature request.
        },
        setThumbContainerStyleProperty: (propertyName: string, value: string) => {
            this._rndr.setStyle(this._elmThumbCntr, propertyName, value);
        },
        setTrackStyleProperty: (propertyName: string, value: string) => {
            this._rndr.setStyle(this._elmTrack, propertyName, value);
        },
        setMarkerValue: (value: number) => {
            if (this._elmValueMarker)
                this._elmValueMarker.innerText = value != null ? value.toLocaleString() : '';
        },
        setTrackMarkers: (step, max, min) => {
            if (this._elmTrackMarkerCntr) {
                // from https://github.com/material-components/material-components-web/blob/v5.1.0/packages/mdc-slider/component.ts#L141
                const stepStr = step.toLocaleString();
                const maxStr = max.toLocaleString();
                const minStr = min.toLocaleString();
                const markerAmount = `((${maxStr} - ${minStr}) / ${stepStr})`;
                const markerWidth = `2px`;
                const markerBkgdImage = `linear-gradient(to right, currentColor ${markerWidth}, transparent 0)`;
                const markerBkgdLayout = `0 center / calc((100% - ${markerWidth}) / ${markerAmount}) 100% repeat-x`;
                const markerBkgdShorthand = `${markerBkgdImage} ${markerBkgdLayout}`;
                this._rndr.setStyle(this._elmTrackMarkerCntr, 'background', markerBkgdShorthand);
            }
        },
        isRTL: () => getComputedStyle(this._root.nativeElement).direction === 'rtl'
     
    };
    private foundation: MDCSliderFoundation | null = null;
    private document: Document;

    constructor(private _rndr: Renderer2, private _root: ElementRef, private _registry: MdcEventRegistry,
        @Inject(DOCUMENT) doc: any) {
            this.document = doc as Document; // work around ngc issue https://github.com/angular/angular/issues/20351
    }

    ngAfterContentInit() {
        this.initElements();
        this.initDefaultAttributes();
        this.foundation = new MDCSliderFoundation(this.mdcAdapter)
        this.foundation.init();
        this._lastWidth = this.mdcAdapter.computeBoundingRect().width;
        this.updateValues({});
    }

    ngAfterViewInit() {
        this.updateLayout();
    }

    ngOnDestroy() {
        this.foundation?.destroy();
    }

    ngOnChanges(changes: SimpleChanges) {
        this._onChanges(changes);
    }

    _onChanges(changes: SimpleChanges) {
        if (this.foundation) {
            if (this.isChanged('discrete', changes) || this.isChanged('markers', changes)) {
                this.foundation.destroy();
                this.initElements();
                this.initDefaultAttributes();
                this.foundation = new MDCSliderFoundation(this.mdcAdapter);
                this.foundation.init();
            }
            this.updateValues(changes);
            this.updateLayout();
        }
    }

    private isChanged(name: string, changes: SimpleChanges) {
        return changes[name] && changes[name].currentValue !== changes[name].previousValue;
    }

    private initElements() {
        // initElements is also called when changes dictate a new Foundation initialization,
        // in which case we create new child elements:
        if (this.trackCntr) {
            this._rndr.removeChild(this._root.nativeElement, this.trackCntr);
            this._rndr.removeChild(this._root.nativeElement, this._elmThumbCntr);
        }
        this.trackCntr = this.addElement(this._root.nativeElement, 'div', ['mdc-slider__track-container']);
        this._elmTrack = this.addElement(this.trackCntr!, 'div', ['mdc-slider__track']);
        if (this._discrete && this._markers)
            this._elmTrackMarkerCntr = this.addElement(this.trackCntr!, 'div', ['mdc-slider__track-marker-container']);
        else
            this._elmTrackMarkerCntr = null;
        this._elmThumbCntr = this.addElement(this._root.nativeElement, 'div', ['mdc-slider__thumb-container']);
        if (this._discrete) {
            this._elmSliderPin = this.addElement(this._elmThumbCntr!, 'div', ['mdc-slider__pin']);
            this._elmValueMarker = this.addElement(this._elmSliderPin!, 'div', ['mdc-slider__pin-value-marker']);
        } else {
            this._elmSliderPin = null;
            this._elmValueMarker = null;
        }
        const svg = this._rndr.createElement('svg', 'svg');
        this._rndr.addClass(svg, 'mdc-slider__thumb');
        this._rndr.setAttribute(svg, 'width', '21');
        this._rndr.setAttribute(svg, 'height', '21');
        this._rndr.appendChild(this._elmThumbCntr, svg);
        const circle = this._rndr.createElement('circle', 'svg');
        this._rndr.setAttribute(circle, 'cx', '10.5');
        this._rndr.setAttribute(circle, 'cy', '10.5');
        this._rndr.setAttribute(circle, 'r', '7.875');
        this._rndr.appendChild(svg, circle);
        this.addElement(this._elmThumbCntr!, 'div', ['mdc-slider__focus-ring']);
    }

    private addElement(parent: HTMLElement, element: string, classNames: string[]) {
        let child = this._rndr.createElement(element);
        classNames.forEach(name => {
            this._rndr.addClass(child, name);
        });
        this._rndr.appendChild(parent, child);
        return child;
    }

    private initDefaultAttributes() {
        if (this._reinitTabIndex)
            // value was set the first time we initialized the foundation,
            // so it should also be set when we reinitialize evrything:
            this._root.nativeElement.tabIndex = this._reinitTabIndex;
        else if (!this._root.nativeElement.hasAttribute('tabindex')) {
            // unless overridden by another tabIndex, we want sliders to
            // participate in tabbing (the foundation will remove the tabIndex
            // when the slider is disabled, reset to the initial value when enabled again):
            this._root.nativeElement.tabIndex = 0;
            this._reinitTabIndex = 0;
        } else {
            this._reinitTabIndex = this._root.nativeElement.tabIndex;
        }
    }

    private updateValues(changes: SimpleChanges) {
        if (this._discrete && this._step < 1) {
            // See https://github.com/material-components/material-components-web/issues/1426
            // mdc-slider doesn't allow a discrete step value < 1 currently:
            this._step = 1;
            Promise.resolve().then(() => {this.stepValueChange.emit(this._step); });
        } else if (this._step < 0) {
            this._step = 0;
            Promise.resolve().then(() => {this.stepValueChange.emit(this._step); });
        }
        if (this._min > this._max) {
            if (this.isChanged('maxValue', changes)) {
                this._min = this._max;
                Promise.resolve().then(() => {this.minValueChange.emit(this._min); });
            } else {
                this._max = this._min;
                Promise.resolve().then(() => {this.maxValueChange.emit(this._max); });
            }
        }
        let currValue = changes['value'] ? changes['value'].currentValue : this._value;
        if (this._value < this._min)
            this._value = this._min;
        if (this._value > this._max)
            this._value = this._max;
        // find an order in which the changed values will be accepted by the foundation
        // (since the foundation will throw errors for min > max and other conditions):
        if (this._min < this.foundation!.getMax()) {
            this.foundation!.setMin(this._min);
            this.foundation!.setMax(this._max);
        } else {
            this.foundation!.setMax(this._max);
            this.foundation!.setMin(this._min);
        }
        this.foundation!.setStep(this._step);
        if (this.foundation!.isDisabled() !== this._disabled) {
            // without this check, MDCFoundation may remove the tabIndex incorrectly,
            // preventing the slider from getting focus on keyboard commands:
            this.foundation!.setDisabled(this._disabled);
        }
        this.foundation!.setValue(this._value);
        // value may have changed during setValue(), due to step settings:
        this._value = (this._value == null ? null : this.asNumber(this.foundation!.getValue()))!; // TODO
        // compare with '!=' as null and undefined are considered the same (for initialisation sake):
        if (currValue != this._value && !(isNaN(currValue) && isNaN(this._value)))
            Promise.resolve().then(() => {this.notifyValueChanged(); });
    }

    private updateLayout() {
        let newWidth = this.mdcAdapter.computeBoundingRect().width;
        if (newWidth !== this._lastWidth) {
            this._lastWidth = newWidth;
            this.foundation!.layout();
        }
    }

    private notifyValueChanged() {
        this.valueChange.emit(this._value);
        this._onChange(this._value);
    }

    /** @docs-private */
    registerOnChange(onChange: (value: any) => void) {
        this._onChange = onChange;
    }

    /** @docs-private */
    registerOnTouched(onTouched: () => any) {
        this._onTouched = onTouched;
    }

    /**
     * Make the slider discrete. Note from the wrapped <code>mdc-slider</code>
     * component:
     * <blockquote>If a slider contains a step value it does not mean that the slider is a "discrete" slider.
     * "Discrete slider" is a UX treatment, while having a step value is behavioral.</blockquote>
     */
    @Input() @HostBinding('class.mdc-slider--discrete')
    get discrete() {
        return this._discrete;
    }
    
    set discrete(value: boolean) {
        this._discrete = asBoolean(value);
    }

    static ngAcceptInputType_discrete: boolean | '';

    /**
     * Property to enable/disable the display of track markers. Display markers
     * are only supported for discrete sliders. Thus they are only shown when the values
     * of both markers and discrete equal true.
     */
    @Input() @HostBinding('class.mdc-slider--display-markers')
    get markers() {
        return this._markers;
    }

    set markers(value: boolean) {
        this._markers = asBoolean(value);
    }

    static ngAcceptInputType_markers: boolean | '';

    /**
     * The current value of the slider.
     */
    @Input() @HostBinding('attr.aria-valuenow')
    get value() {
        return this._value;
    }

    set value(value: number) {
        this._value = this.asNumber(value)!;
    }

    static ngAcceptInputType_value: string | number;

    /**
     * The minumum allowed value of the slider.
     */
    @Input() @HostBinding('attr.aria-valuemin')
    get minValue() {
        return this._min;
    }

    set minValue(value: number) {
        this._min = this.asNumber(value)!;
    }

    static ngAcceptInputType_minValue: string | number;

    /**
     * The maximum allowed value of the slider.
     */
    @Input() @HostBinding('attr.aria-valuemax')
    get maxValue() {
        return this._max;
    }

    set maxValue(value: number) {
        this._max = this.asNumber(value)!;
    }

    static ngAcceptInputType_maxValue: string | number;

    /**
     * Set the step value (or set to 0 for no step value).
     * The step value can be a floating point value &gt;= 0.
     * The slider will quantize all values to match the step value, except for the minimum and
     * maximum, which can always be set.
     * Discrete sliders are required to have a step value other than 0.
     * Note from the wrapped <code>mdc-slider</code> component:
     * <blockquote>If a slider contains a step value it does not mean that the slider is a "discrete" slider.
     * "Discrete slider" is a UX treatment, while having a step value is behavioral.</blockquote>
     */
    @Input()
    get stepValue() {
        return this._step;
    }

    set stepValue(value: number) {
        this._step = this.asNumber(value)!;
    }

    static ngAcceptInputType_stepValue: string | number;

    /**
     * A property to disable the slider.
     */
    @Input() @HostBinding('attr.aria-disabled')
    get disabled() {
        return this._disabled;
    }

    set disabled(value: boolean) {
        this._disabled = asBoolean(value);
    }

    static ngAcceptInputType_disabled: boolean | '';

    /** @docs-private */
    @HostListener('blur') _onBlur() {
        this._onTouched();
    }

    /** @docs-private */
    asNumber(value: number | string): number | null { // TODO null return values are not accounted for
        if (value == null)
            return <number>value;
        let result = +value;
        if (isNaN(result))
            return null;
        return result;
    }
}

/**
 * Directive for adding Angular Forms (<code>ControlValueAccessor</code>) behavior to an
 * <code>MdcSliderDirective</code>. Allows the use of the Angular Forms API with
 * icon toggles, e.g. binding to <code>[(ngModel)]</code>, form validation, etc.
 */
@Directive({
    selector: '[mdcSlider][formControlName],[mdcSlider][formControl],[mdcSlider][ngModel]',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MdcFormsSliderDirective), multi: true}
    ]
})
export class MdcFormsSliderDirective implements ControlValueAccessor {
    constructor(@Self() private mdcSlider: MdcSliderDirective) {
    }

    /** @docs-private */
    writeValue(obj: any) {
        let change = new SimpleChange(this.mdcSlider.value, this.mdcSlider.asNumber(obj), false);
        this.mdcSlider.value = obj;
        this.mdcSlider._onChanges({value: change});
    }

    /** @docs-private */
    registerOnChange(onChange: (value: any) => void) {
        this.mdcSlider.registerOnChange(onChange);
    }

    /** @docs-private */
    registerOnTouched(onTouched: () => any) {
        this.mdcSlider.registerOnTouched(onTouched);
    }

    /** @docs-private */
    setDisabledState(disabled: boolean) {
        this.mdcSlider.disabled = disabled;
    }
}

export const SLIDER_DIRECTIVES = [
    MdcSliderDirective, MdcFormsSliderDirective
];
