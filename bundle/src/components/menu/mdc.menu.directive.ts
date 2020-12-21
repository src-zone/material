import { AfterContentInit, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding,
  Input, OnDestroy, Output, QueryList, Renderer2, Self, HostListener, OnInit } from '@angular/core';
import { cssClasses as listCssClasses } from '@material/list';
import { MDCMenuFoundation, MDCMenuAdapter, cssClasses, strings, DefaultFocusState } from '@material/menu';
import { MdcMenuSurfaceDirective } from '../menu-surface/mdc.menu-surface.directive';
import { MdcListDirective, MdcListFunction } from '../list/mdc.list.directive';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Data send by the <code>pick</code> event of <code>MdcMenuDirective</code>.
 */
export interface MdcMenuSelection {
    /**
     * The <code>value</code> of the selected menu item (<code>MdcListItemDirective</code>).
     */
    value: any,
    /**
     * The index of the selected menu item (<code>MdcListItemDirective</code>).
     */
    index: number
}

// attributes on list-items that we maintain ourselves, so should be ignored
// in the adapter:
const ANGULAR_ITEM_ATTRIBUTES = [
    strings.ARIA_CHECKED_ATTR, strings.ARIA_DISABLED_ATTR
];
// classes on list-items that we maintain ourselves, so should be ignored
// in the adapter:
const ANGULAR_ITEM_CLASSES = [
    listCssClasses.LIST_ITEM_DISABLED_CLASS, cssClasses.MENU_SELECTED_LIST_ITEM
];

export enum FocusOnOpen {first = 0, last = 1, root = -1};
let nextId = 1;

/**
 * Directive for a spec aligned material design Menu.
 * This directive should wrap an `mdcList`. The `mdcList` contains the menu items (and possible separators).
 * 
 * # Accessibility
 * 
 * * For `role` and `aria-*` attributes on the list, see documentation for `mdcList`.
 * * The best way to open the menu by user interaction is to use the `mdcMenuTrigger` directive
 *   on the interaction element (e.g. button). This takes care of following ARIA recommended practices
 *   for focusing the correct element, and maintaining proper `aria-*` and `role` attributes on the
 *   interaction element, menu, and list.
 * * When opening the `mdcMenuSurface` programmatic, the program is responsible for all of this.
 *   (including focusing an element of the menu or the menu itself).
 * * The `mdcList` will be made focusable by setting a `"tabindex"="-1"` attribute.
 * * The `mdcList` will get an `aria-orientation=vertical` attribute.
 * * The `mdcList` will get an `aria-hidden=true` attribute when the menu surface is closed.
 */
@Directive({
    selector: '[mdcMenu],[mdcSelectMenu]',
    exportAs: 'mdcMenu'
})
export class MdcMenuDirective implements AfterContentInit, OnInit, OnDestroy {
    private onDestroy$: Subject<any> = new Subject();
    private onListChange$: Subject<any> = new Subject();
    /** @docs-private */
    @Output() readonly itemsChanged: EventEmitter<void> = new EventEmitter();
    /** @docs-private */
    @Output() readonly itemValuesChanged: EventEmitter<void> = new EventEmitter();
    @HostBinding('class.mdc-menu') _cls = true;
    private _id: string | null = null;
    private cachedId: string | null = null;
    private _function = MdcListFunction.menu;
    private _lastList: MdcListDirective | null= null;

