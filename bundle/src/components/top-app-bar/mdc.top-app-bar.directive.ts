import { AfterContentInit, ContentChildren, Directive, ElementRef, HostBinding, Inject, Input,
    NgZone, OnDestroy, QueryList, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MDCTopAppBarAdapter, MDCTopAppBarBaseFoundation,
    MDCTopAppBarFoundation, MDCFixedTopAppBarFoundation, MDCShortTopAppBarFoundation } from '@material/top-app-bar';
import { events } from '@material/dom';
import { asBoolean, asBooleanOrNull } from '../../utils/value.utils';

/**
 * A directive for a top-app-bar row. The content of a top-app-bar should always be embedded
 * in <code>mdcTopAppBarRow</code> rows. Multiple rows are allowed, which rows are visible
 * depends on the style of the toolbar, and the scroll position of the content of
 * the page.
 */
@Directive({
    selector: '[mdcTopAppBarRow]'
})
export class MdcTopAppBarRowDirective {
    /** @internal */
    @HostBinding('class.mdc-top-app-bar__row') readonly _cls = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * A directive for a top-app-bar section. A top-app-bar row should always be composed of
 * <code>mdcTopAppBarSection</code> sections. Multiple sections, with different alignment options,
 * are allowed per row.
 */
@Directive({
    selector: '[mdcTopAppBarSection]'
})
export class MdcTopAppBarSectionDirective {
    /** @internal */
    @HostBinding('class.mdc-top-app-bar__section') readonly _cls = true;
    private _alignEnd = false;
    private _alignStart = false;

    /**
     * Make the section align to the start of the toolbar row (default alignment is to the
     * center).
     */
    @Input() @HostBinding('class.mdc-top-app-bar__section--align-start') get alignStart() {
        return this._alignStart;
    }

    set alignStart(val: boolean) {
        this._alignStart = asBoolean(val);
    }

    static ngAcceptInputType_alignStart: boolean | '';

    /**
     * Make the section align to the end of the toolbar row (default alignment is to the
     * center).
     */
    @Input() @HostBinding('class.mdc-top-app-bar__section--align-end') get alignEnd() {
        return this._alignEnd;
    }

    set alignEnd(val: boolean) {
        this._alignEnd = asBoolean(val);
    }

    static ngAcceptInputType_alignEnd: boolean | '';
}

/**
 * This directive adds extra styling to toolbar text that represents the title of the toolbar.
 * The directive should be a child of an element with the <code>mdcTopAppBarSection</code> directive.
 */
@Directive({
    selector: '[mdcTopAppBarTitle]'
})
export class MdcTopAppBarTitleDirective {
    /** @internal */
    @HostBinding('class.mdc-top-app-bar__title') readonly _cls = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * Directive for the navigation icon of a top-app-bar. Typically placed on the
 * far left (for left-to-right languages). The <code>mdcTopAppBarNavIcon</code>
 * directive should be used on a child of an element with the
 * <code>mdcTopAppBarSection</code> directive. It typically opens a navigation menu
 * or drawer.
 */
@Directive({
    selector: '[mdcTopAppBarNavIcon]'
})
export class MdcTopAppBarNavIconDirective {
    /** @internal */
    @HostBinding('class.mdc-top-app-bar__navigation-icon') readonly _cls = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * Directive for action items of a top-app-bar. Typically placed on the side
 * opposite the navigation item. The <code>mdcTopAppBarAction</code> directive
 * should be used on a child of an element with the <code>mdcTopAppBarSection</code>
 * directive.
 */
@Directive({
    selector: '[mdcTopAppBarAction]'
})
export class MdcTopAppBarActionDirective {
    /** @internal */
    @HostBinding('class.mdc-top-app-bar__action-item') readonly _cls = true;
    /**
     * A label for the action item. The value will be applied to both the
     * <code>aria-label</code>, and <code>alt</code> attribute of the item.
     */
    @Input() @HostBinding('attr.aria-label') @HostBinding('attr.alt') label: string | null = null;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * A directive for a top-app-bar. All content inside a top-app-bar should be
 * embedded inside <code>mdcTopAppBarRow</code> rows.
 */
@Directive({
    selector: '[mdcTopAppBar]'
})
export class MdcTopAppBarDirective implements AfterContentInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-top-app-bar') readonly _cls = true;
    private document: Document;
    /** @internal */
    @ContentChildren(MdcTopAppBarActionDirective, {descendants: true}) _actionItems?: QueryList<MdcTopAppBarActionDirective>;
    private handleScroll = () => {
        if (this.viewport && (this._type === 'short' || this._type === 'fixed'))
            this._updateViewPort();
        this.foundation?.handleTargetScroll();
    }
    private handleResize = () => {
        if (this.viewport && (this._type === 'short' || this._type === 'fixed'))
            this._updateViewPort();
        this.foundation?.handleWindowResize();
    }
    private updateViewport = () => {
        if (this.viewport && (this._type === 'short' || this._type === 'fixed'))
            this._updateViewPort();
    }
    private _viewport: HTMLElement | null = null;
    private _fixedAdjust: HTMLElement | null = null;
    private _type: 'short' | 'fixed' | 'default' = 'default';
    private _prominent = false;
    private _dense = false;
    private _collapsedOverride: boolean | null = null;
    private _collapsedState: boolean | null = null;

