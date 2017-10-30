import { AfterContentInit, Component, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, HostListener,
  Input, OnDestroy, Output, Provider, QueryList, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCSimpleMenuFoundation, MDCSimpleMenu, util } from '@material/menu';
import { MdcSimpleMenuAdapter } from './mdc.simple.menu.adapter';
import { MdcListDirective, MdcListItemDirective, MdcListFunction } from '../list/mdc.list.directive';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

const CLASS_MENU = 'mdc-simple-menu';
const CLASS_MENU_OPEN = 'mdc-simple-menu--open';
const CLASS_TOP_LEFT = 'mdc-simple-menu--open-from-top-left';
const CLASS_TOP_RIGHT = 'mdc-simple-menu--open-from-top-right';
const CLASS_BOTTOM_LEFT = 'mdc-simple-menu--open-from-bottom-left';
const CLASS_BOTTOM_RIGHT = 'mdc-simple-menu--open-from-bottom-right';

export interface MdcMenuSelection {
    value: any,
    index: number
}

/**
 * Directive for an optional anchor to which a menu can position itself.
 * Use the <code>menuAnchor</code> input of <code>MdcSimpleMenuDirective</code>
 * to bind the menu to the anchor. The anchor must be a direct parent of the menu.
 * It will get the following styles to make the positioning work:
 * <code>position: relative;</code>, and <code>overflow: visible;</code>.
 */