    /**
     * Event emitted when the user selects a value. The passed object contains a value
     * (set to the <code>value</code> of the selected list item), and an index
     * (set to the index of the selected list item).
     */
    @Output() readonly pick: EventEmitter<MdcMenuSelection> = new EventEmitter();
    @ContentChildren(MdcListDirective) _listQuery?: QueryList<MdcListDirective>;
    private mdcAdapter: MDCMenuAdapter = {
        addClassToElementAtIndex: (index, className) => {
            // ignore classes we maintain ourselves
            if (!ANGULAR_ITEM_CLASSES.find(c => c === className)) {
                const elm = this._list?.getItem(index)?._elm.nativeElement;
                if (elm)
                    this.rndr.addClass(elm, className);
            }
        },
        removeClassFromElementAtIndex: (index, className) => {
            // ignore classes we maintain ourselves
            if (!ANGULAR_ITEM_CLASSES.find(c => c === className)) {
                const elm = this._list?.getItem(index)?._elm.nativeElement;
                if (elm)
                    this.rndr.addClass(elm, className);
            }
        },
        addAttributeToElementAtIndex: (index, attr, value) => {
            // ignore attributes we maintain ourselves
            if (!ANGULAR_ITEM_ATTRIBUTES.find(a => a === attr)) {
                const elm = this._list?.getItem(index)?._elm.nativeElement;
                if (elm)
                    this.rndr.setAttribute(elm, attr, value);
            }
        },
        removeAttributeFromElementAtIndex: (index, attr) => {
            // ignore attributes we maintain ourselves
            if (!ANGULAR_ITEM_ATTRIBUTES.find(a => a === attr)) {
                const elm = this._list?.getItem(index)?._elm.nativeElement;
                if (elm)
                    this.rndr.removeAttribute(elm, attr);
            }
        },
        elementContainsClass: (element, className) => element.classList.contains(className),
        closeSurface: (skipRestoreFocus) => {
            if (skipRestoreFocus)
                this.surface.closeWithoutFocusRestore();
            else
                this.surface.open = false;
        },
        getElementIndex: (element) => this._list?._items!.toArray().findIndex(i => i._elm.nativeElement === element),
        notifySelected: (evtData) => {
            this.pick.emit({index: evtData.index, value: this._list._items!.toArray()[evtData.index].value});
        },
        getMenuItemCount: () => this._list?._items!.length || 0,
        focusItemAtIndex: (index) => this._list.getItem(index)?._elm.nativeElement.focus(),
        focusListRoot: () => this._list?._elm.nativeElement.focus(),
        getSelectedSiblingOfItemAtIndex: () => -1, // menuSelectionGroup not yet supported
        isSelectableItemAtIndex: () => false // menuSelectionGroup not yet supported
    };
    private foundation: MDCMenuFoundation | null = null;

    constructor(public _elm: ElementRef, private rndr: Renderer2, @Self() private surface: MdcMenuSurfaceDirective) {
    }

    ngOnInit() {
        // Force setter to be called in case id was not specified.
        this.id = this.id;
    }

    ngAfterContentInit() {
        this._lastList = this._listQuery!.first;
        this._listQuery!.changes.subscribe(() => {
            if (this._lastList !== this._listQuery!.first) {
                this.onListChange$.next();
                this._lastList?._setFunction(MdcListFunction.plain);
                this._lastList = this._listQuery!.first;
                this.destroyFoundation();
                if (this._lastList)
                    this.initAll();
            }
        });
        this.surface.afterOpened.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            this.foundation?.handleMenuSurfaceOpened();
            // reset default focus state for programmatic opening of menu;
            // interactive opening sets the default when the open is triggered
            // (see openAndFocus)
            this.foundation?.setDefaultFocusState(DefaultFocusState.NONE);
        });
        this.surface.openChange.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            if (this._list)
                this._list._hidden = !this.surface.open;
        });
        if (this._lastList)
            this.initAll();
    }

    ngOnDestroy() {
        this.onListChange$.next(); this.onListChange$.complete();
        this.onDestroy$.next(); this.onDestroy$.complete();
        this.destroyFoundation();
    }

    private initAll() {
        Promise.resolve().then(() => this._lastList!._setFunction(this._function));
        this.initFoundation();
        this.subscribeItemActions();
        this._lastList?.itemsChanged.pipe(takeUntil(this.onListChange$)).subscribe(() => this.itemsChanged.emit());
        this._lastList?.itemValuesChanged.pipe(takeUntil(this.onListChange$)).subscribe(() => this.itemValuesChanged.emit());
    }

    private initFoundation() {
        this.foundation = new MDCMenuFoundation(this.mdcAdapter);
        this.foundation.init();
        // suitable for programmatic opening, program can focus whatever element it wants:
        this.foundation.setDefaultFocusState(DefaultFocusState.NONE);
        if (this._list)
            this._list._hidden = !this.surface.open;
    }

    private destroyFoundation() {
        if (this.foundation) {
            this.foundation.destroy();
            this.foundation = null;
        }
    }

    private subscribeItemActions() {
        this._lastList?.itemAction.pipe(takeUntil(this.onListChange$)).subscribe(data => {
            this.foundation?.handleItemAction(this._list.getItem(data.index)!._elm.nativeElement);
        });
    }

    /** @docs-private */
    @HostBinding()
    @Input() get id() {
        return this._id;
    }
  
    set id(value: string | null) {
        this._id = value || this._newId();
    }

    _newId(): string {
        this.cachedId = this.cachedId || `mdc-menu-${nextId++}`;
        return this.cachedId;
    }

    /** @docs-private */
    get open() {
        return this.surface.open;
    }

    /** @docs-private */
    openAndFocus(focus: FocusOnOpen) {
        switch (focus) {
            case FocusOnOpen.first:
                this.foundation?.setDefaultFocusState(DefaultFocusState.FIRST_ITEM);
                break;
            case FocusOnOpen.last:
                this.foundation?.setDefaultFocusState(DefaultFocusState.LAST_ITEM);
                break;
            case FocusOnOpen.root:
            default:
                this.foundation?.setDefaultFocusState(DefaultFocusState.LIST_ROOT);
        }
        this.surface.open = true;
    }

    /** @docs-private */
    doClose() {
        this.surface.open = false;
    }

    set _listFunction(val: MdcListFunction) {
        this._function = val;
        if (this._lastList) // otherwise this will happen in ngAfterContentInit
            this._list._setFunction(val);
    }

    get _list(): MdcListDirective {
        return this._listQuery!.first;
    }

    @HostListener('keydown', ['$event']) _onKeydown(event: KeyboardEvent) {
        this.foundation?.handleKeydown(event);
    }
}

