import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Renderer2,
    Self, forwardRef, HostListener, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MDCCheckboxFoundation, MDCCheckboxAdapter } from '@material/checkbox';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';

/**
 * Directive for the input element of an <code>MdcCheckboxDirective</code>.
 */
@Directive({
    selector: 'input[mdcCheckboxInput][type=checkbox]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcCheckboxInputDirective) }]
})
export class MdcCheckboxInputDirective extends AbstractMdcInput implements OnInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-checkbox__native-control') readonly _cls = true;
    private onDestroy$: Subject<any> = new Subject();
    private _id: string | null = null;
    private _disabled = false;
    private _checked = false;
    private _indeterminate = false;
    /** @internal */
    @Output() readonly _checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** @internal */
    @Output() readonly _indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** @internal */
    @Output() readonly _disabledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public _elm: ElementRef, @Optional() @Self() public _cntr: NgControl) {
        super();
    }

    ngOnInit() {
        this._cntr?.valueChanges!.pipe(takeUntil(this.onDestroy$)).subscribe((value) => {
            this.updateValue(value, true);
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    /** @docs-private */
    @HostBinding()
    @Input() get id() {
        return this._id;
    }
  
    set id(value: string | null) {
        this._id = value;
    }

    /** @docs-private */
    @HostBinding()
    @Input() get disabled() {
        return this._cntr ? !!this._cntr.disabled : this._disabled;
    }

    set disabled(value: boolean) {
        const newVal = asBoolean(value);
        if (newVal != this._disabled) {
            this._disabled = asBoolean(newVal);
            this._disabledChange.emit(newVal);
        }
    }

    static ngAcceptInputType_disabled: boolean | '';

    /** @docs-private */
    @HostBinding()
    @Input() get checked(): boolean {
        return this._checked;
    }

    set checked(value: boolean) {
        this.updateValue(value, false);
    }

    static ngAcceptInputType_checked: boolean | '';

    private updateValue(value: any, fromControl: boolean) {
        // When the 'checked' property is the source of the change, we want to coerce boolean
        // values using asBoolean, so that initializing with an attribute with no value works
        // as expected.
        // When the NgControl is the source of the change we don't want that. The value should
        // be interpreted like NgControl/NgForms handles non-boolean values when binding.
        const newVal = fromControl ? !!value : asBoolean(value);
        if (newVal !== this._checked) {
            this._checked = newVal;
            this._checkedChange.emit(newVal);
        }
        if (!fromControl && this._cntr && newVal !== this._cntr.value) {
            this._cntr.control!.setValue(newVal);
        }
    }

    /** @docs-private */
    @HostBinding()
    @Input() get indeterminate() {
        return this._indeterminate;
    }

    set indeterminate(value: boolean) {
        const newVal = asBoolean(value);
        if (newVal !== this._indeterminate) {
            this._indeterminate = newVal;
            Promise.resolve().then(() => this._indeterminateChange.emit(newVal));
        }
    }

    static ngAcceptInputType_indeterminate: boolean | '';

    // We listen to click-event instead of change-event, because IE doesn't fire the
    // change-event when an indeterminate checkbox is clicked. There's no need to
    // also listen to change-events.
    @HostListener('click') _onChange() {
        // only update the checked state from click if there is no control for which we already
        // listen to value changes:
        if (!this._cntr)
            this.checked = this._elm.nativeElement.checked;
        this.indeterminate = this._elm.nativeElement.indeterminate;
    }
}

/**
 * Directive for creating a Material Design checkbox. The checkbox is driven by an
 * underlying native checkbox input, which must use the <code>MdcCheckboxInputDirective</code>
 * directive.
 * The current implementation will add all other required DOM elements (such as the
 * background and ripple).
 * Future implementations will also support supplying (customized) background
 * elements.
 *
 * This directive can be used together with an <code>mdcFormField</code> to
 * easily position checkboxes and their labels, see
 * <a href="/components/form-field">mdcFormField</a>.
 */
@Directive({
    selector: '[mdcCheckbox]'
})
export class MdcCheckboxDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-checkbox') readonly _cls = true;
    private onDestroy$: Subject<any> = new Subject();
    private onInputChange$: Subject<any> = new Subject();
    /** @internal */
    @ContentChildren(MdcCheckboxInputDirective) _inputs?: QueryList<MdcCheckboxInputDirective>;
    private mdcAdapter: MDCCheckboxAdapter = {
        addClass: (className: string) => this._renderer.addClass(this.root.nativeElement, className),
        removeClass: (className: string) => this._renderer.removeClass(this.root.nativeElement, className),
        setNativeControlAttr: (attr: string, value: string) => this._renderer.setAttribute(this._input!._elm.nativeElement, attr, value),
        removeNativeControlAttr: (attr: string) => this._renderer.removeAttribute(this._input!._elm.nativeElement, attr),
        forceLayout: () => this.root.nativeElement.offsetWidth, // force layout
        isAttachedToDOM: () => !!this._input,
        hasNativeControl: () => !!this._input,
        isChecked: () => this._input!._elm.nativeElement.checked,
        isIndeterminate: () => this._input!._elm.nativeElement.indeterminate,
        setNativeControlDisabled: (disabled: boolean) => this._input!.disabled = disabled
    };
    /** @internal */
    _foundation: MDCCheckboxFoundation | null = null;

    constructor(renderer: Renderer2, private root: ElementRef, registry: MdcEventRegistry) {
        super(root, renderer, registry);
        this.addRippleSurface('mdc-checkbox__ripple');
    }

    ngAfterContentInit() {
        MdcCheckboxDirective.addBackground(this._rippleElm, this._renderer);
        this.initRipple(true);
        if (this._input) {
            this._foundation = new MDCCheckboxFoundation(this.mdcAdapter);
            this._foundation.init();
        }
        this._inputs!.changes.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            this.reinitRipple();
            if (this._foundation)
                this._foundation.destroy();
            if (this._input) {
                this._foundation = new MDCCheckboxFoundation(this.mdcAdapter);
                this._foundation.init();
            } else
                this._foundation = null;
            this.subscribeInputChanges();
        });
        this.subscribeInputChanges();
    }

    ngOnDestroy() {
        this.onInputChange$.next(); this.onInputChange$.complete();
        this.onDestroy$.next(); this.onDestroy$.complete();
        if (this._foundation) {
            this._foundation.destroy();
            this._foundation = null;
        }
        this.destroyRipple();
    }

    private subscribeInputChanges() {
        this.onInputChange$.next();
        this._input?._indeterminateChange.asObservable().pipe(takeUntil(this.onInputChange$)).subscribe(() => this._foundation?.handleChange());
        this._input?._checkedChange.asObservable().pipe(takeUntil(this.onInputChange$)).subscribe(() => this._foundation?.handleChange());
        this._input?._disabledChange.asObservable().pipe(takeUntil(this.onInputChange$)).subscribe(val => this._foundation?.setDisabled(val));
    }

    private static addBackground(elm: ElementRef, renderer: Renderer2) {
        let path = renderer.createElement('path', 'svg');
        renderer.addClass(path, 'mdc-checkbox__checkmark-path');
        renderer.setAttribute(path, 'fill', 'none');
        renderer.setAttribute(path, 'd', 'M1.73,12.91 8.1,19.28 22.79,4.59');
        let svg = renderer.createElement('svg', 'svg');
        renderer.appendChild(svg, path);
        renderer.addClass(svg, 'mdc-checkbox__checkmark');
        renderer.setAttribute(svg, 'viewBox', '0 0 24 24');
        let mixedmark = renderer.createElement('div');
        renderer.addClass(mixedmark, 'mdc-checkbox__mixedmark');
        let bg = renderer.createElement('div');
        renderer.appendChild(bg, svg);
        renderer.appendChild(bg, mixedmark);
        renderer.addClass(bg, 'mdc-checkbox__background');
        renderer.appendChild(elm.nativeElement, bg);
    }

    /** @internal */
    protected getRippleInteractionElement() {
        return this._input?._elm;
    }

    /** @internal */
    @HostListener('animationend')
    onAnimationEnd() {
        this._foundation?.handleAnimationEnd();
    }

    /** @internal */
    get _input() {
        return this._inputs && this._inputs.length > 0 ? this._inputs.first : null;
    }
}

export const CHECKBOX_DIRECTIVES = [
    MdcCheckboxInputDirective,
    MdcCheckboxDirective
];
