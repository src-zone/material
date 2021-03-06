import { AfterContentInit, ContentChildren, Directive, ElementRef, HostBinding, Input, OnDestroy,
    QueryList, Renderer2, Output, EventEmitter, HostListener, ChangeDetectorRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MDCListFoundation, MDCListAdapter, strings, cssClasses } from '@material/list';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { MdcRadioDirective } from '../radio/mdc.radio.directive';
import { MdcCheckboxDirective } from '../checkbox/mdc.checkbox.directive';
import { Subject, merge, ReplaySubject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

/**
 * Directive for a separator in a list (between list items), or as a separator in a 
 * list group (between lists).
 * 
 * # Accessibility
 * This directive adds a `role=separator` attribute when it is used as a separator
 * between list items.
 */
@Directive({
    selector: '[mdcListDivider]'
})
export class MdcListDividerDirective {
    /** @internal */
    @HostBinding('class.mdc-list-divider') readonly _cls = true;
    /** @internal */
    @HostBinding('attr.role') _role: string | null = 'separator';
    /** @internal */
    @HostBinding('attr.disabled') _disabled = false;
    private _inset = false;
    private _padded = false;
    
    constructor(_elm: ElementRef) {
        if (_elm.nativeElement.nodeName.toUpperCase() !== 'LI')
            this._role = null;
    }

    /**
     * When this input is defined and does not have value false, the divider is styled with
     * an inset.
     */
    @Input() @HostBinding('class.mdc-list-divider--inset')
    get inset() {
        return this._inset;
    }

    set inset(val: boolean) {
        this._inset = asBoolean(val);
    }

    static ngAcceptInputType_inset: boolean | '';

    /**
     * When this input is defined and does not have value false, the divider leaves
     * gaps on each site to match the padding of <code>mdcListItemMeta</code>.
     */
    @Input() @HostBinding('class.mdc-list-divider--padded')
    get padded() {
        return this._padded;
    }

    set padded(val: boolean) {
        this._padded = asBoolean(val);
    }

    static ngAcceptInputType_padded: boolean | '';
}

/**
 * Directive for the items of a material list.
 * This directive should be used for the direct children (list items) of an
 * `mdcList`.
 * 
 * # Children
 * * Use `mdcListItemText` for the text content of the list. One line and two line
 *   lists are supported. See `mdcListItemText` for more info.
 * * Optional: `mdcListItemGraphic` for a starting detail (typically icon or image).
 * * Optional: `mdcListItemMeta` for the end detail (typically icon or image).
 * 
 * # Accessibility
 * * All items in a list will get a `tabindex=-1` attribute to make them focusable,
 *   but not tabbable. The focused, active/current, or first (in that preference) item will
 *   get `tabindex=0`, so that the list can be tabbed into. Keyboard navigation
 *   between list items is done with arrow, home, and end keys. Keyboard based selection of
 *   an item (when items are selectable), can be done with the enter or space key.
 * * The `role` attribute with be set to `option` for single selection lists,
 *   `checkbox` for list items that can be selected with embedded checkbox inputs, `radio`
 *   for for list items that can be selected with embedded radio inputs, `menuitem` when the
 *   list is part of an `mdcMenu`. Otherwise there will be no `role` attribute, so the default
 *   role for a standard list item (`role=listitem`) will apply.
 * * Single selection lists set the `aria-selected` or `aria-current` attributes, based on the
 *   chosen `selectionMode` of the list. Please see [WAI-ARIA aria-current](https://www.w3.org/TR/wai-aria-1.1/#aria-current)
 *   for recommendations.
 * * `aria-checked` will be set for lists with embedded checkbox or radio inputs.
 * * Disabled list items will be included in the keyboard navigation. This follows
 *   [focusability of disabled controls](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_disabled_controls)
 *   recommendations in the ARIA practices article. Exception: when the list is part of an `mdcMenu` or `mdcSelect`,
 *   disabled items are not included in the keyboard navigation.
 * * As the user navigates through the list, any button and anchor elements within list items that are not focused
 *   will receive `tabindex=-1`. When the list item receives focus, those elements will receive `tabindex=0`.
 *   This allows for the user to tab through list item elements and then tab to the first element after the list.
 * * Lists are interactive by default (unless `nonInteractive` is set on the `mdcList`). List items will
 *   show ripples when interacted with.
 * * `aria-disabled` will be set for disabled list items. When the list uses checkbox or radio inputs to control
 *   the checked state, the disabled state will mirror the state of those inputs.
 */
@Directive({
    selector: '[mdcListItem]'
})
export class MdcListItemDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-list-item') readonly _cls = true;
    /** @internal */
    @HostBinding('attr.role') public _role: string | null = null;
    /** @internal */
    @ContentChildren(MdcRadioDirective, {descendants: true}) _radios?: QueryList<MdcRadioDirective>;
    /** @internal */
    @ContentChildren(MdcCheckboxDirective, {descendants: true}) _checkBoxes?: QueryList<MdcCheckboxDirective>;
    /** @internal */
    _ariaActive: 'current' | 'selected' | 'checked' | null = null;
    private _initialized = false;
    private _interactive = true;
    private _disabled = false;
    private _active = false;
    /** @internal (called valueChanged instead of valueChange so that library consumers cannot by accident use
     * this for two-way binding) */
    @Output() readonly valueChanged: EventEmitter<string | null> = new EventEmitter();
    /** @internal */
    _activationRequest: Subject<boolean> = new ReplaySubject<boolean>(1);
    /**
     * Event emitted for user action on the list item, including keyboard and mouse actions.
     * This will not emit when the `mdcList` has `nonInteractive` set.
     */
    @Output() readonly action: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted when the active state of a list item in a single-selection list
     * (`selectionMode` is `single` or `active`) is changed. This event does not emit
     * for lists that do not have the mentioned `selectionMode`, and therefore does also
     * not emit for lists where the active/selected state is controlled by embedded checkbox
     * or radio inputs. (Note that for lists controlled by an `mdcSelect`, the `selectionMode`
     * will be either `single` or `active`).
     */
    @Output() readonly selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    private _value: string | null = null;

    constructor(public _elm: ElementRef, rndr: Renderer2, registry: MdcEventRegistry, @Inject(DOCUMENT) doc: any) {
        super(_elm, rndr, registry, doc as Document);
    }

    ngAfterContentInit() {
        this._initialized = true;
        if (this._interactive)
            this.initRipple();
    }
  
    ngOnDestroy() {
        this.destroyRipple();
    }

    /** @internal */
    _setInteractive(interactive: boolean) {
        if (this._interactive !== interactive) {
            this._interactive = interactive;
            if (this._initialized) {
                if (this._interactive)
                    this.initRipple();
                else
                    this.destroyRipple();
            }
        }
    }

    /**
     * If set to a value other than false, the item will be disabled. This affects styling
     * and selectability, and may affect keyboard navigation.
     * This input is ignored for lists where the selection is controlled by embedded checkbox
     * or radio inputs. In those cases the disabled state of the input will be used instead.
     */
    @HostBinding('class.mdc-list-item--disabled') @Input()
    get disabled() {
        if (this._ariaActive === 'checked') {
            const input = this._getInput();
            return input ? input._elm.nativeElement.disabled : false;
        }
        return this._disabled;
    }

    set disabled(val: boolean) {
        this._disabled = asBoolean(val);
    }

    static ngAcceptInputType_disabled: boolean | '';

    /**
     * Assign this field with a value that should be reflected in the `value` property of
     * a `selectionMode=single|active` or and `mdcMenu` or `mdcSelect` for the active property.
     * Ignored for lists that don't offer a selection, and for lists that use checkbox/radio
     * inputs for selection.
     */
    @Input() get value() {
        return this._value;
    }

    set value(newValue: string | null) {
        if (this._value !== newValue) {
            this._value = newValue;
            this.valueChanged.emit(newValue);
        }
    }

    /**
     * This input can be used to change the active or selected state of the item. This should *not* be used for lists
     * inside an `mdcSelect`/`mdcMenu`, or for lists that use checkbox/radio inputs for selection.
     * Depending on the `selectionMode` of the list this will update the `selected` or `active` state of the item.
     */
    @Input() set selected(val: boolean) {
        let newValue = asBoolean(val);
        if (newValue !== this._active)
            this._activationRequest.next(val);
    }

    static ngAcceptInputType_selected: boolean | '';

    /** @internal */
    @HostBinding('class.mdc-list-item--selected')
    get _selected() {
        return (this._ariaActive === 'selected' && this._active)
            || (!this._role && this._active);
    }

    /** @internal */
    @HostBinding('class.mdc-list-item--activated')
    get _activated() {
        return this._ariaActive === 'current' && this._active;
    }

    /** @internal */
    @HostBinding('attr.aria-disabled') get _ariaDisabled() {
        if (this.disabled) // checks checkbox/radio disabled state when appropriate
            return 'true';
        return null;
    }

    /** @internal */
    @HostBinding('attr.aria-current') get _ariaCurrent() {
        if (this._ariaActive === 'current')
            return this._active ? 'true' : 'false';
        return null;
    }

    /** @internal */
    @HostBinding('attr.aria-selected') get _ariaSelected() {
        if (this._ariaActive === 'selected')
            return this._active ? 'true' : 'false';
        return null;
    }

    /** @internal */
    @HostBinding('attr.aria-checked') get _ariaChecked() {
        if (this._ariaActive === 'checked')
            // (this.active: returns checked value of embedded input if appropriate)
            return this.active ? 'true' : 'false';
        return null;
    }

    /** @internal */
    get active() {
        if (this._ariaActive === 'checked') {
            const input = this._getInput();
            return input ? input._elm.nativeElement.checked : false;
        }
        return this._active;
    }

    /** @internal */
    set active(value: boolean) {
        if (value !== this._active) {
            this._active = value;
            this.selectedChange.emit(value);
        }
    }

    /** @internal */
    _getRadio() {
        return this._radios?.first;
    }

    /** @internal */
    _getCheckbox() {
        return this._checkBoxes?.first;
    }

    /** @internal */
    _getInput() {
        return (this._getCheckbox() || this._getRadio())?._input;
    }
}

