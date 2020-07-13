import { AfterContentInit, ContentChildren, Directive, ElementRef, HostBinding,
  Input, OnDestroy, QueryList, Renderer2 } from '@angular/core';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';;

/**
 * Directive for a separator in a list (between list items), or as a separator between lists.
 * This directive also adds a "role" attribute to its element (depending on the context
 * where the divider is used).
 */
@Directive({
    selector: '[mdcListDivider]',
})
export class MdcListDividerDirective {
    @HostBinding('class.mdc-list-divider') _cls = true;
    @HostBinding('attr.role') _role = 'separator';
    @HostBinding('attr.disabled') _disabled = false;
    private _inset = false;
    private _padded = false;
    
    constructor(private _elm: ElementRef) {
        if (_elm.nativeElement.nodeName === 'OPTION') {
            this._role = 'presentation';
            this._disabled = true;
        } else if (_elm.nativeElement.nodeName === 'HR')
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

    set inset(val: any) {
        this._inset = asBoolean(val);
    }

    /**
     * When this input is defined and does not have value false, the divider leaves
     * gaps on each site to match the padding of <code>mdcListItemMeta</code>.
     */
    @Input() @HostBinding('class.mdc-list-divider--padded')
    get padded() {
        return this._padded;
    }

    set padded(val: any) {
        this._padded = asBoolean(val);
    }
}

/**
 * Directive for the items of a material list.
 * This directive should be used for the direct children of a <code>MdcListDirective</code>.
 */
@Directive({
    selector: '[mdcListItem]'
})
export class MdcListItemDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-list-item') _cls = true;
    @HostBinding('attr.role') public _role = null;
    private _initialized = false;
    private _interactive = false;
    private _disabled = false;
    private _selected = false;
    private _activated = false;
    /**
     * When a list is used inside an <code>mdcMenu</code>, or <code>mdcSelect</code>,
     * this property can be used to assign a value to this choice/selection item.
     */
    @Input() value;

    constructor(public _elm: ElementRef, rndr: Renderer2, registry: MdcEventRegistry) {
        super(_elm, rndr, registry)
    }

    ngAfterContentInit() {
        this._initialized = true;
        if (this._interactive)
            this.initRipple();
    }
  
    ngOnDestroy() {
        this.destroyRipple();
    }

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
     * When a list is used inside an <code>mdcMenu</code>, or <code>mdcSelect</code>,
     * this property can be used to disable the item. When disabled, the list-item will have
     * the <code>aria-disabled</code> attribute, and for  <code>mdcMenu</code>,
     * or <code>mdcSelect</code> will set the <code>tabindex</code> to <code>-1</code>.
     */
    @Input()
    get disabled() {
        return this._disabled;
    }

    set disabled(val: any) {
        this._disabled = asBoolean(val);
    }

    /**
     * When this value is set to a value other than false, the list item will be
     * styled in a selected state. Note: selection and activation are different things.
     * Multiple items in a list can be selected, only one can be activated.
     * Selection is likely to change soon, activation is more permanent than selection.
     */
    @Input() @HostBinding('class.mdc-list-item--selected')
    get selected() {
        return this._selected;
    }

    set selected(val: any) {
        this._selected = asBoolean(val);
    }

    /**
     * When this value is set to a value other than false, the list item will be
     * styled in an activated state. Note: selection and activation are different things.
     * Multiple items in a list can be selected, only one can be activated.
     * Selection is likely to change soon, activation is more permanent than selection.
     */
    @Input() @HostBinding('class.mdc-list-item--activated')
    get activated() {
        return this._activated;
    }

    set activated(val: any) {
        this._activated = asBoolean(val);
    }

    @HostBinding('attr.tabindex') get _tabIndex() {
        if (this._role === 'menuitem' || this._role === 'option')
            return this._disabled ? -1 : 0;
        return null;
    }

    @HostBinding('attr.aria-disabled') get _ariaDisabled() {
        if (this._disabled)
            return 'true';
        return null;
    }
}

/**
 * Directive to mark the first line of an item with "two line list" styling
 * according to the Material Design spec.
 * This directive, if used, should be the child of an <code>MdcListItemDirective</code>.
 * Using this directive inside any <code>mdcListItem</code> will put the list
 * "two line" mode.
 */
@Directive({
    selector: '[mdcListItemText]'
})
export class MdcListItemTextDirective {
    @HostBinding('class.mdc-list-item__text') _cls = true;

    constructor() {}
}

/**
 * Directive for the secondary text of an item with "two line list" styling.
 */
