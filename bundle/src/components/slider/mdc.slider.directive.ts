import { AfterContentInit, Directive, ElementRef, EventEmitter,
    HostBinding, Input, OnChanges, OnDestroy, Output, Renderer2, SimpleChanges } from '@angular/core';
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
export class MdcSliderDirective implements AfterContentInit, OnChanges, OnDestroy {
    @HostBinding('class.mdc-slider') _hasHostClass = true;
    @HostBinding('attr.role') _role: string = 'slider';
    /**
     * Event emitted when the value changes. The value may change because of user input,
     * or as a side affect of setting new min, max, or step values.
     */
    @Output() mdcValueChange: EventEmitter<number> = new EventEmitter();
    /**
     * Event emitted when the min range value changes. This may happen as a side effect
     * of setting a new max value (when the new max is smaller than the old min).
     */
    @Output() mdcMinChange: EventEmitter<number> = new EventEmitter();
    /**
     * Event emitted when the max range value changes. This may happen as a side effect
     * of setting a new min value (when the new min is larger than the old max).
     */
    @Output() mdcMaxChange: EventEmitter<number> = new EventEmitter();
    /**
     * Event emitted when the step value changes. This may happen as a side effect
     * of making the slider discrete.
     */
    @Output() mdcStepChange: EventEmitter<number> = new EventEmitter();
    private _initialized = false;
    private _elmThumbCntr: HTMLElement;
    private _elmSliderPin: HTMLElement;
    private _elmValueMarker: HTMLElement;
    private _elmTrack: HTMLElement;
    private _elmTrackMarkerCntr: HTMLElement;
    private _reinitTabIndex: number;
    private _discrete = false;
    private _markers = false;
    private _disabled = false;
    private _value = 0;
    private _min = 0;
    private _max = 100;
    private _step = 0;

    private mdcAdapter: MdcSliderAdapter = {
        hasClass: (className: string) => {
            if (className === 'class.mdc-slider--discrete')
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
        },
        deregisterInteractionHandler: (type: string, handler: EventListener) => {
            this._registry.unlisten(type, handler);
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
            this.mdcValueChange.emit(this.foundation.getValue());
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
                this._elmValueMarker.innerText = value ? value.toString() : null;
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
        this.updateValues({});
        this._initialized = true;
    }

    ngOnDestroy() {
        this.foundation.destroy();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this._initialized) {
            if (this.isChanged('mdcDiscrete', changes) || this.isChanged('mdcMarkers', changes)) {
                this.foundation.destroy();
                this.initElements();
                this.initDefaultAttributes();
                this.foundation = new MDCSliderFoundation(this.mdcAdapter);
                this.foundation.init();
            }
            this.updateValues(changes);
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

    private updateValues(changes: SimpleChanges) {
        if (this._discrete && this._step < 1) {
            // See https://github.com/material-components/material-components-web/issues/1426
            // mdc-slider doesn't allow a discrete step value < 1 currently:
            this._step = 1;
            setTimeout(() => {this.mdcStepChange.emit(this._step); }, 0);
        } else if (this._step < 0) {
            this._step = 0;
            setTimeout(() => {this.mdcStepChange.emit(this._step); }, 0);
        }
        if (this._min > this._max) {
            if (this.isChanged('mdcMax', changes)) {
                this._min = this._max;
                setTimeout(() => {this.mdcMinChange.emit(this._min); }, 0);                
            } else {
                this._max = this._min;
                setTimeout(() => {this.mdcMaxChange.emit(this._max); }, 0);                                
            }
        }
        let oldValue = this._value;
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
            setTimeout(() => {this.mdcValueChange.emit(this._value); }, 0);
    }

    /**
     * Make the slider discrete. Note from the wrapped <code>mdc-slider</code>
     * component:
     * <blockquote>If a slider contains a step value it does not mean that the slider is a "discrete" slider.
     * "Discrete slider" is a UX treatment, while having a step value is behavioral.</blockquote>
     */
    @Input() @HostBinding('class.mdc-slider--discrete')
    get mdcDiscrete() {
        return this._discrete;
    }
    
    set mdcDiscrete(value: any) {
        this._discrete = asBoolean(value);
    }

    /**
     * Property to enable/disable the display of track markers. Display markers
     * are only supported for discrete sliders. Thus they are only shown when the values
     * of both mdcMarkers and mdcDiscrete equal true.
     */
    @Input() @HostBinding('class.mdc-slider--display-markers')
    get mdcMarkers() {
        return this._markers;
    }

    set mdcMarkers(value: any) {
        this._markers = asBoolean(value);
    }

    /**
     * The current value of the slider.
     */
    @Input() @HostBinding('attr.aria-valuenow')
    get mdcValue() {
        return this._value;
    }

    set mdcValue(value: string | number) {
        this._value = +value;
    }

    /**
     * The minumum allowed value of the slider.
     */
    @Input() @HostBinding('attr.aria-valuemin')
    get mdcMin() {
        return this._min;
    }

    set mdcMin(value: string | number) {
        this._min = +value;
    }

    /**
     * The maximum allowed value of the slider.
     */
    @Input() @HostBinding('attr.aria-valuemax')
    get mdcMax() {
        return this._max;
    }

    set mdcMax(value: string | number) {
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
    get mdcStep() {
        return this._step;
    }

    set mdcStep(value: string | number) {
        this._step = +value;
    }

    /**
     * A property to disable the slider.
     */
    @Input() @HostBinding('attr.aria-disabled')
    get mdcDisabled() {
        return this._disabled;
    }

    set mdcDisabled(value: any) {
        this._disabled = asBoolean(value);
    }
}
