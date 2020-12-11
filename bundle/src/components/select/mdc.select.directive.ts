import { AfterContentInit, ContentChild, Directive, ElementRef, forwardRef, HostBinding,
  Input, OnDestroy, OnInit, Renderer2, Self, ContentChildren, QueryList, Host, SkipSelf,
  HostListener, Inject, Output, EventEmitter } from '@angular/core';
import { MDCLineRippleFoundation, MDCLineRippleAdapter } from '@material/line-ripple';
import { MDCSelectFoundation, MDCSelectAdapter, cssClasses, strings } from '@material/select';
import { Subject, merge } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { MdcFloatingLabelDirective } from '../floating-label/mdc.floating-label.directive';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { MdcNotchedOutlineDirective } from '../notched-outline/mdc.notched-outline.directive';
import { MdcMenuDirective } from '../menu/mdc.menu.directive';
import { MdcMenuSurfaceDirective } from '../menu-surface/mdc.menu-surface.directive';
import { MdcListFunction, MdcListDirective } from '../list/mdc.list.directive';
import { HasId } from '../abstract/mixin.mdc.hasid';
import { applyMixins } from '../../utils/mixins';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { asBoolean } from '../../utils/value.utils';

@Directive()
class MdcSelectTextDirectiveBase {}
interface MdcSelectTextDirectiveBase extends HasId {}
applyMixins(MdcSelectTextDirectiveBase, [HasId]);

/**
 * Directive for showing the text of the currently selected `mdcSelect` item. It is the responsibility
 * of the host component to set the actual text (see examples). This makes the `mdcSelect` more flexible,
 * so that e.g. the text of options can also contain markup to style parts of it differently.
 * When no value is selected, the embedded text must be empty.
 * 
 * # Accessibility
 * * When no `id` is assigned, the component will generate a unique `id`, so that the `mdcSelectAnchor`
 *   and `mdcList` for this select can be labelled (with `aria-labelledBy`) appropriately.
 * * The element will be made focusable and tabbable (with `tabindex=0`), unless disabled.
 * * The `aria-disabled` will get a value based on the `disabled` property of the `mdcSelect`.
 * * The `aria-required` will get a value based on the `required` property of the `mdcSelect`.
 * * The `role` attribute will be set to `button`.
 * * The  `aria-haspopup` attribute will be set to `listbox`.
 * * The `aria-labelledBy` attribute will list the ids of the `mdcFloatinglabel` and the `mdcSelectText` self.
 * * The `aria-expanded` attribute will reflect whether this element is focused (the menu-surface is open).
 */
@Directive({
    selector: '[mdcSelectText]'
})
export class MdcSelectTextDirective extends MdcSelectTextDirectiveBase implements OnInit {
    @HostBinding('class.mdc-select__selected-text') _cls = true;
    @HostBinding('attr.role') _role = 'button';
    @HostBinding('attr.aria-haspopup') _haspop = 'listbox';
    @HostBinding('attr.aria-labelledby') _labelledBy: string | null = null;

    constructor(public _elm: ElementRef, @Host() @SkipSelf() @Inject(forwardRef(() => MdcSelectDirective)) private select: MdcSelectDirective) {
        super();
    }

    ngOnInit() {
        this.initId();
    }

    @HostListener('focus') _onFocus() {
        this.select.foundation?.handleFocus();
    }

    @HostListener('blur') _onBlur() {
        this.select.onBlur();
    }

    @HostListener('keydown', ['$event']) _onKeydown(event: KeyboardEvent) {
        this.select.foundation?.handleKeydown(event);
    }

    @HostListener('click', ['$event']) _onClick(event: MouseEvent | TouchEvent) {
        this.select.foundation?.handleClick(this.getNormalizedXCoordinate(event));
    }

    private getNormalizedXCoordinate(event: MouseEvent | TouchEvent): number {
        const targetClientRect = (event.target as Element).getBoundingClientRect();
        const xCoordinate = !!((event as TouchEvent).touches) ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
        return xCoordinate - targetClientRect.left;
    }
}

/**
 * The `mdcSelectAnchor` should be the first child of an `mdcSelect`. It contains the dropdown-icon,
 * `mdcSelectText`, `mdcFloatingLabel`, ripples, and may contain an optional `mdcNotchedOutline`.
 * See the examples for the required structure of these directives.
 */
