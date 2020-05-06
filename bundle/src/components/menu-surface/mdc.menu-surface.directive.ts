import { AfterContentInit, ContentChildren, Directive, ElementRef, HostBinding,
  Input, OnDestroy, QueryList, Renderer2, Output, EventEmitter, HostListener, Inject } from '@angular/core';
import { MDCMenuSurfaceFoundation, MDCMenuSurfaceAdapter, util, cssClasses, Corner } from '@material/menu-surface';
import { asBoolean } from '../../utils/value.utils';
import { DOCUMENT } from '@angular/common';
import { simulateKey } from '../../testutils/page.test';

/**
 * The `mdcMenuSurface` is a reusable surface that appears above the content of the page
 * and can be positioned adjacent to an element. It is required as the surface for an `mdcMenu`
 * but can also be used by itself.
 */
@Directive({
    selector: '[mdcMenuSurface]'
})
export class MdcMenuSurfaceDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-menu-surface') _cls = true;
    private _open = false;
    private _openFrom: 'tl' | 'tr' | 'bl' | 'br' | 'ts' | 'te' | 'bs' | 'be' = 'ts';
    // the anchor to use if no menuAnchor is provided (a direct parent MdcMenuAnchor if available):
    _parentAnchor: MdcMenuAnchorDirective | null = null;
    /**
     * Assign an (optional) element or `mdcMenuAnchor`. If set the menu
     * will position itself relative to this anchor element. Assigning this property is not needed
     * if you wrap your surface inside an `mdcMenuAnchor`.
     */
    @Input() menuAnchor: MdcMenuAnchorDirective | HTMLElement | null = null;
    /**
     * Assign any `HTMLElement` to this property to use as the viewport instead of
     * the window object. The menu will choose to open from the top or bottom, and
     * from the left or right, based on the space available inside the viewport.
     * 
     * You should probably not use this property. We only use it to keep the documentation
     * snippets on our demo website contained in their window.
     */
    @Input() viewport: HTMLElement | null = null;
    /**
     * Event emitted when the menu is opened or closed. (When this event is triggered, the
     * surface is starting to open/close, but the animation may not have fully completed
     * yet).
     */
    @Output() openChange: EventEmitter<boolean> = new EventEmitter();
    /**
     * Event emitted after the menu has fully opened. When this event is emitted the full
     * opening animation has completed, and the menu is visible.
     */
    @Output() afterOpened: EventEmitter<boolean> = new EventEmitter();
    /**
     * Event emitted after the menu has fully closed. When this event is emitted the full
     * closing animation has completed, and the menu is not visible anymore.
     */
    @Output() afterClosed: EventEmitter<boolean> = new EventEmitter();
    private _prevFocus: Element;
    private _hoisted = false;
    private _fixed = false;
    private _handleBodyClick = (event) => this.handleBodyClick(event);

    private mdcAdapter: MDCMenuSurfaceAdapter = {
        addClass: (className: string) => this.rndr.addClass(this._elm.nativeElement, className),
        removeClass: (className: string) => this.rndr.removeClass(this._elm.nativeElement, className),
        hasClass: (className: string) => {
            if (className === cssClasses.ROOT)
                return true;
            if (className === cssClasses.OPEN)
                return this._open;
            return this._elm.nativeElement.classList.contains(className);
        },
        hasAnchor: () => !!this._parentAnchor || !!this.menuAnchor,
        isElementInContainer: (el: Element) => this._elm.nativeElement.contains(el),
        isFocused: () => this.document.activeElement === this._elm.nativeElement,
        isRtl: () =>  getComputedStyle(this._elm.nativeElement).getPropertyValue('direction') === 'rtl',
        getInnerDimensions: () => ({width: this._elm.nativeElement.offsetWidth, height: this._elm.nativeElement.offsetHeight}),
        getAnchorDimensions: () => {
            const anchor = this.menuAnchor || this._parentAnchor;
            if (!anchor)
                return null;
            if (!this.viewport)
                return anchor.getBoundingClientRect();
            let viewportRect = this.viewport.getBoundingClientRect();
            let anchorRect = anchor.getBoundingClientRect();
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
        getBodyDimensions: () => ({
            width: this.viewport ? this.viewport.scrollWidth : this.document.body.clientWidth,
            height: this.viewport ? this.viewport.scrollHeight : this.document.body.clientHeight}),
        getWindowScroll: () => ({
            x: this.viewport ? this.viewport.scrollLeft : window.pageXOffset,
            y: this.viewport ? this.viewport.scrollTop : window.pageYOffset
        }),
        setPosition: (position) => {
            let el = this._elm.nativeElement;
            this.rndr.setStyle(el, 'left', 'left' in position ? `${position.left}px` : '');
            this.rndr.setStyle(el, 'right', 'right' in position ? `${position.right}px` : '');
            this.rndr.setStyle(el, 'top', 'top' in position ? `${position.top}px` : '');
            this.rndr.setStyle(el, 'bottom', 'bottom' in position ? `${position.bottom}px` : '');
        },
        setMaxHeight: (height: string) => this._elm.nativeElement.style.maxHeight = height,
        setTransformOrigin: (origin: string) => this.rndr.setStyle(this._elm.nativeElement,
            `${util.getTransformPropertyName(window)}-origin`, origin),
        saveFocus: () => this._prevFocus = this.document.activeElement,
        restoreFocus: () => this._elm.nativeElement.contains(this.document.activeElement) && this._prevFocus
            && this._prevFocus['focus'] && this._prevFocus['focus'](),
        notifyClose: () => {
            this._open = false;
            this.afterClosed.emit();
            this.document.removeEventListener('click', this._handleBodyClick);
        },
        notifyOpen: () => {
            this._open = true;
            this.afterOpened.emit();
            this.document.addEventListener('click', this._handleBodyClick);
        }
    };
    /** @docs-private */
    private foundation: MDCMenuSurfaceFoundation;

    constructor(private _elm: ElementRef, private rndr: Renderer2, @Inject(DOCUMENT) private document: Document) {
    }

    ngAfterContentInit() {
        this.foundation = new MDCMenuSurfaceFoundation(this.mdcAdapter);
        this.foundation.init();
        this.foundation.setFixedPosition(this._fixed);
        this.foundation.setIsHoisted(this._hoisted);
        this.updateFoundationCorner();
        if (this._open)
            this.foundation.open();
    }
  
    ngOnDestroy() {
        // when we're destroying a closing surface, the event listener may not be removed yet:
        document.removeEventListener('click', this._handleBodyClick);
        this.foundation.destroy();
        this.foundation = null;
    }

    /**
     * When this input is defined and does not have value false, the menu will be opened,
     * otherwise the menu will be closed.
     */
    @Input() @HostBinding('class.mdc-menu-surface--open')
    get open() {
        return this._open;
    }
    
    set open(val: any) {
        let newValue = asBoolean(val);
        if (newValue !== this._open) {
            this._open = newValue;
            if (newValue)
                this.foundation?.open();
            else
                this.foundation?.close();
            this.openChange.emit(newValue);
        }
    }

    /** @docs-private */
    closeWithoutFocusRestore() {
        if (this._open) {
            this._open = false;
            this.foundation?.close(true);
            this.openChange.emit(false);
        }
    }

    /**
     * Set this value if you want to customize the direction from which the menu will be opened.
     * Use `tl` for top-left, `br` for bottom-right, etc.
     * When the left/right position depends on the text directionality, use `ts` for top-start,
     * `te` for top-end, etc. Start will map to left in left-to-right text directionality, and to
     * to right in right-to-left text directionality. End maps the other way around.
     * The default value is 'ts'.
     */
    @Input()
    get openFrom(): 'tl' | 'tr' | 'bl' | 'br' | 'ts' | 'te' | 'bs' | 'be' {
        return this._openFrom;
    }

    set openFrom(val: 'tl' | 'tr' | 'bl' | 'br' | 'ts' | 'te' | 'bs' | 'be') {
        if (val !== this.openFrom) {
            if (['tl', 'tr', 'bl', 'br', 'ts', 'te', 'bs', 'be'].indexOf(val) !== -1)
                this._openFrom = val;
            else
                this._openFrom = 'ts';
            this.updateFoundationCorner();
        }
    }

    private updateFoundationCorner() {
        const corner: Corner = {
            'tl': Corner.TOP_LEFT,
            'tr': Corner.TOP_RIGHT,
            'bl': Corner.BOTTOM_LEFT,
            'br': Corner.BOTTOM_RIGHT,
            'ts': Corner.TOP_START,
            'te': Corner.TOP_END,
            'bs': Corner.BOTTOM_START,
            'be': Corner.BOTTOM_END
        }[this._openFrom];
        this.foundation?.setAnchorCorner(corner);
    }

    /**
     * Set to a value other then false to hoist the menu surface to the body so that the position offsets
     * are calculated relative to the page and not the anchor. (When a `viewport` is set, hoisting is done to
     * the viewport instead of the body).
     */
    @Input()
    get hoisted() {
        return this._hoisted;
    }

    set hoisted(val: any) {
        let newValue = asBoolean(val);
        if (newValue !== this._hoisted) {
            this._hoisted = newValue;
            this.foundation?.setIsHoisted(newValue);
        }
    }

    /**
     * Set to a value other then false use fixed positioning, so that the menu stays in the
     * same place on the window (or viewport) even if the page (or viewport) is
     * scrolled.
     */
    @Input()  @HostBinding('class.mdc-menu-surface--fixed')
    get fixed() {
        return this._fixed;
    }

    set fixed(val: any) {
        let newValue = asBoolean(val);
        if (newValue !== this._fixed) {
            this._fixed = newValue;
            this.foundation?.setFixedPosition(newValue);
        }
    }

    // listened after notifyOpen, listening stopped after notifyClose
    /** @docs-private */
    handleBodyClick(event: MouseEvent) {
        if (this.foundation) {
            this.foundation.handleBodyClick(event);
            if (this._open && this._open !== this.foundation.isOpen()) {// if just closed:
                this._open = false;
                this.openChange.emit(false);
            }
        }
    }

    /** @docs-private */
    @HostListener('keydown', ['$event'])
    handleKeydow(event: KeyboardEvent) {
        if (this.foundation) {
            this.foundation.handleKeydown(event);
            if (this._open && this._open !== this.foundation.isOpen()) {// if just closed:
                this._open = false;
                this.openChange.emit(false);
            }
        }
    }
}

