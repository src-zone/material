import { AfterContentInit, AfterViewInit, Directive, ElementRef, EventEmitter, forwardRef,
    HostBinding, Input, OnChanges, OnDestroy, Output, Renderer2, Self, SimpleChange, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MDCSliderFoundation, strings } from '@material/slider';
import { MdcSliderAdapter } from './mdc.slider.adapter';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

interface MdcSliderFoundationInterface {
    init: () => void,
    destroy: () => void,
    setupTrackMarker(),
    layout(),
    getValue(),
    setValue(value: number),
    getMax(): number,
    setMax(max: number),
    getMin(): number,
    setMin(min: number),
    getStep(): number,
    setStep(step: number),
    isDisabled(): boolean,
    setDisabled(disabled: boolean),
}

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
    private _initialized = false;
    private _elmThumbCntr: HTMLElement;
    private _elmSliderPin: HTMLElement;
    private _elmValueMarker: HTMLElement;
    private _elmTrack: HTMLElement;
    private _elmTrackMarkerCntr: HTMLElement;
    private _reinitTabIndex: number;
    private _onChange: (value: any) => void = (value) => {};
    private _onTouched: () => any = () => {};
    private _discrete = false;
    private _markers = false;
    private _disabled = false;
    private _value = 0;
    private _min = 0;
    private _max = 100;
    private _step = 0;
    private _lastWidth: number;
    // works around bug https://github.com/material-components/material-components-web/issues/1429:
    private _interactionHandlers: {type: string, handler: EventListener}[] = [];

    private mdcAdapter: MdcSliderAdapter = {
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
        setAttribute: (name: string, value: string) => {this._rndr.setAttribute(this._root.nativeElement, name, value); },
        removeAttribute: (name: string) => {this._rndr.removeAttribute(this._root.nativeElement, name); },
        computeBoundingRect: () => this._root.nativeElement.getBoundingClientRect(),
        getTabIndex: () => this._root.nativeElement.tabIndex,
        registerInteractionHandler: (type: string, handler: EventListener) => {
            this._registry.listen(this._rndr, type, handler, this._root);
            this._interactionHandlers.push({type: type, handler: handler});
        },
        deregisterInteractionHandler: (type: string, handler: EventListener) => {
            this._registry.unlisten(type, handler);
            for (let i = 0; i != this._interactionHandlers.length; ++i) {
                let handlerInfo = this._interactionHandlers[i];
                if (handlerInfo.type === type && handlerInfo.handler === handler) {
                    this._interactionHandlers.splice(i, 1);
                    break;
                }
            }
        },
        registerThumbContainerInteractionHandler: (type: string, handler: EventListener) => {
            this._registry.listenElm(this._rndr, type, handler, this._elmThumbCntr);
        },
        deregisterThumbContainerInteractionHandler: (type: string, handler: EventListener) => {
            this._registry.unlisten(type, handler);
        },
        registerBodyInteractionHandler: (type: string, handler: EventListener) => {
            this._registry.listenElm(this._rndr, type, handler, document.body);
        },
        deregisterBodyInteractionHandler: (type: string, handler: EventListener) => {
            this._registry.unlisten(type, handler);
        },
        registerResizeHandler: (handler: EventListener) => {
            this._registry.listenElm(this._rndr, 'resize', handler, window);
        },
        deregisterResizeHandler: (handler: EventListener) => {
            this._registry.unlisten('resize', handler);
        },
        notifyInput: () => {
            let newValue = this.foundation.getValue();
            if (newValue !== this._value) {
                this._value = newValue;
                this.notifyValueChanged(true);
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
                this._elmValueMarker.innerText = value != null ? value.toString() : null;
        },
        appendTrackMarkers: (numMarkers: number) => {
            if (this._elmTrackMarkerCntr) {
                const frag = document.createDocumentFragment();
                for (let i = 0; i < numMarkers; i++) {
                    const marker = document.createElement('div');
                    marker.classList.add('mdc-slider__track-marker');
                    frag.appendChild(marker);
                }
                this._rndr.appendChild(this._elmTrackMarkerCntr, frag);
            }
        },
        removeTrackMarkers: () => {
            if (this._elmTrackMarkerCntr)
                while (this._elmTrackMarkerCntr.firstChild)
                    this._rndr.removeChild(this._elmTrackMarkerCntr, this._elmTrackMarkerCntr.firstChild);
        },
        setLastTrackMarkersStyleProperty: (propertyName: string, value: string) => {
            const lastTrackMarker = this._root.nativeElement.querySelector('.mdc-slider__track-marker:last-child');
            if (lastTrackMarker)
                this._rndr.setStyle(lastTrackMarker, propertyName, value);
        },
        isRTL: () => getComputedStyle(this._root.nativeElement).direction === 'rtl'
    };
    private foundation: MdcSliderFoundationInterface = new MDCSliderFoundation(this.mdcAdapter);

    constructor(private _rndr: Renderer2, private _root: ElementRef, private _registry: MdcEventRegistry) {
    }

    ngAfterContentInit() {
        this.initElements();
        this.initDefaultAttributes();
        this.foundation.init();
        this._lastWidth = this.mdcAdapter.computeBoundingRect().width;
        this.updateValues({}, true);
        this._initialized = true;
    }

    ngAfterViewInit() {
        this.updateLayout();
    }

    ngOnDestroy() {
        this.foundation.destroy();
    }

    ngOnChanges(changes: SimpleChanges) {
        this._onChanges(changes);
    }

    _onChanges(changes: SimpleChanges, callValueAccessorOnValueChange = true) {
        if (this._initialized) {
            if (this.isChanged('isDiscrete', changes) || this.isChanged('hasMarkers', changes)) {
                for (let handlerInfo of this._interactionHandlers)
                    // workaround for uspstream bug: https://github.com/material-components/material-components-web/issues/1429
                    this._registry.unlisten(handlerInfo.type, handlerInfo.handler);
                this._interactionHandlers = [];
                this.foundation.destroy();
                this.initElements();
                this.initDefaultAttributes();
                this.foundation = new MDCSliderFoundation(this.mdcAdapter);
                this.foundation.init();
            }
            this.updateValues(changes, callValueAccessorOnValueChange);
            this.updateLayout();
        }
    }

    private isChanged(name: string, changes: SimpleChanges) {
        return changes[name] && changes[name].currentValue !== changes[name].previousValue;
    }

    private initElements() {
        // initElements is also called when changes dictate a new Foundation initialization,
        // in which case we create new child elements:
        while (this._root.nativeElement.firstChild)
            this._rndr.removeChild(this._root.nativeElement, this._root.nativeElement.firstChild);
        const elmTrackContainer = this.addElement(this._root.nativeElement, 'div', ['mdc-slider__track-container']);
        this._elmTrack = this.addElement(elmTrackContainer, 'div', ['mdc-slider__track']);
        if (this._discrete && this._markers)
            this._elmTrackMarkerCntr = this.addElement(elmTrackContainer, 'div', ['mdc-slider__track-marker-container']);
        else
            this._elmTrackMarkerCntr = null;
        this._elmThumbCntr = this.addElement(this._root.nativeElement, 'div', ['mdc-slider__thumb-container']);
        if (this._discrete) {
            this._elmSliderPin = this.addElement(this._elmThumbCntr, 'div', ['mdc-slider__pin']);
            this._elmValueMarker = this.addElement(this._elmSliderPin, 'div', ['mdc-slider__pin-value-marker']);
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
        this.addElement(this._elmThumbCntr, 'div', ['mdc-slider__focus-ring']);
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

    private updateValues(changes: SimpleChanges, callValueAccessorOnChange: boolean) {
        if (this._discrete && this._step < 1) {
            // See https://github.com/material-components/material-components-web/issues/1426
            // mdc-slider doesn't allow a discrete step value < 1 currently:
            this._step = 1;
            setTimeout(() => {this.stepValueChange.emit(this._step); }, 0);
        } else if (this._step < 0) {
            this._step = 0;
            setTimeout(() => {this.stepValueChange.emit(this._step); }, 0);
        }
        if (this._min > this._max) {
            if (this.isChanged('maxValue', changes)) {
                this._min = this._max;
                setTimeout(() => {this.minValueChange.emit(this._min); }, 0);                
            } else {
                this._max = this._min;
                setTimeout(() => {this.maxValueChange.emit(this._max); }, 0);                                
            }
        }
        let oldValue = changes['value'] ? changes['value'].previousValue : this._value;
        if (this._value < this._min)
            this._value = this._min;
        if (this._value > this._max)
            this._value = this._max;
        // find an order in which the changed values will be accepted by the foundation
        // (since the foundation will throw errors for min > max and other conditions):
        if (this._min < this.foundation.getMax()) {
            this.foundation.setMin(this._min);
            this.foundation.setMax(this._max);
        } else {
            this.foundation.setMax(this._max);
            this.foundation.setMin(this._min);
        }
        this.foundation.setStep(this._step);
        if (this.foundation.isDisabled() !== this._disabled) {
            // without this check, MDCFoundation may remove the tabIndex incorrectly,
            // preventing the slider from getting focus on keyboard commands:
            this.foundation.setDisabled(this._disabled);
        }
        this.foundation.setValue(this._value);
        // value may have changed during setValue(), due to step settings:
        this._value = this.foundation.getValue();
        if (oldValue !== this._value)
            setTimeout(() => {this.notifyValueChanged(callValueAccessorOnChange); }, 0);
    }

    private updateLayout() {
        let newWidth = this.mdcAdapter.computeBoundingRect().width;
        if (newWidth !== this._lastWidth) {
            this._lastWidth = newWidth;
            this.foundation.layout();
        }
    }

    private notifyValueChanged(callValueAccessorOnChange: boolean) {
        this.valueChange.emit(this._value);
        if (callValueAccessorOnChange)
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
    get isDiscrete() {
        return this._discrete;
    }
    
    set isDiscrete(value: any) {
        this._discrete = asBoolean(value);
    }

    /**
     * Property to enable/disable the display of track markers. Display markers
     * are only supported for discrete sliders. Thus they are only shown when the values
     * of both hasMarkers and isDiscrete equal true.
     */
    @Input() @HostBinding('class.mdc-slider--display-markers')
    get hasMarkers() {
        return this._markers;
    }

    set hasMarkers(value: any) {
        this._markers = asBoolean(value);
    }

    /**
     * The current value of the slider.
     */
    @Input() @HostBinding('attr.aria-valuenow')
    get value() {
        return this._value;
    }

    set value(value: string | number) {
        this._value = +value;
    }

    /**
     * The minumum allowed value of the slider.
     */
    @Input() @HostBinding('attr.aria-valuemin')
    get minValue() {
        return this._min;
    }

    set minValue(value: string | number) {
        this._min = +value;
    }

    /**
     * The maximum allowed value of the slider.
     */
    @Input() @HostBinding('attr.aria-valuemax')
    get maxValue() {
        return this._max;
    }

    set maxValue(value: string | number) {
        this._max = +value;
    }

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

    set stepValue(value: string | number) {
        this._step = +value;
    }

    /**
     * A property to disable the slider.
     */
    @Input() @HostBinding('attr.aria-disabled')
    get disabled() {
        return this._disabled;
    }

    set disabled(value: any) {
        this._disabled = asBoolean(value);
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
        let change = new SimpleChange(this.mdcSlider.value, +obj, false);
        this.mdcSlider.value = obj;
        this.mdcSlider._onChanges({value: change}, false);
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