@Directive({
    selector: '[mdcMenuAnchor]',
    exportAs: 'mdcMenuAnchor'
})
export class MdcMenuAnchorDirective {
    @HostBinding('class.mdc-menu-anchor') _cls = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * Directive for a spec aligned material design 'Simple Menu'.
 * This directive should wrap an <code>MdcListDirective</code>. The <code>mdcList</code>
 * contains the menu items (and possible separators).
 */
@Directive({
    selector: '[mdcSimpleMenu]'
})
export class MdcSimpleMenuDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-simple-menu') _cls = true;
    private _function = MdcListFunction.menu;
    private _open = false;
    private _openFrom: 'tl' | 'tr' | 'bl' | 'br' | null = null;
    /**
     * Assign an (optional) <code>MdcMenuAnchorDirective</code>. If set the menu
     * will position itself relative to this anchor element. The anchor should be
     * a direct parent of this menu.
     */
    @Input() menuAnchor: MdcMenuAnchorDirective;
    /**
     * Event emitted when the user selects a value. The passed object contains a value
     * (set to the <code>value</code> of the selected list item), and an index
     * (set to the index of the selected list item).
     */
    @Output() pick: EventEmitter<MdcMenuSelection> = new EventEmitter();
    /**
     * Event emitted when the menu is closed without any selection being made.
     */
    @Output() cancel: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted when the menu is opened or closed.
     */
    @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter();
    private _lastList: MdcListDirective;
    @ContentChildren(MdcListDirective) _listQuery: QueryList<MdcListDirective>;
    private _prevFocus: Element;
    private mdcAdapter: MdcSimpleMenuAdapter = {
        addClass: (className: string) => {
            this._rndr.addClass(this._elm.nativeElement, className);
        },
        removeClass: (className: string) => {
            this._rndr.removeClass(this._elm.nativeElement, className);
        },
        hasClass: (className: string) => {
            if (CLASS_MENU === className)
                return true;
            if (CLASS_MENU_OPEN === className)
                return this._open;
            if (CLASS_TOP_LEFT === className)
                return this._openFrom === 'tl';
            if (CLASS_TOP_RIGHT === className)
                return this._openFrom === 'tr';
            if (CLASS_BOTTOM_LEFT === className)
                return this._openFrom === 'bl';
            if (CLASS_BOTTOM_RIGHT === className)
                return this._openFrom === 'br';
            return this._elm.nativeElement.classList.contains(className);
        },
        hasNecessaryDom: () => this._listQuery.length != 0,
        getAttributeForEventTarget: (target: Element, attrName: string) => target.getAttribute(attrName),
        getInnerDimensions: () => {
            let elm = this._list._elm.nativeElement;
            return {width: elm.offsetWidth, height: elm.offsetHeight};
        },
        hasAnchor: () => this.menuAnchor != null,
        getAnchorDimensions: () => {
            if (!this.viewport)
                return this.menuAnchor._elm.nativeElement.getBoundingClientRect();
            let viewportRect = this.viewport.getBoundingClientRect();
            let anchorRect = this.menuAnchor._elm.nativeElement.getBoundingClientRect();
            return {
                bottom: anchorRect.bottom - viewportRect.top,
                left: anchorRect.left - viewportRect.left,
                right: anchorRect.right - viewportRect.left,
                top: anchorRect.top - viewportRect.top,
                width: anchorRect.width,
                height: anchorRect.height
            };
        },
        getWindowDimensions: () => ({
            width: this.viewport ? this.viewport.clientWidth : window.innerWidth,
            height: this.viewport ? this.viewport.clientHeight : window.innerHeight
        }),
        setScale: (x: number, y: number) => {
            this._elm.nativeElement.style[util.getTransformPropertyName(window)] = `scale(${x}, ${y})`;
        },
        setInnerScale: (x: number, y: number) => {
            this._list._elm.nativeElement.style[util.getTransformPropertyName(window)] = `scale(${x}, ${y})`;
        },
        getNumberOfItems: () => this._list._items.length,
        registerInteractionHandler: (type: string, handler: EventListener) => {
            this._registry.listen(this._rndr, type, handler, this._elm);
        },
        deregisterInteractionHandler: (type: string, handler: EventListener) => {
            this._registry.unlisten(type, handler);
        },
        registerBodyClickHandler: (handler: EventListener) => {
            this._registry.listenElm(this._rndr, 'click', handler, document.body);
        },
        deregisterBodyClickHandler: (handler: EventListener) => {
            this._registry.unlisten('click', handler);
        },
        getYParamsForItemAtIndex: (index: number) => {
            const {offsetTop: top, offsetHeight: height} = this._list._items.toArray()[index]._elm.nativeElement;
            return {top, height};
        },
        setTransitionDelayForItemAtIndex: (index: number, value: string | null) => {
            this._list._items.toArray()[index]._elm.nativeElement.style.setProperty('transition-delay', value)
        },
        getIndexForEventTarget: (target: EventTarget) => this._list._items.toArray().map(i => i._elm.nativeElement).indexOf(target),
        notifySelected: (evtData: {index: number}) => {
            this._open = false;
            this.pick.emit({index: evtData.index, value: this._list._items.toArray()[evtData.index].value});
            this._onOpenClose();
        },
        notifyCancel: () => {
            this._open = false;
            this.cancel.emit();
            this._onOpenClose();
        },
        saveFocus: () => {
            this._prevFocus = document.activeElement;
        },
        restoreFocus: () => {
            if (this._prevFocus)
                (<any>this._prevFocus).focus();
        },
        isFocused: () => document.activeElement === this._elm.nativeElement,
        focus: () => {
            this._elm.nativeElement.focus();
        },
        getFocusedItemIndex: () => this._list._items.toArray().map(i => i._elm.nativeElement).indexOf(document.activeElement),
        focusItemAtIndex: (index: number) => {
            this._list._items.toArray()[index]._elm.nativeElement.focus();
        },
        isRtl: () => getComputedStyle(this._elm.nativeElement).getPropertyValue('direction') === 'rtl',
        setTransformOrigin: (origin: string) => {
            this._elm.nativeElement.style[`${util.getTransformPropertyName(window)}-origin`] = origin;
        },
        setPosition: (position: {top: string | undefined, right: string | undefined, bottom: string | undefined, left: string | undefined}) => {
            let el = this._elm.nativeElement;
            this._rndr.setStyle(el, 'left', 'left' in position ? position.left : null);
            this._rndr.setStyle(el, 'right', 'right' in position ? position.right : null);
            this._rndr.setStyle(el, 'top', 'top' in position ? position.top : null);
            this._rndr.setStyle(el, 'bottom', 'bottom' in position ? position.bottom : null);
        },
        getAccurateTime: () => window.performance.now()
    };
    private foundation: {
        open(arg?: {focusIndex?: number}),
        close(event?: Event),
        isOpen(): boolean
    } = new MDCSimpleMenuFoundation(this.mdcAdapter);
    // we need an MDCSimpleMenu for simple menu's contained inside mdc-select:
    public _component: MDCSimpleMenu;