/**
 * Directive to mark the text portion(s) of an `mdcListItem`. This directive should be the child of an `mdcListItem`.
 * For single line lists, the text can be added directly to this directive.
 * For two line lists, add `mdcListItemPrimaryText` and `mdcListItemSecondaryText` children.
 */
@Directive({
    selector: '[mdcListItemText]'
})
export class MdcListItemTextDirective {
    /** @internal */
    @HostBinding('class.mdc-list-item__text') readonly _cls = true;
}

/**
 * Directive to mark the first line of an item with "two line list" styling.
 * This directive, if used, should be the child of an `mdcListItemText`.
 * Using this directive will put the list "two line" mode.
 */
@Directive({
    selector: '[mdcListItemPrimaryText]'
})
export class MdcListItemPrimaryTextDirective {
    /** @internal */
    @HostBinding('class.mdc-list-item__primary-text') readonly _cls = true;
}

/**
 * Directive for the secondary text of an item with "two line list" styling.
 * This directive, if used, should be the child of an `mdcListItemText`, and
 * come after the `mdcListItemPrimaryText`.
 */
@Directive({
    selector: '[mdcListItemSecondaryText]',
})
export class MdcListItemSecondaryTextDirective {
    /** @internal */
    @HostBinding('class.mdc-list-item__secondary-text') readonly _cls = true;
}