@Directive({
    selector: '[mdcListItemSecondaryText]',
})
export class MdcListItemSecondaryTextDirective {
    @HostBinding('class.mdc-list-item__secondary-text') _cls = true;
    
    constructor() {}
}

/**
 * Directive for the start detail item of a list item.
 * This directive, if used, should be the child of an <code>MdcListItemDirective</code>.
 */
@Directive({
    selector: '[mdcListItemGraphic]',
})
export class MdcListItemGraphicDirective {
    @HostBinding('class.mdc-list-item__graphic') _cls = true;
    
    constructor() {}
}

/**
 * Directive for the end detail item of a list item.
 * This directive, if used, should be the child of an <code>MdcListItemDirective</code>.
 */
@Directive({
    selector: '[mdcListItemMeta]',
})
export class MdcListItemMetaDirective {
    @HostBinding('class.mdc-list-item__meta') _cls = true;
    
    constructor() {}
}

export enum MdcListFunction {
    plain, menu
};

/**
 * Directive for a material list.
 * The children of this directive should either be <code>MdcListItemDirective</code>,
 * or <code>MdcListDividerDirective</code> elements.
 * This directive can optionally be contained in a <code>MdcListGroupDirective</code>, in a
 * <code>MdcMenuDirective</code>, or in a <code>MdcSelectDirective</code>.
 */
@Directive({
    selector: '[mdcList]',
})
export class MdcListDirective implements AfterContentInit {
    @HostBinding('class.mdc-list') _cls = true;
    @ContentChildren(MdcListItemDirective) _items: QueryList<MdcListItemDirective>;
    @ContentChildren(MdcListItemTextDirective, {descendants: true}) _texts: QueryList<MdcListItemTextDirective>;
    @HostBinding('class.mdc-list--two-line') _twoLine = false;
    private _function: MdcListFunction = MdcListFunction.plain;
    _hidden = false;
    private _dense = false;
    private _avatar = false;
    private _nonInteractive = false;
    
    constructor(public _elm: ElementRef) {}

    ngAfterContentInit() {
        this.updateItems();
        this._items.changes.subscribe(() => {
            this.updateItems();
        });
        this._texts.changes.subscribe(_ => this._twoLine = this._texts.length > 0);
        this._twoLine = this._texts.length > 0;
    }

    private updateItems() {
        let itemRole = null;
        if (this._function === MdcListFunction.menu)
            itemRole = 'menuitem';
        if (this._items)
            this._items.forEach(item => {
                item._role = itemRole;
                item._setInteractive(!this._nonInteractive);
            });
    }

    @HostBinding('attr.role') get _role() {
        return (this._function === MdcListFunction.menu) ? 'menu' : null;
    }

    @HostBinding('attr.aria-hidden') get _ariaHidden() {
        return (this._hidden && this._function === MdcListFunction.menu) ? 'true' : null;
    }

    @HostBinding('class.mdc-menu__items') get _isMenu() {
        return this._function === MdcListFunction.menu;
    }

    _setFunction(val: MdcListFunction) {
        this._function = val;
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
    
    set dense(val: any) {
        this._dense = asBoolean(val);
    }

    /**
     * When this input is defined and does not have value false, interactivity affordances for
     * the list will be disabled.
     */
    @Input() @HostBinding('class.mdc-list--non-interactive')
    get nonInteractive() {
        return this._nonInteractive;
    }
    
    set nonInteractive(val: any) {
        let newValue = asBoolean(val);
        if (newValue !== this._nonInteractive) {
            this._nonInteractive = newValue;
            this.updateItems();
        }
    }

    /**
     * When this input is defined and does not have value false, elements with directive <code>mdcListItemGraphic</code>
     * will be styled for avatars: large, circular elements that lend themselves well to contact images, profile pictures, etc. 
     */
    @Input() @HostBinding('class.mdc-list--avatar-list')
    get avatarList() {
        return this._avatar;
    }

    set avatarList(val: any) {
        this._avatar = asBoolean(val);
    }
}

/**
 * Directive for a header inside a list group (<code>mdcListGroup</code>) directive.
 */
@Directive({
    selector: '[mdcListGroupSubHeader]'
})
export class MdcListGroupSubHeaderDirective {
    @HostBinding('class.mdc-list-group__subheader') _cls = true;

    constructor() {}
}


/**
 * Directive for a material designed list group, grouping several
 * <code>mdcList</code> lists.
 * List groups should contain elements with <code>mdcListGroupSubHeader</code>,
 * and <code>mdcList</code> directives.
 */
@Directive({
    selector: '[mdcListGroup]'
})
export class MdcListGroupDirective {
    @HostBinding('class.mdc-list-group') _cls = true;

    constructor() {}
}