    private mdcAdapter: MDCTopAppBarAdapter = {
        hasClass: (className: string) => {
            if (className === 'mdc-top-app-bar--short-collapsed')
                // the foundation uses this during initialisation to determine whether
                // a short top-app-bar should always be displayed collapsed.
                // our component instead uses the _collapsed field value to override
                // the collapsed state
                return false; 
            return this._elm.nativeElement.classList.contains(className);
        },
        addClass: (className: string) => {
            if (className === 'mdc-top-app-bar--short-collapsed')
                this._collapsedState = true;
            else if (className !== 'mdc-top-app-bar--short-has-action-item')
                // we add/remove mdc-top-app-bar--short-has-action-item dynamically based on the actual number of items
                // this is better than the foundation that looks only at the nr of items during initialisation
                this._rndr.addClass(this._elm.nativeElement, className);
        },
        removeClass: (className: string) => {
            if (className === 'mdc-top-app-bar--short-collapsed')
                this._collapsedState = false;
            else
                this._rndr.removeClass(this._elm.nativeElement, className);
        },
        setStyle: (property, value) => this._rndr.setStyle(this._elm.nativeElement, property, value),
        getTopAppBarHeight: () => this._elm.nativeElement.clientHeight,
        notifyNavigationIconClicked: () => {}, // not a special event in our implementation
        getViewportScrollY: () => this._viewport ? this._viewport.scrollTop : this.document.defaultView!.pageYOffset,
        getTotalActionItems: () => this._actionItems!.length
    };
    private foundation: MDCTopAppBarBaseFoundation | null = null;
    
    constructor(private _rndr: Renderer2, private _elm: ElementRef, private zone: NgZone, @Inject(DOCUMENT) doc: any) {
        this.document = doc as Document;
    }

    ngAfterContentInit() {
        this.foundationReInit();
    }

    ngOnDestroy() {
        this.removeScrollListeners();
        this.foundation?.destroy();
        this.foundation = null;
    }

    private foundationReInit() {
        if (this.foundation)
            this.foundation.destroy();

        // undo viewport init specific for a foundation implementation:
        this.removeScrollListeners();
        this._elm.nativeElement.style.top = null;

        // remove classes set by foundations, if we reinitialize/switch foundation:
        this._rndr.removeClass(this._elm.nativeElement, 'mdc-top-app-bar--fixed-scrolled');

        if (this._type === 'short')
            this.foundation = new MDCShortTopAppBarFoundation(this.mdcAdapter);
        else if (this._type === 'fixed')
            this.foundation = new MDCFixedTopAppBarFoundation(this.mdcAdapter);
        else
            this.foundation = new MDCTopAppBarFoundation(this.mdcAdapter);
        this.initFixedAdjust();

        this.zone.runOutsideAngular(() => {
            (this._viewport || this.document.defaultView!).addEventListener('scroll', this.handleScroll, events.applyPassive());
            (this._viewport || this.document.defaultView!).addEventListener('touchmove', this.updateViewport, events.applyPassive());
            this.document.defaultView!.addEventListener('resize', this.handleResize, events.applyPassive());
        });
        if (this.viewport && (this._type === 'short' || this._type === 'fixed'))
            this._updateViewPort();
        this.foundation.init();
    }

    private initFixedAdjust() {
        if (this.foundation && this._fixedAdjust) {
            this._rndr.removeClass(this._fixedAdjust, 'mdc-top-app-bar--fixed-adjust');
            this._rndr.removeClass(this._fixedAdjust, 'mdc-top-app-bar--dense-fixed-adjust');
            this._rndr.removeClass(this._fixedAdjust, 'mdc-top-app-bar--short-fixed-adjust');
            this._rndr.removeClass(this._fixedAdjust, 'mdc-top-app-bar--prominent-fixed-adjust');
            this._rndr.removeClass(this._fixedAdjust, 'mdc-top-app-bar--dense-prominent-fixed-adjust');

            if (this.prominent && this.dense)
                this._rndr.addClass(this._fixedAdjust, 'mdc-top-app-bar--dense-prominent-fixed-adjust');
            else if (this._prominent)
                this._rndr.addClass(this._fixedAdjust, 'mdc-top-app-bar--prominent-fixed-adjust');
            else if (this._type === 'short')
                this._rndr.addClass(this._fixedAdjust, 'mdc-top-app-bar--short-fixed-adjust');
            else if (this._dense)
                this._rndr.addClass(this._fixedAdjust, 'mdc-top-app-bar--dense-fixed-adjust');
            else
                this._rndr.addClass(this._fixedAdjust, 'mdc-top-app-bar--fixed-adjust');
        }
    }

    private removeScrollListeners() {
        (this._viewport || this.document.defaultView!).removeEventListener('scroll', this.handleScroll, events.applyPassive());
        (this._viewport || this.document.defaultView!).removeEventListener('touchmove', this.updateViewport, events.applyPassive());
        this.document.defaultView!.removeEventListener('resize', this.handleResize, events.applyPassive());
    }