/**
 * Directive for the start detail item of a list item.
 * This directive, if used, should be the child of an`mdcListItem`.
 */
@Directive({
    selector: '[mdcListItemGraphic]',
})
export class MdcListItemGraphicDirective {
    /** @internal */
    @HostBinding('class.mdc-list-item__graphic') readonly _cls = true;
}

/**
 * Directive for the end detail item of a list item.
 * This directive, if used, should be the child of an `mdcListItem`.
 */
@Directive({
    selector: '[mdcListItemMeta]',
})
export class MdcListItemMetaDirective {
    /** @internal */
    @HostBinding('class.mdc-list-item__meta') readonly _cls = true;
}

/** @docs-private */
export enum MdcListFunction {
    plain, menu, select
};

// attributes on list-items that we maintain ourselves, so should be ignored
// in the adapter:
const ANGULAR_ITEM_ATTRIBUTES = [
    strings.ARIA_CHECKED, strings.ARIA_SELECTED, strings.ARIA_CURRENT, strings.ARIA_DISABLED
];
// classes on list-items that we maintain ourselves, so should be ignored
// in the adapter:
const ANGULAR_ITEM_CLASSES = [
    cssClasses.LIST_ITEM_DISABLED_CLASS, cssClasses.LIST_ITEM_ACTIVATED_CLASS, cssClasses.LIST_ITEM_SELECTED_CLASS
];

