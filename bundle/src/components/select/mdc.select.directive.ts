import { AfterContentInit, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener,
  Input, OnDestroy, Output, QueryList, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MDCSelectFoundation, util } from '@material/select';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { MdcSelectAdapter } from './mdc.select.adapter';
import { MdcSimpleMenuDirective } from '../menu/mdc.simple.menu.directive';
import { MdcListDirective, MdcListItemDirective, MdcListFunction } from '../list/mdc.list.directive';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

const CLASS_SELECT = 'mdc-select';
const CLASS_SELECT_SELECTED_TEXT = 'mdc-select__selected-text';

/**
 * Directive for the text representation of an <code>mdcSelect</code> selection control.
 */
@Directive({
    selector: '[mdcSelectedText]'
})
export class MdcSelectTextDirective {
    @HostBinding('class.' + CLASS_SELECT_SELECTED_TEXT) _cls = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * Directive for a spec aligned material design 'Select Control',
 * build on top of a simple menu.
 * This directive should wrap an <code>MdcSelectTextDirective</code>, and
 * an <code>MdcSimpleMenuDirective</code>
 */
@Directive({
    selector: '[mdcSelect]:not(select)'
})
export class MdcSelectDirective implements AfterContentInit, OnDestroy {
    private onDestroy$: Subject<any> = new Subject();
    @HostBinding('class.' + CLASS_SELECT) _cls = true;
    @HostBinding('attr.role') _role = 'listbox';
    @ContentChild(MdcSimpleMenuDirective) _menu: MdcSimpleMenuDirective;
    @ContentChild(MdcSelectTextDirective) _text: MdcSelectTextDirective;
    private _onChange: (value: any) => void = (value) => {};
    private _onTouched: () => any = () => {};
    private _initialized = false;
    private _value: any = null;
    private _disabled = false;
    /**
     * Event emitted when the value of the select changes. Note that when an <code>mdcSelect</code> is used as a FormControl,
     * it's also possible to bind to <code>ngModelChange</code> instead of <code>valueChange</code>.
     */
    @Output() valueChange: EventEmitter<any> = new EventEmitter();
    private mdcAdapter: MdcSelectAdapter = {
        addClass: (className: string) => {this._rndr.addClass(this._elm.nativeElement, className); },
        removeClass: (className: string) => {this._rndr.removeClass(this._elm.nativeElement, className); },
        setAttr: (attr, value) => {this._rndr.setAttribute(this._elm.nativeElement, attr, value); },
        rmAttr: (attr) => {this._rndr.removeAttribute(this._elm.nativeElement, attr); },
        computeBoundingRect: () => this._elm.nativeElement.getBoundingClientRect(),
        registerInteractionHandler: (type, handler) => this._registry.listen(this._rndr, type, handler, this._elm),
        deregisterInteractionHandler: (type, handler) => this._registry.unlisten(type, handler),
        focus: () => {this._elm.nativeElement.focus(); },
        makeTabbable: () => {this._elm.nativeElement.tabIndex = 0; },
        makeUntabbable: () => {this._elm.nativeElement.tabIndex = -1; },
        getComputedStyleValue: (prop) => window.getComputedStyle(this._elm.nativeElement).getPropertyValue(prop),
        setStyle: (propertyName, value) => {this._rndr.setStyle(this._elm.nativeElement, propertyName, value); },
        create2dRenderingContext: () => document.createElement('canvas').getContext('2d'),
        setMenuElStyle: (propertyName, value) => this._rndr.setStyle(this._menuEl, propertyName, value),
        setMenuElAttr: (attr, value) => this._rndr.setAttribute(this._menuEl, attr, value),
        rmMenuElAttr: (attr) => this._rndr.removeAttribute(this._menuEl, attr),
        getMenuElOffsetHeight: () => this._menuEl.offsetHeight,
        openMenu: (focusIndex) => this._menu._component.show({focusIndex}),
        isMenuOpen: () => this._menu._component.open,
        setSelectedTextContent: (selectedTextContent) => {
            if (this._text)
                this._text._elm.nativeElement.textContent = selectedTextContent;
        },
        getNumberOfOptions: () => this._items.length,
        getTextForOptionAtIndex: (index) => this._items[index]._elm.nativeElement.textContent,
        getValueForOptionAtIndex: (index) => this._items[index].value,
        setAttrForOptionAtIndex: (index, attr, value) => this._rndr.setAttribute(this._items[index]._elm.nativeElement, attr, value),
        rmAttrForOptionAtIndex: (index, attr) => this._rndr.removeAttribute(this._items[index]._elm.nativeElement, attr),
        getOffsetTopForOptionAtIndex: (index) => this._items[index]._elm.nativeElement.offsetTop,
        registerMenuInteractionHandler: (type, handler) => {
            let subscription;
            if (type === 'MDCSimpleMenu:selected')
                subscription = this._menu.pick.subscribe(evt => {
                    handler(this.createEvent(type, {index: evt.index}));
                    this._onTouched();
                });
            else if (type === 'MDCSimpleMenu:cancel')
                subscription = this._menu.cancel.subscribe(evt => {
                    handler(this.createEvent(type, {}));
                    this._onTouched();
                });
            else
                throw new Error('Unsupported event type: ' + type);
            this._registry.registerUnlisten(type, handler, () => {subscription.unsubscribe(); });
        },
        deregisterMenuInteractionHandler: (type, handler) => {
            this._registry.unlisten(type, handler);
        },
        notifyChange: () => {
            let idx = this.foundation.getSelectedIndex();
            this._value = (idx == -1) ? null : this._items[idx].value;
            this.valueChange.emit(this._value);
            this._onChange(this._value);
        },
        getWindowInnerHeight: () => window.innerHeight,
    };
    private foundation: {
        init(),
        destroy(),
        getSelectedIndex(),
        setSelectedIndex(index: number),
        isDisabled(),
        setDisabled(disabled: boolean),
        resize()
    } = new MDCSelectFoundation(this.mdcAdapter);

