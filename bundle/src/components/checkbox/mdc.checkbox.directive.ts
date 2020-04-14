import { AfterContentInit, ContentChild, Directive, ElementRef, HostBinding,
  Input, OnDestroy, Optional, Renderer2, Self, forwardRef, HostListener, Output, EventEmitter, ChangeDetectorRef, ContentChildren, QueryList } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';
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
export class MdcCheckboxInputDirective extends AbstractMdcInput {
    @HostBinding('class.mdc-checkbox__native-control') _cls = true;
    private onDestroy$: Subject<any> = new Subject();
    private _id: string;
    private _disabled = false;
    private _checked = false;;
    private _indeterminate = false;
    /**
     * Event emitted when the `checked` property is changed.
     */
    @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    /**
     * Event emitted when the `intermediate` property is changed.
     */
    @Output() indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() _disabledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public _elm: ElementRef, private cdRef: ChangeDetectorRef, @Optional() @Self() public _cntr: NgControl,
        @Optional() private ngModel: NgModel) {
        super();
    }

    ngOnInit() {
        this.ngModel?.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((value) => {
            this.updateValue(value, false);
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
  
    set id(value: string) {
        this._id = value;
    }

    /** @docs-private */
    @HostBinding()
    @Input() get disabled() {
        return this._cntr ? this._cntr.disabled : this._disabled;
    }

    set disabled(value: any) {
        const newVal = asBoolean(value);
        if (newVal != this._disabled) {
            this._disabled = asBoolean(newVal);
            this._disabledChange.emit(newVal);
        }
    }

    /** @docs-private */
    @HostBinding()
    @Input() get checked() {
        return this._checked;
    }

    set checked(value: any) {
        this.updateValue(value, true);
    }

    private updateValue(value: any, booleanCoerce: boolean) {
        // Don't use asBoolean for ngModel, since CheckboxControlValueAccessor will just set the supplied value,
        //  without string coercion to boolean.
        // When using the 'checked' we do use asBoolean. So that just adding an attribute selected, or
        // setting attribute selected="false" will work as expected:
        const newVal = booleanCoerce ? asBoolean(value) : value;
        if (newVal !== this._checked) {
            this._checked = newVal;
            Promise.resolve().then(() => {
                this.checkedChange.emit(newVal);
            });
        }
        if (this.ngModel && newVal !== this.ngModel.value) {
            Promise.resolve().then(() => {
                this.ngModel.update.emit(newVal);
            });
        }
    }

    /** @docs-private */
    @HostBinding()
    @Input() get indeterminate() {
        return this._indeterminate;
    }

    set indeterminate(value: any) {
        const newVal = asBoolean(value);
        if (newVal !== this._indeterminate) {
            this._indeterminate = newVal;
            Promise.resolve().then(() => this.indeterminateChange.emit(newVal));
        }
    }

    @HostListener('change') _onChange() {
        this.checked = this._elm.nativeElement.checked;
        this.indeterminate = this._elm.nativeElement.indeterminate;
    }

    // TODO IE doesn't fire change event when indeterminate checkbox is clicked,
    //  so we also listen to 'click'. But maybe we should also listen to key events
    //  that may unset the indeterminate state?
    @HostListener('click') _onClick() {
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
 * <a href="/material/components/form-field">mdcFormField</a>.
 */
@Directive({
    selector: '[mdcCheckbox]'
})
export class MdcCheckboxDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-checkbox') _cls = true;
    private onDestroy$: Subject<any> = new Subject();
    private onInputChange$: Subject<any> = new Subject();
    @ContentChildren(MdcCheckboxInputDirective) _inputs: QueryList<MdcCheckboxInputDirective>;
    private mdcAdapter: MDCCheckboxAdapter = {
        addClass: (className: string) => {
            this._renderer.addClass(this.root.nativeElement, className);
        },
        removeClass: (className: string) => {
            this._renderer.removeClass(this.root.nativeElement, className);
        },
        setNativeControlAttr: (attr: string, value: string) => this._renderer.setAttribute(this._input._elm.nativeElement, attr, value),
        removeNativeControlAttr: (attr: string) => this._renderer.removeAttribute(this._input._elm.nativeElement, attr),
        forceLayout: () => this.root.nativeElement.offsetWidth, // force layout
        isAttachedToDOM: () => !!this._input,
        hasNativeControl: () => !!this._input,
        isChecked: () => this._input._elm.nativeElement.checked,
        isIndeterminate: () => this._input._elm.nativeElement.indeterminate,
        setNativeControlDisabled: (disabled: boolean) => {
                this._input.disabled = disabled;
        }
    };
    _foundation: MDCCheckboxFoundation = null;

    constructor(renderer: Renderer2, private root: ElementRef, registry: MdcEventRegistry) {
        super(MdcCheckboxDirective.addRipple(root, renderer), renderer, registry);
    }

    ngAfterContentInit() {
        MdcCheckboxDirective.addBackground(this._rippleElm, this._renderer);
        this.initRipple(true);
        if (this._input) {
            this._foundation = new MDCCheckboxFoundation(this.mdcAdapter);
            this._foundation.init();
        }
        this._inputs.changes.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
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
        this._input?.indeterminateChange.asObservable().pipe(takeUntil(this.onInputChange$)).subscribe(() => this._foundation?.handleChange());
        this._input?.checkedChange.asObservable().pipe(takeUntil(this.onInputChange$)).subscribe(() => this._foundation?.handleChange());
        this._input?._disabledChange.asObservable().pipe(takeUntil(this.onInputChange$)).subscribe(val => this._foundation?.setDisabled(val));
    }

    private static addRipple(elm: ElementRef, renderer: Renderer2) {
        let ripple = renderer.createElement('div');
        renderer.addClass(ripple, 'mdc-checkbox__ripple');
        renderer.appendChild(elm.nativeElement, ripple);
        return elm;
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

    /** @docs-private */
    protected getRippleInteractionElement() {
        return this._input?._elm;
    }

    @HostListener('animationend')
    onAnimationEnd() {
        this._foundation?.handleAnimationEnd();
    }

    private get _input() {
        return this._inputs && this._inputs.length > 0 ? this._inputs.first : null;
    }
}