/**
 * Lists are continuous, vertical indexes of text or images. They can be interactive, and may support
 * selaction/activation of list of items. Single-line and Two-line lists are supported, as well as
 * starting and end details (images or controls) on a list. A list contains `mdcListItem` children,
 * and may also contain `mdcListDivider` children.
 * 
 * A list can be used by itself, or contained inside `mdcListGroup`, `mdcMenu`, or `mdcSelect`.
 * 
 * # Accessibility
 * * See Accessibility section of `mdcListItem` for navigation, focus, and tab(index) affordances.
 * * The `role` attribute will be set to `listbox` for single selection lists (`selectionMode` is `single`
 *   or `active`), to `radiogroup` when selection is triggered by embedded radio inputs, to
 *   `checkbox` when selection is triggered by embedded checkbox inputs, to `menu` when used inside
 *   `mdcMenu`. Otherwise there will be no `role` attribute, so the default role for a standard list
 *   (`role=list`) will apply.
 * * You should set an appropriate `label` for checkbox based selection lists. The
 *   `label` will be reflected to the `aria-label` attribute.
 */
@Directive({
    selector: '[mdcList]',
})
export class MdcListDirective implements AfterContentInit, OnDestroy {
    private onDestroy$: Subject<any> = new Subject();
    private document: Document;
    /** @internal */
    @HostBinding('class.mdc-list') readonly _cls = true;
    /** @internal */
    @ContentChildren(MdcListItemDirective) _items?: QueryList<MdcListItemDirective>;
    /** @internal */
    @ContentChildren(MdcListItemPrimaryTextDirective, {descendants: true}) _primaryTexts?: QueryList<MdcListItemTextDirective>;
    /** @internal */
    @ContentChildren(MdcCheckboxDirective, {descendants: true}) _checkboxes?: QueryList<MdcListItemTextDirective>;
    /** @internal */
    @ContentChildren(MdcRadioDirective, {descendants: true}) _radios?: QueryList<MdcListItemTextDirective>;
    /** @internal */
    @Output() readonly itemsChanged: EventEmitter<void> = new EventEmitter();
    /** @internal */
    @Output() readonly itemValuesChanged: EventEmitter<void> = new EventEmitter();
    /** @internal */
    @Output() readonly itemAction: EventEmitter<{index: number, value: string | null}> = new EventEmitter();
    /** @internal */
    @HostBinding('class.mdc-list--two-line') _twoLine = false;
    /**
     * Label announcing the purpose of the list. Should be set for lists that embed checkbox inputs
     * for activation/selection. The label is reflected in the `aria-label` attribute value.
     * 
     * @internal
     */
    @HostBinding('attr.aria-label') @Input() label: string | null = null;
    /**
     * Link to the id of an element that announces the purpose of the list. This will be set automatically
     * to the id of the `mdcFloatingLabel` when the list is part of an `mdcSelect`.
     * 
     * @internal
     */
    @HostBinding('attr.aria-labelledBy') @Input() labelledBy: string | null = null;
    private _function: MdcListFunction = MdcListFunction.plain;
    /** @internal */
    _hidden = false;
    private _dense = false;
    private _avatar = false;
    private _nonInteractive = false;
    private _selectionMode: 'single' | 'active' | null = null;
    private _wrapFocus = false;
    private mdcAdapter: MDCListAdapter = {
        getAttributeForElementIndex: (index, attr) => {
            if (attr === strings.ARIA_CURRENT)
                return this.getItem(index)?._ariaCurrent;
            return this.getItem(index)?._elm.nativeElement.getAttribute(attr);
        },
        getListItemCount: () => this._items!.length,
        getFocusedElementIndex: () => this._items!.toArray().findIndex(i => i._elm.nativeElement === this.document.activeElement!),
        setAttributeForElementIndex: (index, attribute, value) => {
            // ignore attributes we maintain ourselves
            if (!ANGULAR_ITEM_ATTRIBUTES.find(a => a === attribute)) {
                const elm = this.getItem(index)?._elm.nativeElement;
                if (elm)
                    this.rndr.setAttribute(elm, attribute, value);
            }
        },
        addClassForElementIndex: (index, className) => {
            if (!ANGULAR_ITEM_CLASSES.find(c => c === className)) {
                const elm = this.getItem(index)?._elm.nativeElement;
                if (elm)
                    this.rndr.addClass(elm, className);
            }
        },
        removeClassForElementIndex: (index, className) => {
            if (!ANGULAR_ITEM_CLASSES.find(c => c === className)) {
                const elm = this.getItem(index)?._elm.nativeElement;
                if (elm)
                    this.rndr.addClass(elm, className);
            }
        },
        focusItemAtIndex: (index: number) => this.getItem(index)?._elm.nativeElement.focus(),
        setTabIndexForListItemChildren: (index, tabIndexValue) => {
            // TODO check this plays nice with our own components (mdcButton etc.)
            // TODO build this in an abstract class for our own elements?
            // TODO limit to our own elements/custom directive?
            const elm = this.getItem(index)?._elm.nativeElement;
            const listItemChildren: Element[] = [].slice.call(elm.querySelectorAll(strings.CHILD_ELEMENTS_TO_TOGGLE_TABINDEX));
            listItemChildren.forEach((el) => this.rndr.setAttribute(el, 'tabindex', tabIndexValue));
        },
        hasRadioAtIndex: () => this._role === 'radiogroup',
        hasCheckboxAtIndex: () => this._role === 'group',
        isCheckboxCheckedAtIndex: (index) => !!this.getItem(index)?._getCheckbox()?._input?.checked,
        isRootFocused: () => this.document.activeElement === this._elm.nativeElement,
        listItemAtIndexHasClass: (index, className) => {
            if (className === cssClasses.LIST_ITEM_DISABLED_CLASS)
                return !!this.getItem(index)?.disabled;
            return !!this.getItem(index)?._elm.nativeElement.classList.contains(className);
        },
        setCheckedCheckboxOrRadioAtIndex: (index, isChecked) => {
            const item = this.getItem(index);
            const input = (item?._getRadio() || item?._getCheckbox())?._input?._elm.nativeElement;
            if (input) {
                input.checked = isChecked;
                // simulate user interaction, as this is triggered from a user interaction:
                const event = this.document.createEvent('Event');
                event.initEvent('change', true, true);
                input.dispatchEvent(event);
                // checkbox input listens to clicks, not changed events, so let it know about the change:
                item?._getCheckbox()?._input?._onChange();
            }
        },
        notifyAction: (index) => {
            const item = this.getItem(index);
            if (item && !item?.disabled) {
                item.action.emit();
                this.itemAction.emit({index, value: item.value});
            }
        },
        isFocusInsideList: () => {
            return this._elm.nativeElement.contains(this.document.activeElement);
        },
    };
    /** @internal */
    foundation?: MDCListFoundation | null;
    