@Directive({
    selector: '[mdcSelectAnchor]'
})
export class MdcSelectAnchorDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    private onDestroy$: Subject<any> = new Subject();
    private onLabelsChange$: Subject<any> = new Subject();
    @HostBinding('class.mdc-select__anchor') _cls = true;
    @ContentChildren(MdcFloatingLabelDirective, {descendants: true}) _floatingLabels?: QueryList<MdcFloatingLabelDirective>;
    @ContentChildren(MdcNotchedOutlineDirective) _outlines?: QueryList<MdcNotchedOutlineDirective>;
    @ContentChildren(MdcSelectTextDirective) _texts?: QueryList<MdcSelectTextDirective>;
    private _bottomLineElm: HTMLElement | null = null;
    /** @docs-private */
    bottomLineFoundation: MDCLineRippleFoundation | null = null;
    private mdcLineRippleAdapter: MDCLineRippleAdapter = {
        addClass: (className) => this.rndr.addClass(this._bottomLineElm, className),
        removeClass: (className) => this.rndr.removeClass(this._bottomLineElm, className),
        hasClass: (className) => this._bottomLineElm!.classList.contains(className),
        setStyle: (name, value) => this.rndr.setStyle(this._bottomLineElm, name, value),
        registerEventHandler: (evtType, handler) => this._registry.listenElm(this.rndr, evtType, handler, this._bottomLineElm!),
        deregisterEventHandler: (evtType, handler) => this._registry.unlisten(evtType, handler)
    };
    
    constructor(public _elm: ElementRef, private rndr: Renderer2, registry: MdcEventRegistry,
        @Host() @SkipSelf() @Inject(forwardRef(() => MdcSelectDirective)) private select: MdcSelectDirective) {
        super(_elm, rndr, registry);
    }

    ngAfterContentInit() {
        merge(
            this._floatingLabels!.changes,
            this._outlines!.changes
        ).pipe(
            takeUntil(this.onDestroy$),
            debounceTime(1)
        ).subscribe(() => {
            this.reconstructComponent();
        });
        merge(this._floatingLabels!.changes, this._texts!.changes).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            this.onLabelsChange$.next();
            this._label?.idChange().pipe(takeUntil(this.onLabelsChange$)).subscribe(() => {
                this.computeLabelledBy();
            });
            this._text?.idChange().pipe(takeUntil(this.onLabelsChange$)).subscribe(() => {
                this.computeLabelledBy();
            });
            this.computeLabelledBy();
        });
        this.addIcon();
        this.initComponent();
        this.computeLabelledBy();
    }
    
    ngOnDestroy() {
        this.onLabelsChange$.next(); this.onLabelsChange$.complete();
        this.onDestroy$.next(); this.onDestroy$.complete();
        this.destroyRipple();
        this.destroyLineRipple();
    }

    private initComponent() {
        if (!this._outline) {
            this.initLineRipple();
            this.initRipple();
        }
    }

    private destroyComponent() {
        this.destroyRipple();
        this.destroyLineRipple();
    }

    private reconstructComponent() {
        this.destroyComponent();
        this.initComponent();
    }

    private addIcon() {
        const icon = this.rndr.createElement('i');
        this.rndr.addClass(icon, 'mdc-select__dropdown-icon');
        if (this._elm.nativeElement.children.length > 0)
            this.rndr.insertBefore(this._elm.nativeElement, icon, this._elm.nativeElement.children.item(0));
        else
            this.rndr.appendChild(this._elm.nativeElement, icon);
    }

    private initLineRipple() {
        if (!this._bottomLineElm) {
            this._bottomLineElm = this.rndr.createElement('div');
            this.rndr.addClass(this._bottomLineElm, 'mdc-line-ripple');
            this.rndr.appendChild(this._elm.nativeElement, this._bottomLineElm);
            this.bottomLineFoundation = new MDCLineRippleFoundation(this.mdcLineRippleAdapter);
            this.bottomLineFoundation.init();
        }
    }

    private destroyLineRipple() {
        if (this._bottomLineElm) {
            this.bottomLineFoundation!.destroy();
            this.bottomLineFoundation = null;
            this.rndr.removeChild(this._elm.nativeElement, this._bottomLineElm);
            this._bottomLineElm = null;
        }
    }

    private computeLabelledBy() {
        let ids = [];
        const labelId = this._label?.id;
        if (labelId)
            ids.push(labelId)
        const textId = this._text?.id;
        if (textId)
            ids.push(textId);
        if (this._text)
            this._text._labelledBy = ids.join(' ');
        this.select.setListLabelledBy(labelId || null); // the list should only use the id of the label
    }

    get _outline() {
        return this._outlines?.first;
    }

    get _label() {
        return this._floatingLabels?.first;
    }

    get _text() {
        return this._texts?.first;
    }
}

