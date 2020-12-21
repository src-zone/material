import { Directive, ElementRef, HostBinding, Input, Optional, Renderer2, Self,
    forwardRef, Output, EventEmitter, OnInit, OnDestroy, ContentChildren, QueryList, HostListener} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCSwitchFoundation, MDCSwitchAdapter } from '@material/switch';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { asBoolean } from '../../utils/value.utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Directive for the native input element of an <code>MdcSwitchDirective</code>.
 */
@Directive({
    selector: 'input[mdcSwitchInput][type=checkbox]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcSwitchInputDirective) }]
})
export class MdcSwitchInputDirective extends AbstractMdcInput implements OnInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-switch__native-control') readonly _cls = true;
    /** @internal */
    @HostBinding('attr.role') _role = 'switch';
    private onDestroy$: Subject<any> = new Subject();
    /** @internal */
    @Output() readonly _checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** @internal */
    @Output() readonly _disabledChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** @internal */
    @Output() readonly _change: EventEmitter<Event> = new EventEmitter<Event>();
    private _id: string | null = null;
    private _disabled = false;
    private _checked = false;

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

    /** @internal */
    @HostListener('change', ['$event']) _onChange(event: Event) {
        // update checked value, but not via this.checked, so we bypass events being sent to:
        // - _checkedChange -> foundation is already updated via _change
        // - _cntr.control.setValue -> control is already updated through its own handling of user events
        this._checked = this._elm.nativeElement.checked; // bypass 
        this._change.emit(event);
    }

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
}

/**
 * Directive for the mandatory thumb element of an `mdcSwitch`. See `mdcSwitch` for more
 * information.
 */
@Directive({
    selector: '[mdcSwitchThumb]'
})
export class MdcSwitchThumbDirective {
    /** @internal */
    @HostBinding('class.mdc-switch__thumb-underlay') readonly _cls = true;

    constructor(private elm: ElementRef, private rndr: Renderer2) {
        this.addThumb();
    }

    private addThumb() {
        const thumb = this.rndr.createElement('div');
        this.rndr.addClass(thumb, 'mdc-switch__thumb');
        this.rndr.appendChild(this.elm.nativeElement, thumb);
    }
}

/**
 * Directive for creating a Material Design switch component. The switch is driven by an
 * underlying native checkbox input, which must use the `mdcSwitchInput` directive. The
 * `mdcSwitchInput` must be wrapped by an `mdcSwitchThumb`, which must be a direct child of this
 * `mdcSwitch` directive.
 * 
 * The current implementation will add all other required DOM elements (such as the
 * switch-track). Future implementations will also support supplying (customized) elements
 * for those.
 * 
 * This directive can be used together with an <code>mdcFormField</code> to
 * easily position switches and their labels, see
 * <a href="/components/form-field">mdcFormField</a>.
 */
@Directive({
    selector: '[mdcSwitch]'
})
export class MdcSwitchDirective {
    /** @internal */
    @HostBinding('class.mdc-switch') readonly _cls = true;
    private onDestroy$: Subject<any> = new Subject();
    private onInputChange$: Subject<any> = new Subject();
    /** @internal */
    @ContentChildren(MdcSwitchInputDirective, {descendants: true}) _inputs?: QueryList<MdcSwitchInputDirective>;
    private mdcAdapter: MDCSwitchAdapter = {
        addClass: (className: string) => {
            this.rndr.addClass(this.root.nativeElement, className);
        },
        removeClass: (className: string) => {
            this.rndr.removeClass(this.root.nativeElement, className);
        },
        setNativeControlAttr: (attr: string, value: string) => this.rndr.setAttribute(this._input!._elm.nativeElement, attr, value),
        setNativeControlChecked: () => undefined, // nothing to do, checking/unchecking is done directly on the input
        setNativeControlDisabled: () => undefined // nothing to do, enabling/disabling is done directly on the input
    };
    private foundation: MDCSwitchFoundation | null = null;

    constructor(private rndr: Renderer2, private root: ElementRef) {
        this.addTrack();
    }

    ngAfterContentInit() {
        if (this._input) {
            this.initFoundation();
        }
        this._inputs!.changes.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            if (this.foundation)
                this.foundation.destroy();
            if (this._input)
                this.initFoundation();
            else
                this.foundation = null;
            this.subscribeInputChanges();
        });
        this.subscribeInputChanges();
    }

    ngOnDestroy() {
        this.onInputChange$.next(); this.onInputChange$.complete();
        this.onDestroy$.next(); this.onDestroy$.complete();
        if (this.foundation) {
            this.foundation.destroy();
            this.foundation = null;
        }
    }

    private initFoundation() {
        this.foundation = new MDCSwitchFoundation(this.mdcAdapter);
        this.foundation.init();
        // The foundation doesn't correctly set the aria-checked attribute and the checked/disabled styling
        // on initialization. So let's help it to not forget that:
        this.foundation.setChecked(this._input!.checked);
        this.foundation.setDisabled(this._input!.disabled);
    }

    private addTrack() {
        const track = this.rndr.createElement('div');
        this.rndr.addClass(track, 'mdc-switch__track');
        this.rndr.appendChild(this.root.nativeElement, track);
    }


    private subscribeInputChanges() {
        this.onInputChange$.next();
        this._input?._checkedChange.asObservable().pipe(takeUntil(this.onInputChange$)).subscribe(checked => this.foundation?.setChecked(checked));
        this._input?._disabledChange.asObservable().pipe(takeUntil(this.onInputChange$)).subscribe(disabled => {
            this.foundation?.setDisabled(disabled);
        });
        this._input?._change.asObservable().pipe(takeUntil(this.onInputChange$)).subscribe((event) => {
            this.foundation?.handleChange(event);
        });
    }

    private get _input() {
        return this._inputs && this._inputs.length > 0 ? this._inputs.first : null;
    }
}

export const SWITCH_DIRECTIVES = [
    MdcSwitchInputDirective,
    MdcSwitchThumbDirective,
    MdcSwitchDirective
];