    constructor(public _elm: ElementRef, private rndr: Renderer2, private cdRef: ChangeDetectorRef, @Inject(DOCUMENT) doc: any) {
        this.document = doc as Document; // work around ngc issue https://github.com/angular/angular/issues/20351
    }

    ngAfterContentInit() {
        merge(
            this._checkboxes!.changes,
            this._radios!.changes
        ).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            this.updateItems();
            this.updateLayout();
            this.updateFoundationSelections();
        });
        this._items!.changes.subscribe(() => {
            // when number of items changes, we have to reinitialize the foundation, because
            // the focusused item index that the foundation keeps may be invalidated:
            this.destroyFoundation();
            this.updateItems();
            this.initFoundation();
            this.itemsChanged.emit();
            this.itemValuesChanged.emit();
            merge(this._items!.map(item => item.valueChanged.asObservable())).pipe(
                takeUntil(this.onDestroy$),
                takeUntil(this.itemsChanged),
                debounceTime(1)
            ).subscribe(() => {
                this.itemValuesChanged.emit();
            });
            this.subscribeItemActivationRequests();
        });
        this._primaryTexts!.changes.subscribe(_ => this._twoLine = this._primaryTexts!.length > 0);
        this.updateItems();
        this._twoLine = this._primaryTexts!.length > 0;
        this.initFoundation();
        this.subscribeItemActivationRequests();
    }

    ngOnDestroy() {
        this.onDestroy$.next(); this.onDestroy$.complete();
        this.destroyFoundation();
    }

    private initFoundation() {
        this.foundation = new MDCListFoundation(this.mdcAdapter);
        this.foundation.init();
        this.updateLayout();
        const focus = this.getListItemIndex({target: this.document.activeElement as EventTarget});
        if (focus !== -1) // only way to restore focus when a list item already had focus:
            (<any>this.foundation)['focusedItemIndex_'] = focus;
        this.updateFoundationSelections();
        this.foundation.setWrapFocus(this._wrapFocus);
    }

    private destroyFoundation() {
        this.foundation?.destroy();
        this.foundation = null;
    }

    private subscribeItemActivationRequests() {
        this._items!.map(item => {
            item._activationRequest.asObservable().pipe(
                takeUntil(this.onDestroy$),
                takeUntil(this.itemsChanged)
            ).subscribe(active => this.activateOrSelectItem(item, active));
        });
    }

    private updateItems() {
        let itemRole = {
            'menu': 'menuitem',
            'listbox': 'option',
            'group': 'checkbox',
            'radiogroup': 'radio'
        }[this._role!] || null;
        let ariaActive = {
            'menu': null,
            'listbox': this._selectionMode === 'active' ? 'current' : 'selected',
            'group': 'checked',
            'radiogroup': 'checked'
        }[this._role!] || null;
        if (this._items) {
            const firstTabbable = this._nonInteractive ? null :
                this._items.find(item => item._elm.nativeElement.tabIndex === 0) ||
                this._items.find(item => item.active) ||
                this._items.first;
            this._items.forEach(item => {
                item._role = itemRole;
                item._ariaActive = <any>ariaActive;
                item._setInteractive(!this._nonInteractive);
                if (this._nonInteractive)
                    // not focusable if not interactive:
                    this.rndr.removeAttribute(item._elm.nativeElement, 'tabindex');
                this.rndr.setAttribute(item._elm.nativeElement, 'tabindex', item === firstTabbable ? '0' : '-1');
            });
            // child components were updated (in updateItems above)
            // let angular know to prevent ExpressionChangedAfterItHasBeenCheckedError:
            this.cdRef.detectChanges();
        }
    }

    private updateLayout() {
        this.foundation?.layout();
    }

    private updateFoundationSelections() {
        this.foundation?.setSingleSelection(this._role === 'listbox');
        this.foundation?.setSelectedIndex(this.getSelection());
    }

    private updateItemSelections(active: number | number[]) {
        const activeIndexes = typeof active === 'number' ? [active] : active;
        // first deactivate, then activate
        this._items!.toArray().forEach((item, idx) => {
            if (activeIndexes.indexOf(idx) === -1)
                item.active = false;
        });
        this._items!.toArray().forEach((item, idx) => {
            if (activeIndexes.indexOf(idx) !== -1)
                item.active = true;
        });
    }

    private activateOrSelectItem(item: MdcListItemDirective, active: boolean) {
        let activeIndexes: number | number[] = -1;
        if (!active) {
            if (this._role === 'group' || !this._role)
                activeIndexes = <number[]>this._items!.toArray().map((v, i) => v.active && v !== item ? i : null).filter(i => i != null);
            else if (this._role === 'listbox' || this._role === 'radiogroup' || this._role === 'menu')
                activeIndexes = this._items!.toArray().findIndex(i => i.active && i !== item);
        } else {
            if (this._role === 'group' || !this._role)
                activeIndexes = <number[]>this._items!.toArray().map((v, i) => v.active || v === item ? i : null).filter(i => i != null);
            else if (this._role === 'listbox' || this._role === 'radiogroup' || this._role === 'menu')
                activeIndexes = this._items!.toArray().findIndex(i => i === item);
        }
        if (this._role === 'group' || this._role === 'listbox' || this._role === 'radiogroup' || this._role === 'menu')
            this.foundation?.setSelectedIndex(activeIndexes);
        this.updateItemSelections(activeIndexes);
        this.cdRef.detectChanges();
    }

    private getSelection(forFoundation = true): number | number[] {
        if (this._role === 'listbox' || this._role === 'radiogroup' || this._role === 'menu')
            return this._items!.toArray().findIndex(i => i.active);
        if (this._role === 'group')
            return <number[]>this._items!.toArray().map((v, i) => v.active ? i : null).filter(i => i != null);
        return forFoundation ? -1 : <number[]>this._items!.toArray().map((v, i) => v.active ? i : null).filter(i => i != null);
    }

    /** @internal */
    getSelectedItem() {
        if (this._role === 'listbox' || this._role === 'radiogroup' || this._role === 'menu')
            return this._items!.find(i => i.active);
        return null;
    }

    /** @internal */
    @HostBinding('attr.role') get _role() {
        if (this._function === MdcListFunction.menu)
            return 'menu';
        if (this._function === MdcListFunction.select)
            return 'listbox';
        if (this._selectionMode === 'single' || this._selectionMode === 'active')
            return 'listbox';
        if (this._checkboxes && this._checkboxes.length > 0)
            return 'group';
        if (this._radios && this._radios.length > 0)
            return 'radiogroup';
        return null;
    }

    /** @internal */
    @HostBinding('attr.aria-hidden') get _ariaHidden() {
        return (this._hidden && this._function === MdcListFunction.menu) ? 'true' : null;
    }

    /** @internal */
    @HostBinding('attr.aria-orientation') get _ariaOrientation() {
        return this._function === MdcListFunction.menu ? 'vertical' : null;
    }

    /** @internal */
    @HostBinding('class.mdc-menu__items') get _isMenu() {
        return this._function === MdcListFunction.menu;
    }

    /** @internal */
    @HostBinding('attr.tabindex') get _tabindex() {
        // the root of a menu should be focusable
        return this._function === MdcListFunction.menu ? "-1" : null;
    }

    /** @internal */
    _setFunction(val: MdcListFunction) {
        this._function = val;
        this.foundation?.setSingleSelection(this._role === 'listbox');
        this.updateItems();
    }

    /**
     * When this input is defined and does not have value false, the list will be styled more
     * compact.
     */
    @Input() @HostBinding('class.mdc-list--dense')
    get dense() {
        return this._dense;
    }
    
    set dense(val: boolean) {
        this._dense = asBoolean(val);
    }

    static ngAcceptInputType_dense: boolean | '';

    /**
     * When set to `single` or `active`, the list will act as a single-selection-list.
     * This enables the enter and space keys for selecting/deselecting a list item,
     * and sets the appropriate accessibility options.
     * When not set, the list will not act as a single-selection-list.
     * 
     * When using `single`, the active selection is announced with `aria-selected`
     * attributes on the list elements. When using `active`, the active selection
     * is announced with `aria-current`. See [WAI-ARIA aria-current](https://www.w3.org/TR/wai-aria-1.1/#aria-current)
     * article for recommendations on usage.
     * 
     * The selectionMode is ignored when there are embedded checkbox or radio inputs inside the list, in which case
     * those inputs will trigger selection of list items.
     */
    @Input()
    get selectionMode() {
        return this._selectionMode;
    }
    
    set selectionMode(val: 'single' | 'active' | null) {
        if (val !== this._selectionMode) {
            if (val === 'single' || val === 'active')
                this._selectionMode = val;
            else
                this._selectionMode = null;
            this.updateItems();
            if (this.foundation) {
                this.foundation.setSingleSelection(this._role === 'listbox');
                this.foundation.setSelectedIndex(this.getSelection());
                this.updateItemSelections(this.getSelection(false));
            }
        }
    }

    static ngAcceptInputType_selectionMode: 'single' | 'active' | '' | null;

    /**
     * When this input is defined and does not have value false, the list will be made
     * non-interactive. Users will not be able to interact with list items, and the styling will
     * reflect this (e.g. by not adding ripples to the items).
     */
    @Input() @HostBinding('class.mdc-list--non-interactive')
    get nonInteractive() {
        return this._nonInteractive;
    }
    
    set nonInteractive(val: boolean) {
        let newValue = asBoolean(val);
        if (newValue !== this._nonInteractive) {
            this._nonInteractive = newValue;
            this.updateItems();
        }
    }

    static ngAcceptInputType_nonInteractive: boolean | '';

    /**
     * When this input is defined and does not have value false, focus will wrap from last to
     * first and vice versa when using keyboard navigation through list items.
     */
    @Input()
    get wrapFocus() {
        return this._wrapFocus;
    }

    set wrapFocus(val: boolean) {
        this._wrapFocus = asBoolean(val);
        this.foundation?.setWrapFocus(this._wrapFocus);
    }

    static ngAcceptInputType_wrapFocus: boolean | '';

    /**
     * When this input is defined and does not have value false, elements with directive <code>mdcListItemGraphic</code>
     * will be styled for avatars: large, circular elements that lend themselves well to contact images, profile pictures, etc. 
     */
    @Input() @HostBinding('class.mdc-list--avatar-list')
    get avatarList() {
        return this._avatar;
    }

    set avatarList(val: boolean) {
        this._avatar = asBoolean(val);
    }

    static ngAcceptInputType_avatarList: boolean | '';

    /** @internal */
    @HostListener('focusin', ['$event']) _onFocusIn(event: FocusEvent) {
        if (this.foundation && !this._nonInteractive) {
            this.foundation.setSelectedIndex(this.getSelection());
            const index = this.getListItemIndex(event as {target: EventTarget});
            this.foundation.handleFocusIn(event, index);
        }
    }

    /** @internal */
    @HostListener('focusout', ['$event']) _onFocusOut(event: FocusEvent) {
        if (this.foundation && !this._nonInteractive) {
            this.foundation.setSelectedIndex(this.getSelection());
            const index = this.getListItemIndex(event as {target: EventTarget});
            this.foundation.handleFocusOut(event, index);
        }
    }

    /** @internal */
    @HostListener('keydown', ['$event']) _onKeydown(event: KeyboardEvent) {
        if (this.foundation && !this._nonInteractive) {
            this.foundation.setSelectedIndex(this.getSelection());
            const index = this.getListItemIndex(event as {target: EventTarget});
            const onRoot = this.getItem(index)?._elm.nativeElement === event.target;
            this.foundation.handleKeydown(event, onRoot, index);
            if (this._role === 'listbox')
                this.updateItemSelections(this.foundation!.getSelectedIndex());
        }
    }

    /** @internal */
    @HostListener('click', ['$event']) _onClick(event: MouseEvent) {
        if (this.foundation && !this._nonInteractive) {
            this.foundation.setSelectedIndex(this.getSelection());
            const index = this.getListItemIndex(event as {target: EventTarget});
            // only toggle radio/checkbox input if it's not already toggled from the event:
            const inputElement = this.getItem(index)?._getCheckbox()?._input!._elm.nativeElement ||
                this.getItem(index)?._getRadio()?._input!._elm.nativeElement;
            const toggleInput = event.target !== inputElement;
            this.foundation.handleClick(index, toggleInput);
            if (this._role === 'listbox')
                this.updateItemSelections(this.foundation!.getSelectedIndex());
        }
    }

    /** @internal */
    getItem(index: number): MdcListItemDirective | null {
        if (index >= 0 && index < this._items!.length)
            return this._items!.toArray()[index];
        return null;
    }

    /** @internal */
    getItems(): MdcListItemDirective[] {
        return this._items?.toArray() || [];
    }

    /** @internal */
    getItemByElement(element: Element): MdcListItemDirective | null {
        return this._items?.find(i => i._elm.nativeElement === element) || null;
    }

    private getListItemIndex(evt: {target: EventTarget}) {
        let eventTarget: Element | null = evt.target as Element;
        const itemElements = this._items!.map(item => <Element>item._elm.nativeElement);
        while (eventTarget && eventTarget !== this._elm.nativeElement) {
            const index = itemElements.findIndex(e => e === eventTarget);
            if (index !== -1)
                return index;
            eventTarget = eventTarget.parentElement;
        }
        return -1;
    }
}

/**
 * Directive for a header inside a list group (<code>mdcListGroup</code>) directive.
 */
@Directive({
    selector: '[mdcListGroupSubHeader]'
})
export class MdcListGroupSubHeaderDirective {
    /** @internal */
    @HostBinding('class.mdc-list-group__subheader') readonly _cls = true;
}


/**
 * Directive for a material designed list group, grouping several `mdcList` lists.
 * List groups should contain elements with `mdcListGroupSubHeader`,
 * and `mdcList` directives. Lists may be separated by `mdcListSeparator` directives.
 */
@Directive({
    selector: '[mdcListGroup]'
})
export class MdcListGroupDirective {
    /** @internal */
    @HostBinding('class.mdc-list-group') readonly _cls = true;
}

export const LIST_DIRECTIVES = [
    MdcListDividerDirective,
    MdcListItemDirective,
    MdcListItemTextDirective,
    MdcListItemPrimaryTextDirective,
    MdcListItemSecondaryTextDirective,
    MdcListItemGraphicDirective,
    MdcListItemMetaDirective,
    MdcListDirective,
    MdcListGroupSubHeaderDirective,
    MdcListGroupDirective
];