/**
 * 
 * # Accessibility
 * 
 * 
 *  * * `Enter`, `Space`, and `Down Arrow` keys open the menu and place focus on the first item.
 * * `Up Arrow` opens the menu and places focus on the last item
 * * Click/Touch events set focus to the mdcList root element
 * 
 * 
 * * Attribute `role=button` will be set if the element is not aleready a button element.
 * * Attribute `aria-haspopup=menu` will be set if an `mdcMenu` is attached.
 * * Attribute `aria-expanded` will be set while the attached menu is open
 * * Attribute `aria-controls` will be set to the id of the attached menu. (And a unique id will be generated,
 *   if none was set on the menu).
 * * `Enter`, `Space`, and `Down-Arrow` will open the menu with the first menu item focused.
 * * `Up-Arrow` will open the menu with the last menu item focused.
 * * Mouse/Touch events will open the menu with the list root element focused. The list root element
 *   will handle keyboard navigation once it receives focus.
 */
@Directive({
    selector: '[mdcMenuTrigger]',
})
export class MdcMenuTriggerDirective {
    @HostBinding('attr.role') _role: string | null = 'button';
    private _mdcMenuTrigger: MdcMenuDirective | null = null;
    private down = {
        enter: false,
        space: false
    }

    constructor(elm: ElementRef) {
        if (elm.nativeElement.nodeName.toUpperCase() === 'BUTTON')
            this._role = null;
    }

    /** @docs-private */
    @HostListener('click') onClick() {
        if (this.down.enter || this.down.space)
            this._mdcMenuTrigger?.openAndFocus(FocusOnOpen.first);
        else
            this._mdcMenuTrigger?.openAndFocus(FocusOnOpen.root);
    }

    /** @docs-private */
    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
        this.setDown(event, true);
        const {key, keyCode} = event;
        if (key === 'ArrowUp' || keyCode === 38)
            this._mdcMenuTrigger?.openAndFocus(FocusOnOpen.last);
        else if (key === 'ArrowDown' || keyCode === 40)
            this._mdcMenuTrigger?.openAndFocus(FocusOnOpen.first);
    }

    /** @docs-private */
    @HostListener('keyup', ['$event']) onKeyup(event: KeyboardEvent) {
        this.setDown(event, false);
    }

    @HostBinding('attr.aria-haspopup') get _hasPopup() {
        return this._mdcMenuTrigger ? 'menu' : null;
    }

    @HostBinding('attr.aria-expanded') get _expanded() {
        return this._mdcMenuTrigger?.open ? 'true' : null;
    }

    @HostBinding('attr.aria-controls') get _ariaControls() {
        return this._mdcMenuTrigger?.id;
    }

    @Input() get mdcMenuTrigger() {
        return this._mdcMenuTrigger;
    }

    set mdcMenuTrigger(value: MdcMenuDirective | null) {
        if (value && value.openAndFocus)
            this._mdcMenuTrigger = value;
        else
            this._mdcMenuTrigger = null;
    }

    private setDown(event: KeyboardEvent, isDown: boolean) {
        const {key, keyCode} = event;
        if (key === 'Enter' || keyCode === 13)
            this.down.enter = isDown;
        else if (key === 'Space' || keyCode === 32)
            this.down.space = isDown;
    }
}

export const MENU_DIRECTIVES = [
    MdcMenuDirective, MdcMenuTriggerDirective
];