    constructor(public _elm: ElementRef, private _rndr: Renderer2, private _registry: MdcEventRegistry) {
    }

    ngAfterContentInit() {
        this._lastList = this._listQuery.first;
        if (this._lastList) {
            this._lastList._setFunction(MdcListFunction.menu);
            this._onOpenClose(false);
        }
        this._listQuery.changes.subscribe(() => {
            if (this._lastList !== this._listQuery.first) {
                this._lastList._setFunction(MdcListFunction.plain);
                this._lastList = this._listQuery.first;
                if (this._lastList) {
                    this._lastList._setFunction(MdcListFunction.menu);
                    this._onOpenClose(false);
                    if (this._component == null)
                        this._component = new MDCSimpleMenu(this._elm.nativeElement, this.foundation);
                } else {
                    this._component.destroy();
                    this._component = null;
                    this.foundation = new MDCSimpleMenuFoundation(this.mdcAdapter);
                }
            }
        });
        if (this._lastList)
            // constructing the MDCSimpleMenu also initializes the foundation:
            this._component = new MDCSimpleMenu(this._elm.nativeElement, this.foundation);
    }

    ngOnDestroy() {
        if (this._component)
            this._component.destroy();
    }

    private _onOpenClose(emit = true) {
        if (this._list)
            this._list._hidden = !this._open;
        if (emit)
            this.isOpenChange.emit(this._open);
    }

    set _listFunction(val: MdcListFunction) {
        this._function = val;
        if (this._lastList) // otherwise this will happen in ngAfterContentInit
            this._list._setFunction(val);
    }

    get _list(): MdcListDirective {
        return this._listQuery.first;
    }

    @HostBinding('class.mdc-select__menu') get _isSelect() {
        return this._function === MdcListFunction.select;
    }
    
    /**
     * When this input is defined and does not have value false, the menu will be opened,
     * otherwise the menu will be closed.
     */
    @Input() @HostBinding('class.mdc-simple-menu--open')
    get isOpen() {
        return this._open;
    }
    
    set isOpen(val: any) {
        let newValue = asBoolean(val);
        if (newValue !== this._open) {
            this._open = newValue;
            if (this._component != null) {
                if (this._open)
                    this.foundation.open();
                else
                    this.foundation.close();
            }
            this._onOpenClose(false);
        }
    }

    /**
     * Set this value if you want to customize the direction from which the menu will be opened.
     * Note that without this setting the menu will base the direction upon its position in the viewport,
     * which is normally the right behavior. Use <code>'tl'</code> for top-left, <code>'br'</code>
     * for bottom-right, etc.
     */
    @Input()
    get openFrom(): 'tl' | 'tr' | 'bl' | 'br' | null {
        return this._openFrom;
    }

    set openFrom(val: 'tl' | 'tr' | 'bl' | 'br' | null) {
        if (val === 'br' || val === 'bl' || val === 'tr' || val === 'tl')
            this._openFrom = val;
        else
            this._openFrom = null;
    }

    @HostBinding('class.mdc-simple-menu--open-from-top-left') get _tl() { return this._openFrom === 'tl'; }
    @HostBinding('class.mdc-simple-menu--open-from-top-right') get _tr() { return this._openFrom === 'tr'; }
    @HostBinding('class.mdc-simple-menu--open-from-bottom-left') get _bl() { return this._openFrom === 'bl'; }
    @HostBinding('class.mdc-simple-menu--open-from-bottom-right') get _br() { return this._openFrom === 'br'; }

    /**
     * Assign any <code>HTMLElement</code> to this property to use as the viewport instead of
     * the window object. The menu will choose to open the menu from the top or bottom, and
     * from the left or right, based on the space available inside the viewport.
     * It's normally not needed to set this, and mainly added for the demos and examples.
     */
    @Input() viewport: HTMLElement;
}