    constructor(private _elm: ElementRef, private _rndr: Renderer2, private _registry: MdcEventRegistry) {
    }

    ngAfterContentInit() {
        if (!this._menu || !this._menu._list)
            throw new Error('mdcSelect requires an embedded mdcMenu and mdcList');
        
        // This style is needed for layout (size detection) of the select box,
        // but not yet available from the HostBinding in ngAfterContentInit:
        this._elm.nativeElement.classList.add(CLASS_SELECT);

        if (!this._elm.nativeElement.hasAttribute('tabindex'))
            // unless overridden by another tabIndex, we want icon-toggles to
            // participate in tabbing (the foundation will remove the tabIndex
            // when the icon-toggle is disabled):
            this._elm.nativeElement.tabIndex = 0;
        
        this._menu._listFunction = MdcListFunction.select;

        this.foundation.init();
        this._initialized = true;

        if (this._value)
            this.updateIndexFromValue();
        // when the list items change, the index might be affected based on the currently selected value:
        this._menu._list._items.changes.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            this.updateIndexFromValue();
        });

        if (this._disabled)
            this.foundation.setDisabled(this._disabled);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.foundation.destroy();
    }

    private get _items() {
        return this._menu._list._items.toArray();
    }

    private get _menuEl() {
        return this._menu._elm.nativeElement;
    }

    private updateIndexFromValue(emit = true, onchanges = true) {
        if (this._initialized) {
            let index = this._items.map(i => i.value).indexOf(this._value);
            let newValue = index === -1 ? null : this._value;
            if (index !== this.foundation.getSelectedIndex()) // otherwise setSelectedIndex(-1) may remove the text while we don't want that
                this.foundation.setSelectedIndex(index);
            if (this._value !== newValue) {
                this._value = newValue;
                if (emit)
                    this.valueChange.emit(this._value);
                if (onchanges)
                    this._onChange(this._value);
            }
        }
    }

    private createEvent(type: string, details: any) {
        if (typeof CustomEvent === 'function')
            return new CustomEvent(type, {detail: details});
        else {
            let result = document.createEvent('CustomEvent');
            result.initCustomEvent(type, false, false, details);
            return result;
        }
    }

    /** @docs-private */
    writeValue(obj: any) {
        this._value = obj;
        this.updateIndexFromValue(true, false);
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
     * Property for the chosen value of the select control. The value that each option represents
     * can be set with the <code>value</code> option on the <code>MdcListItemDirective</code>
     * that represents that choice. Note that when an <code>mdcSelect</code> is used as a FormControl,
     * it's also possible to bind to <code>ngModel</code> instead of <code>value</code>.
     */
    @Input() get value() {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
        this.updateIndexFromValue();
    }

    /**
     * When this input is defined and does not have value false, the select control will be disabled.
     */
    @Input() get disabled() {
        return this._disabled;
    }

    set disabled(value: any) {
        let newValue = asBoolean(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            if (this._initialized)
                this.foundation.setDisabled(newValue);
        }
    }
}