/**
 * Directive for the options list of an `mdcSelect`. This directive should be the second (last) child
 * of an `mdcSelect`, and should wrap an `mdcList` with all selection options.
 * See the examples for the required structure of these directives.
 */
@Directive({
    selector: '[mdcSelectMenu]'
})
export class MdcSelectMenuDirective {
    @HostBinding('class.mdc-select__menu') _cls = true;

    constructor(@Self() public _menu: MdcMenuDirective, @Self() public _surface: MdcMenuSurfaceDirective) {}
}

/** @docs-private */
enum ValueSource {
    control, foundation, program
};

/**
 * Directive for a spec aligned material design 'Select Control'. This directive should contain
 * and `mdcSelectAnchor` and an `mdcSelectMenu`. See the examples for the required structure of
 * these directives.
 * 
 * If leaving the select empty should be a valid option, include an `mdcListItem` as first element in the list,
 * with an ampty string as `value`.
 * 
 * # Accessibility
 * * This directive implements the aria practices recommendations for a
 *   [listbox](https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html).
 *   Most `aria-*` and `role` attributes affect the embedded `mdcSelectAnchor`, and `mdcList`, and are
 *   explained in the documentation for these directives.
 */
@Directive({
    selector: '[mdcSelect]'
})
export class MdcSelectDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-select') _cls = true;
    private onDestroy$: Subject<any> = new Subject();
    private onMenuChange$: Subject<any> = new Subject();
    private onItemsChange$: Subject<any> = new Subject();
    private _onChange: (value: any) => void = () => {};
    private _onTouched: () => any = () => {};
    private _lastMenu: MdcSelectMenuDirective | null = null;
    private _value: string | null = null;
    private _valueSource: ValueSource | null = null;
    private _disabled = false;
    private _required = false;
    private _listLabelledBy: string | null = null;
    /**
     * emits the value of the item when the selected item changes
     */
    @Output() readonly valueChange: EventEmitter<string | null> = new EventEmitter();
    @ContentChildren(MdcSelectAnchorDirective) _anchors?: QueryList<MdcSelectAnchorDirective>;
    @ContentChildren(MdcSelectMenuDirective) _menus?: QueryList<MdcSelectMenuDirective>;
    @ContentChildren(MdcListDirective, {descendants: true}) _lists?: QueryList<MdcListDirective>;
    @ContentChildren(MdcSelectTextDirective, {descendants: true}) _texts?: QueryList<MdcSelectTextDirective>;
    private mdcAdapter: MDCSelectAdapter = {
        addClass: (className) =>  this.rndr.addClass(this.elm.nativeElement, className),
        removeClass: (className) => this.rndr.removeClass(this.elm.nativeElement, className),
        hasClass: (className) => this.elm.nativeElement.classList.contains(className),
        activateBottomLine: () => this.anchor?.bottomLineFoundation?.activate(),
        deactivateBottomLine: () => this.anchor?.bottomLineFoundation?.deactivate(),
        getSelectedMenuItem: () => this.getSelectedItem()?._elm.nativeElement,
        hasLabel: () => !!this.label,
        floatLabel: (shouldFloat) => this.label?.float(shouldFloat),
        getLabelWidth: () =>  this.label?.getWidth() || 0,
        hasOutline: () => !!this.anchor?._outline,
        notchOutline: (labelWidth) => this.anchor?._outline!.open(labelWidth),
        closeOutline: () => this.anchor?._outline!.close(),
        setRippleCenter: (normalizedX) => this.anchor?.bottomLineFoundation?.setRippleCenter(normalizedX),
        notifyChange: (value) => this.updateValue(value, ValueSource.foundation),
        // setSelectedText does nothing, library consumer should set the text; gives them more freedom to e.g. also use markup:
        setSelectedText: () => undefined,
        isSelectedTextFocused: () => !!(document.activeElement && document.activeElement === this.text?._elm.nativeElement),
        getSelectedTextAttr: (attr) => this.text?._elm.nativeElement.getAttribute(attr),
        setSelectedTextAttr: (attr, value) => this.text ? this.rndr.setAttribute(this.text._elm.nativeElement, attr, value) : undefined,
        openMenu: () => this.menu!.openAndFocus(<any>null),
        closeMenu: () => this.menu!.doClose(),
        getAnchorElement: () => this.anchor!._elm.nativeElement,
        setMenuAnchorElement: (anchorEl) => this.surface!.menuAnchor = anchorEl,
        setMenuAnchorCorner: (anchorCorner) => this.surface!.setFoundationAnchorCorner(anchorCorner),
        setMenuWrapFocus: () => undefined, // foundation always sets this to false, which is the default anyway - skip
        setAttributeAtIndex: (index, name, value) => {
            if (name != strings.ARIA_SELECTED_ATTR) {
                const item = this.menu?._list?.getItem(index)?._elm.nativeElement;
                if (item)
                    this.rndr.setAttribute(item, name, value);
            }
        },
        removeAttributeAtIndex: (index, name) => {
            if (name !== strings.ARIA_SELECTED_ATTR) {
                const item = this.menu?._list?.getItem(index)?._elm.nativeElement;
                if (item)
                    this.rndr.removeAttribute(item, name);
            }
        },
        focusMenuItemAtIndex: (index) => {
            const item = this.menu?._list?.getItem(index)?._elm.nativeElement;
            if (item)
                item.focus();
        },
        getMenuItemCount: () => this.menu?._list?.getItems().length || 0,
        getMenuItemValues: () => this.menu?._list?.getItems().map(item => item.value || '') || [],
        // foundation uses this to 'setSelectedText', but that's ignored in our implementation (see remark on setSelectedText):
        getMenuItemTextAtIndex: () => '',
        getMenuItemAttr: (menuItem, attr) => {
            if (attr === strings.VALUE_ATTR)
                return this.menu?._list?.getItemByElement(menuItem)?.value || null;
            return menuItem.getAttribute(attr);
        },
        addClassAtIndex: (index, className) => {
            const item = this.menu?._list?.getItem(index);
            if (item && className === cssClasses.SELECTED_ITEM_CLASS) {
                item.active = true;
            } else if (item)
                this.rndr.addClass(item._elm.nativeElement, className);
        },
        removeClassAtIndex: (index, className) => {
            const item = this.menu?._list?.getItem(index);
            if (item && className === cssClasses.SELECTED_ITEM_CLASS) {
                item.active = false;
            } else if (item)
                this.rndr.removeClass(this.menu!._list.getItem(index)!._elm.nativeElement, className);
        }
    };
    /** @docs-private */
    foundation: MDCSelectFoundation | null = null;

    constructor(private elm: ElementRef, private rndr: Renderer2) {
    }

    ngAfterContentInit() {
        this._lastMenu = this._menus!.first;
        this._menus!.changes.subscribe(() => {
            if (this._lastMenu !== this._menus!.first) {
                this.onMenuChange$.next();
                this._lastMenu?._menu.itemValuesChanged.pipe(takeUntil(this.onMenuChange$)).subscribe(() => this.onItemsChange$.next());
                this._lastMenu = this._menus!.first;
                this.setupMenuHandlers();
            }
        });
        this._lists!.changes.subscribe(() => this.initListLabel());
        merge(
            this.onMenuChange$,
            // the foundation initializes with the values of the items, so if they change, the foundation must be reconstructed:
            this.onItemsChange$,
            // mdcSelectText change needs a complete re-init as well:
            this._texts!.changes
        ).pipe(
            takeUntil(this.onDestroy$),
            debounceTime(1)
        ).subscribe(() => {
            this.reconstructComponent();
        });
        this.initComponent();
        this.setupMenuHandlers();
        this.initListLabel();
    }

    ngOnDestroy() {
        this.onMenuChange$.next(); this.onMenuChange$.complete();
        this.onDestroy$.next(); this.onDestroy$.complete();
        this.onItemsChange$.complete();
        this.destroyComponent();
    }

    private initComponent() {
        this.foundation = new class extends MDCSelectFoundation {
            isValid() {
                //TODO: required effect on validity in combination with @angular/forms
                //TODO: setValid/aria-invalid/helpertext validity
                return super.isValid();
            }
        }(this.mdcAdapter, {
            helperText: undefined,
            leadingIcon: undefined
        });
        this.foundation.init();
        // foundation needs a call to setDisabled (even when false), because otherwise
        // tabindex will not be set correctly:
        this.foundation.setDisabled(this._disabled);
        this.foundation.setRequired(this._required);
        // foundation only updates aria-expanded on open/close, not on initialization:
        this.mdcAdapter.setSelectedTextAttr('aria-expanded', `${this.surface!.open}`);
        // TODO: it looks like the foundation doesn't update aria-expanded when the surface is
        //  opened programmatically.
    }

    private destroyComponent() {
        this.foundation?.destroy();
        this.foundation = null;
    }

    private reconstructComponent() {
        this.destroyComponent();
        this.initComponent();
    }

    private setupMenuHandlers() {
        if (this.menu) {
            this.menu._listFunction = MdcListFunction.select;
            this.menu.pick.pipe(takeUntil(this.onMenuChange$)).subscribe((evt) => {
                this.foundation?.handleMenuItemAction(evt.index);
            });
            this.surface!.afterOpened.pipe(takeUntil(this.onMenuChange$)).subscribe(() => {
                this.foundation?.handleMenuOpened();
            });
            this.surface!.afterClosed.pipe(takeUntil(this.onMenuChange$)).subscribe(() => {
                this.foundation?.handleMenuClosed();
            });
        }
    }

    private initListLabel() {
        this._lists!.forEach(list => {
            list.labelledBy = this._listLabelledBy;
        });
    }

    /**
     * The value of the selected item.
     */
    @Input() get value() {
        return this._value;
    }

    set value(value: string | null) {
        this.updateValue(value, ValueSource.program);
    }

    /** @docs-private */
    updateValue(value: string | null, source: ValueSource) {
        const oldSource = this._valueSource;
        try {
            if (!this._valueSource)
                this._valueSource = source;
            if (source === ValueSource.foundation) {
                this._value = value;
                Promise.resolve().then(() => {
                    this.valueChange.emit(value);
                    if (this._valueSource !== ValueSource.control)
                        this._onChange(value);    
                });
            } else if (value !== this.value) {
                if (this.foundation) {
                    this.foundation.setValue(value!); // foundation should also accept null value
                    // foundation will do a nested call for this function with source===foundation
                    // there we will handle the value change and emit to observers (see the if block preceding this)
                } else {
                    this._value = value;
                    Promise.resolve().then(() => {
                        this.valueChange.emit(value);
                        if (this._valueSource !== ValueSource.control)
                            this._onChange(value);
                    });
                }
            }
        } finally {
            this._valueSource = oldSource;
        }
    }

    /**
     * To disable the select, set this input to a value other then false.
     */
    @Input()
    get disabled() {
        return this._disabled;
    }

    set disabled(value: any) {
        this._disabled = asBoolean(value);
        this.foundation?.setDisabled(this._disabled);
    }

    /**
     * To make the select a required input, set this input to a value other then false.
     */
    @Input()
    get required() {
        return this._required;
    }

    set required(value: any) {
        this._required = asBoolean(value);
        this.foundation?.setRequired(this._required);
    }

    /** @docs-private */
    @HostBinding('class.mdc-select--outlined') get outlined() {
        return !!this.anchor?._outline;
    }

    /** @docs-private */
    @HostBinding('class.mdc-select--no-label') get labeled() {
        return !this.anchor?._label;
    }

    /** @docs-private */
    setListLabelledBy(id: string | null) {
        this._listLabelledBy = id;
        this.initListLabel();
    }

    /** @docs-private */
    get expanded() {
        return !!this.surface?.open;
    }

    private get menu() {
        return this._menus?.first?._menu;
    }

    private get surface() {
        return this._menus?.first?._surface;
    }

    private get anchor() {
        return this._anchors?.first;
    }

    private get label() {
        return this.anchor?._label;
    }

    private get text() {
        return this._texts?.first;
    }

    private getSelectedItem() {
        return this.menu?._list?.getSelectedItem();
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
    onBlur() {
        this.foundation?.handleBlur();
        this._onTouched();
    }
}

/**
 * Directive for adding Angular Forms (<code>ControlValueAccessor</code>) behavior to an
 * `mdcSelect`. Allows the use of the Angular Forms API with select inputs,
 * e.g. binding to <code>[(ngModel)]</code>, form validation, etc.
 */
@Directive({
    selector: '[mdcSelect][formControlName],[mdcSelect][formControl],[mdcSelect][ngModel]',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MdcFormsSelectDirective), multi: true}
    ]
})
export class MdcFormsSelectDirective implements ControlValueAccessor {
    constructor(@Self() private mdcSelect: MdcSelectDirective) {
    }

    /** @docs-private */
    writeValue(obj: any) {
        this.mdcSelect.updateValue(obj, ValueSource.control);
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

export const SELECT_DIRECTIVES = [
    MdcSelectTextDirective,
    MdcSelectAnchorDirective,
    MdcSelectMenuDirective,
    MdcSelectDirective,
    MdcFormsSelectDirective
];
