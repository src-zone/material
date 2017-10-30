import { AfterContentInit, Component, ContentChildren, Directive, ElementRef, HostBinding, HostListener,
  Input, QueryList, Renderer2 } from '@angular/core';
import { asBoolean } from '../../utils/value.utils';
import { MdcButtonDirective } from '../button/mdc.button.directive';

/**
 * Directive for a separator in a list.
 * This directive, if used, should be the child of an <code>MdcListDirective</code>, or
 * an <code>MdcSelectMultipleNativeDirective</code>.
 * This directive also adds the "role" attribute to its element.
 */
@Directive({
    selector: '[mdcListDivider]',
})
export class MdcListDividerDirective {
    @HostBinding('class.mdc-list-divider') _cls = true;
    @HostBinding('attr.role') _role = 'separator';
    @HostBinding('attr.disabled') _disabled = false;
    private _inset = false;
    
    constructor(private _elm: ElementRef) {
        if (_elm.nativeElement.nodeName === 'OPTION') {
            this._role = 'presentation';
            this._disabled = true;
        }
    }

    /**
     * When this input is defined and does not have value false, the divider is styled with
     * an inset.
     */
    @Input() @HostBinding('class.mdc-list-divider--inset')
    get hasInset() {
        return this._inset;
    }

    set hasInset(val: any) {
        this._inset = asBoolean(val);
    }
}

/**
 * Directive for the items of a material list.
 * This directive should be used for the direct children of a <code>MdcListDirective</code>.
 */
@Directive({
    selector: '[mdcListItem]'
})
export class MdcListItemDirective {
    @HostBinding('class.mdc-list-item') _cls = true;
    @HostBinding('attr.role') public _role = null;
    private _disabled = false;
    /**
     * When a list is used inside an <code>mdcSimpleMenu</code>, or <code>mdcSelect</code>,
     * this property can be used to assign a value to this choice/selection item.
     */
    @Input() value;

    constructor(public _elm: ElementRef) {}

    /**
     * When a list is used inside an <code>mdcSimpleMenu</code>, or <code>mdcSelect</code>,
     * this property can be used to disable the item. When disabled, the list-item will have
     * the <code>aria-disabled</code> attribute, and for  <code>mdcSimpleMenu</code>,
     * or <code>mdcSelect</code> will set the <code>tabindex</code> to <code>-1</code>.
     */
    @Input()
    get disabled() {
        return this._disabled;
    }

    set disabled(val: any) {
        this._disabled = asBoolean(val);
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
    selector: '[mdcListItemTextSecondary]',
})
export class MdcListItemTextSecondaryDirective {
    @HostBinding('class.mdc-list-item__text__secondary') _cls = true;
    
    constructor() {}
}

/**
 * Directive for the start detail item of a list item.
 * This directive, if used, should be the child of an <code>MdcListItemDirective</code>.
 */
@Directive({
    selector: '[mdcListItemStartDetail]',
})
export class MdcListItemStartDetailDirective {
    @HostBinding('class.mdc-list-item__start-detail') _cls = true;
    
    constructor() {}
}

/**
 * Directive for the end detail item of a list item.
 * This directive, if used, should be the child of an <code>MdcListItemDirective</code>.
 */
@Directive({
    selector: '[mdcListItemEndDetail]',
})
export class MdcListItemEndDetailDirective {
    @HostBinding('class.mdc-list-item__end-detail') _cls = true;
    
    constructor() {}
}

export enum MdcListFunction {
    plain, menu, select
};

/**
 * Directive for a material list.
 * The children of this directive should either be <code>MdcListItemDirective</code>,
 * or <code>MdcListDividerDirective</code> elements.
 * This directive can optionally be contained in a <code>MdcListGroupDirective</code>, in a
 * <code>MdcSimpleMenuDirective</code>, or in a <code>MdcSelectDirective</code>.
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
    
    constructor(public _elm: ElementRef) {}

    ngAfterContentInit() {
        this.updateItemRoles();
        this._items.changes.subscribe(() => {
            this.updateItemRoles();
        });
        this._texts.changes.subscribe(_ => this._twoLine = this._texts.length > 0);
        this._twoLine = this._texts.length > 0;
    }

    private updateItemRoles() {
        let itemRole = null;
        if (this._function === MdcListFunction.menu)
            itemRole = 'menuitem';
        else if (this._function === MdcListFunction.select)
            itemRole = 'option';
        this._items.forEach(item => {
            item._role = itemRole;
        });
    }

    @HostBinding('attr.role') get _role() {
        return (this._function === MdcListFunction.menu) ? 'menu' : null;
        // Note: role="listbox" is set on the mdcSelect, not on this mdcList
    }

    @HostBinding('attr.aria-hidden') get _ariaHidden() {
        return (this._hidden && this._function === MdcListFunction.menu) ? 'true' : null;
    }

    @HostBinding('class.mdc-simple-menu__items') get _isMenu() {
        return this._function === MdcListFunction.menu || this._function === MdcListFunction.select;
    }

    _setFunction(val: MdcListFunction) {
        this._function = val;
        this.updateItemRoles();
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
     * When this input is defined and does not have value false, elements with directive <code>mdcListItemStartDetail</code>
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
 * Directive for a header inside a list group (<code>MdcListGroupDirective</code>) directive.
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
 * <code>MdcListDirective</code> lists.
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