/**
 * Directive for adding Angular Forms (<code>ControlValueAccessor</code>) behavior to an
 * <code>MdcSelectDirective</code>. Allows the use of the Angular Forms API with
 * select inputs, e.g. binding to <code>[(ngModel)]</code>, form validation, etc.
 */
@Directive({
    selector: '[mdcSelect][formControlName]:not(select),[mdcSelect][formControl]:not(select),[mdcSelect][ngModel]:not(select)',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MdcFormsSelectDirective), multi: true}
    ]
})
export class MdcFormsSelectDirective implements ControlValueAccessor {
    constructor(@Self() private mdcSelect: MdcSelectDirective) {
    }

    /** @docs-private */
    writeValue(obj: any) {
        this.mdcSelect.writeValue(obj);
    }

    /** @docs-private */
    registerOnChange(onChange: (value: any) => void) {
        this.mdcSelect.registerOnChange(onChange);
    }

    /** @docs-private */
    registerOnTouched(onTouched: () => any) {
        this.mdcSelect.registerOnTouched(onTouched);
    }

    /** @docs-private */
    setDisabledState(disabled: boolean) {
        this.mdcSelect.disabled = disabled;
    }
}

/**
 * Directive for a 'Select Control' based on the native HTML <code>select</code>
 * element. This directive may provide better usability then the <code>MdcSelectDirective</code>
 * on mobile devices. For tablets and desktop, the standard <code>MdcSelectDirective</code>
 * is recommended.
 * When this directive is used, the standard HTML <code>option</code> and <code>optgroup</code>
 * elements must be used to define the choices. No additional directives are needed.
 */
@Directive({
    selector: 'select[mdcSelect]:not([multiple])'
})
export class MdcSelectNativeDirective {
    @HostBinding('class.' + CLASS_SELECT) _cls = true;
}

/**
 * Directive for an option inside a mult-selection 'Select Control'
 * using <code>MdcSelectMultipleNativeDirective</code>.
 */
@Directive({
    selector: 'option[mdcSelectOption]'
})
export class MdcSelectOptionNativeDirective {
    @HostBinding('class.mdc-list-item') _cls = false;
}

/**
 * Directive for an optgroup inside a mult-selection 'Select Control'
 * using <code>MdcSelectMultipleNativeDirective</code>.
 */
@Directive({
    selector: 'optgroup[mdcSelectGroup]'
})
export class MdcSelectGroupNativeDirective {
    @HostBinding('class.mdc-list-group') _cls = false;
}

/**
 * Directive for a mult-selection 'Select Control' based on the native HTML <code>select[multiple]</code>
 * element.
 * When this directive is used, the standard HTML <code>option</code> and <code>optgroup</code>
 * elements must be used to define the choices. Each option should be annotated with an
 * <code>MdcSelectOptionNativeDirective</code>, and each <code>optgroup</code> with an
 * <code>MdcSelectGroupNativeDirective</code>.
 * Option dividers can be created as follows:
 * <code>&lt;option mdcListDivider&gt;&lt;/option&gt;</code>.
 */
@Directive({
    selector: 'select[mdcSelect][multiple]'
})
export class MdcSelectMultipleNativeDirective implements AfterContentInit {
    @HostBinding('class.mdc-multi-select') _cls1 = true;
    @HostBinding('class.mdc-list') _cls2 = true;
    @ContentChildren(MdcSelectOptionNativeDirective, {descendants: true}) private options: QueryList<MdcSelectOptionNativeDirective>;
    @ContentChildren(MdcSelectGroupNativeDirective, {descendants: true}) private groups: QueryList<MdcSelectGroupNativeDirective>;

    ngAfterContentInit() {
        this.groups.forEach(group => group._cls = true);
        this.options.forEach(option => option._cls = true);
        this.groups.changes.subscribe(() => {
            this.groups.forEach(group => group._cls = true);
        });
        this.options.changes.subscribe(() => {
            this.options.forEach(option => option._cls = true);
        });
    }
}