/**
 * Defines an anchor to position an `mdcMenuSurface` to.  If this directive is used as the direct parent of an `mdcMenuSurface`,
 * it will automatically be used as the anchor point. (Unless de `mdcMenuSurface` sets another anchor via its `menuAnchor`property).
 */
@Directive({
    selector: '[mdcMenuAnchor]'
})
export class MdcMenuAnchorDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-menu-surface--anchor') _cls = true;
    @ContentChildren(MdcMenuSurfaceDirective) private surfaces: QueryList<MdcMenuSurfaceDirective>;

    constructor(public _elm: ElementRef) {}

    ngAfterContentInit() {
        this.surfaces.changes.subscribe(_ => {
            this.setSurfaces(this);
        });
        this.setSurfaces(this);
    }

    ngOnDestroy() {
        this.setSurfaces(null);
    }

    private setSurfaces(anchor: MdcMenuAnchorDirective) {
        this.surfaces.toArray().forEach(surface => {
            surface._parentAnchor = anchor;
        });
    }

    /** @docs-private */
    public getBoundingClientRect() {
        return this._elm.nativeElement.getBoundingClientRect();
    }
}

export const MENU_SURFACE_DIRECTIVES = [
    MdcMenuAnchorDirective,
    MdcMenuSurfaceDirective
];