    /**
     * The top-app-bar can have different styles. Set this property to <code>fixed</code>
     * for a top-app-bar fixed to the top of the screen or viewport.
     * Set to <code>short</code> for a top-app-bar that will collapse to the navigation
     * icon side when scrolled.
     * Otherwise, the default is a top-app-bar that scrolls with the content.
     */
    @Input() get mdcTopAppBar() {
        return this._type;
    }

    set mdcTopAppBar(val) {
        if (val !== 'short' && val !== 'fixed')
            val = 'default';
        if (val !== this._type) {
            this._type = val;
            if (this.foundation)
                this.foundationReInit();
        }
    }

    static ngAcceptInputType_mdcTopAppBar: 'short' | 'fixed' | 'default' | '';

    /**
     * If set to a value other than false, the top-app-bar will be styled as a taller
     * bar.
     */
    @Input() @HostBinding('class.mdc-top-app-bar--prominent') get prominent() {
        return this._prominent;
    }

    set prominent(val: boolean) {
        let newValue = asBoolean(val);
        if (newValue !== this._prominent) {
            this._prominent = asBoolean(val);
            this.initFixedAdjust();
        }
    }

    static ngAcceptInputType_prominent: boolean | '';

    /**
     * If set to a value other than false, the top-app-bar will be styled a bit more
     * compact.
     */
    @Input() @HostBinding('class.mdc-top-app-bar--dense') get dense() {
        return this._dense;
    }

    set dense(val: boolean) {
        let newValue = asBoolean(val);
        if (newValue !== this._dense) {
            this._dense = asBoolean(val);
            this.initFixedAdjust();
        }
    }

    static ngAcceptInputType_dense: boolean | '';
    
    /**
     * Set this property to true or false to force the collapsed/uncollapsed state of a short
     * top-app-bar. Set this property to null to return to the default handling, where
     * <code>collapsed</code> is based on the scroll position of the viewport.
     * This property has no effect if the <code>mdcTopAppBar</code> has a value other than
     * <code>short</code>.
     */
    @Input() @HostBinding('class.mdc-top-app-bar--short-collapsed') get collapsed() {
        if (this._type !== 'short')
            return false;
        return this._collapsedOverride == null ? !!this._collapsedState : this._collapsedOverride;
    }

    set collapsed(val: boolean) {
        this._collapsedOverride = asBooleanOrNull(val);
    }

    static ngAcceptInputType_collapsed: boolean | '';

    /**
     * Top-app-bars are positioned over the rest of their viewport. This means that
     * some of the content will be hidden under the bar, unless the position of that
     * content is changed relative to the bar. Assign the <code>HTMLElement</code>
     * of the content to this property, so that the <code>mdcTopAppBar</code>
     * can add spacing to the content making the top visible when the content is scrolled
     * up.
     */
    @Input() get fixedAdjust() {
        return this._fixedAdjust;
    }

    set fixedAdjust(el: HTMLElement | null) {
        if (this._fixedAdjust !== el) {
            this._fixedAdjust = el;
            this.initFixedAdjust();
        }
    }

    /**
     * Assign any <code>HTMLElement</code> to this property to place a top-app-bar fixed to that element
     * (usually the parent container), instead of to the browser window. This property is mainly added for creating nice
     * demos of toolbars embedded inside other pages (such as on this documentation page). It is not recommended to use
     * this for a real application toolbar. The position is kept fixed to the container element by listening
     * for scroll/resize events, and using javascript to recompute the position. This may influence the smoothness
     * of the scrolling experience, especially on mobile devices.
     * The viewport element must have css styling: <code>position: relative</code>, and should have a fixed
     * height.
     */
    @Input() get viewport() {
        return this._viewport;
    }

    set viewport(elm: HTMLElement | null) {
        if (this._viewport !== elm) {
            this.removeScrollListeners();
            this._viewport = elm;
            if (this.foundation)
                this.foundationReInit();
        }
    }

    /** @internal */
    @HostBinding('class.mdc-top-app-bar--short-has-action-item') get _hasActionItems() {
        return this._type === 'short' && this._actionItems!.length > 0;
    }

    /** @internal */
    _updateViewPort = () => {
        // simulate 'fixed' relative to view position of parent:
        this._elm.nativeElement.style.top = this._viewport!.scrollTop + 'px';
    }

    /** @internal */
    @HostBinding('class.mdc-top-app-bar--fixed') get _fixed() {
        return this._type === 'fixed';
    }

    /** @internal */
    @HostBinding('class.mdc-top-app-bar--short') get _short() {
        return this._type === 'short';
    }

    /** @internal */
    @HostBinding('style.position') get _position() {
        return this._viewport ? 'absolute' : null;
    }
}

export const TOP_APP_BAR_DIRECTIVES = [
    MdcTopAppBarRowDirective, MdcTopAppBarSectionDirective, MdcTopAppBarTitleDirective, MdcTopAppBarNavIconDirective,
    MdcTopAppBarActionDirective, MdcTopAppBarDirective
];
