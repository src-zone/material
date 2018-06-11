import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef,
  HostBinding, HostListener, Input, NgZone, OnDestroy, Optional, Output, Provider, Renderer2, Self, ViewChild,
  ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCToolbar, MDCToolbarFoundation } from '@material/toolbar';
import { util } from '@material/ripple';
import { MdcToolbarAdapter } from './mdc.toolbar.adapter';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * A directive for a toolbar row. The content of a toolbar should always be embedded
 * in toolbar rows. So this directive should always be used as a direct child of an
 * <code>MdcToolbarDirective</code>. Multiple rows are allowed, which rows are visible
 * depends on the style of the toolbar, and the scroll position of the content of
 * the page.
 */
@Directive({
    selector: '[mdcToolbarRow]'
})
export class MdcToolbarRowDirective {
    @HostBinding('class.mdc-toolbar__row') _hostClass = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * A directive for a toolbar section. A toolbar row should always be composed of toolbar sections.
 * Thus, this directive should always be used as a direct child of an <code>MdcToolbarRowDirective</code>.
 * Multiple sections, with different alignment options, are allowed per row.
 */
@Directive({
    selector: '[mdcToolbarSection]'
})
export class MdcToolbarSectionDirective {
    @HostBinding('class.mdc-toolbar__section') _hostClass = true;
    private _alignEnd = false;
    private _alignStart = false;
    private _shrinkToFit = false;

    /**
     * Make the section align to the start of the toolbar row (default alignment is to the
     * center).
     */
    @Input() @HostBinding('class.mdc-toolbar__section--align-start') get alignStart() {
        return this._alignStart;
    }

    set alignStart(val: any) {
        this._alignStart = asBoolean(val);
    }

    /**
     * Make the section align to the end of the toolbar row (default alignment is to the
     * center).
     */
    @Input() @HostBinding('class.mdc-toolbar__section--align-end') get alignEnd() {
        return this._alignEnd;
    }

    set alignEnd(val: any) {
        this._alignEnd = asBoolean(val);
    }

    /**
     * Toolbar sections are laid out using flexbox. Each section will take up an equal amount
     * of space within the toolbar by default. To accomodate very long sections (e.g. a  long title),
     * set <code>shrinkToFit</code> to a value other than false on the other sections in the row.
     */
    @Input() @HostBinding('class.mdc-toolbar__section--shrink-to-fit') get shrinkToFit() {
        return this._shrinkToFit;
    }

    set shrinkToFit(val: any) {
        this._shrinkToFit = asBoolean(val);
    }
}

/**
 * This directive adds extra styling to toolbar text that represents the title of the toolbar.
 * The directive should be a child of an <code>MdcToolbarSectionDirective</code>.
 */
@Directive({
    selector: '[mdcToolbarTitle]'
})
export class MdcToolbarTitleDirective {
    @HostBinding('class.mdc-toolbar__title') _hostClass = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * This directive is typically used to style icons placed in the toolbar placed
 * on the right hands side. Use <code>MdcToolbarMenuIcon</code> for the 'main'
 * icon, usually placed to the left of the menu.
 * The directive should be a child of an <code>MdcToolbarSectionDirective</code>.
 */
@Directive({
    selector: '[mdcToolbarIcon]'
})
export class MdcToolbarIcon {
    @HostBinding('class.mdc-toolbar__icon') _hostClass = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * This directive is typically used to style the main toolbar icon, usually placed to
 * the left of the toolbar title. For other icons in the toolbar, use
 * <code>MdcToolbarIcon</code> instead.
 */
@Directive({
    selector: '[mdcToolbarMenuIcon]'
})
export class MdcToolbarMenuIcon {
    @HostBinding('class.mdc-toolbar__menu-icon') _hostClass = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * For <code>fixed</code> toolbars, this directive should be put on the page's
 * content wrapper element, and the exported directive should be assigned to the
 * <code>fixedAdjust</code> property of the <code>MdcToolbarDirective</code>.
 * This will make the toolbar aware of the content wrapper, so that the top marging
 * can be adjusted based on the style of the toolbar, and the scroll of the content.
 */
@Directive({
    selector: '[mdcToolbarFixedAdjust]',
    exportAs: 'mdcFixedAdjust'
})
export class MdcToolbarFixedAdjustDirective {
    @HostBinding('class.mdc-toolbar-fixed-adjust') _hostClass = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * A directive for creating toolbars. All content inside a toolbar should be
 * embedded inside <code>MdcToolbarRowDirective</code> elements.
 */
@Directive({
    selector: '[mdcToolbar]'
})
export class MdcToolbarDirective implements AfterViewInit, OnDestroy {
    @HostBinding('class.mdc-toolbar') _hostClass = true;
    /**
     * Assign a <code>MdcToolbarFixedAdjustDirective</code> put on the main
     * content of the page. Required for <code>fixed</code> toolbars,
     * to properly layout the toolbar and the content when users scroll.
     */
    @Input() fixedAdjust: MdcToolbarFixedAdjustDirective;
    /**
     * A number between [0, 1] that represents the <em>ratio of flexible space
     * that has already been collapsed divided by the total amount of flexible space</em>
     * for flexible toolbars.
     */
    @Output() expansionRatio = new EventEmitter<number>();
    @ContentChild(MdcToolbarTitleDirective) _title;
    @ContentChild(MdcToolbarRowDirective) _firstRow;
    private _viewport: HTMLElement;
    private _initialized = false;
    private _fixed = false;
    private _waterfall = false;
    private _fixedLastRowOnly = false;
    private _flexible = false;
    private _flexibleDefaultBehavior = false;

    private mdcAdapter: MdcToolbarAdapter = {
        hasClass: (className: string) => {
            return this.root.nativeElement.classList.contains(className);
        },
        addClass: (className: string) => {
            this.renderer.addClass(this.root.nativeElement, className);
        },
        removeClass: (className: string) => {
            this.renderer.removeClass(this.root.nativeElement, className);
        },            
        registerScrollHandler: (handler: EventListener) => {
            if (this._viewport)
                this._viewport.addEventListener('scroll', handler);
            else
                window.addEventListener('scroll', handler);
        },
        deregisterScrollHandler: (handler: EventListener) => {
            if (this._viewport)
                this._viewport.removeEventListener('scroll', handler);
            else
                window.removeEventListener('scroll', handler);
        },
        registerResizeHandler: (handler: EventListener) => {
            window.addEventListener('resize', handler);
        },
        deregisterResizeHandler: (handler: EventListener) => {
            window.removeEventListener('resize', handler);
        },
        getViewportWidth: () => this._viewport ? this._viewport.clientWidth : window.innerWidth,
        getViewportScrollY: () => this._viewport ? this._viewport.scrollTop : window.pageYOffset,
        getOffsetHeight: () => this.root.nativeElement.offsetHeight,
        getFirstRowElementOffsetHeight: () => this._firstRow._elm.nativeElement.offsetHeight,
        notifyChange: (evtData: {flexibleExpansionRatio: number}) => {
            this.expansionRatio.emit(evtData.flexibleExpansionRatio);
        },
        setStyle: (property: string, value: number) => {
            this.renderer.setStyle(this.root.nativeElement, property, value);
        },
        setStyleForTitleElement: (property: string, value: number) => {
            if (this._title)
                this.renderer.setStyle(this._title._elm.nativeElement, property, value);
        },
        setStyleForFlexibleRowElement: (property: string, value: number) => {
            this.renderer.setStyle(this._firstRow._elm.nativeElement, property, value);
        },
        setStyleForFixedAdjustElement: (property: string, value: number) => {
            if (this.fixedAdjust)
                this.renderer.setStyle(this.fixedAdjust._elm.nativeElement, property, value);
        }
    };
    private foundation: { init: Function, destroy: Function } = new MDCToolbarFoundation(this.mdcAdapter);

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry,
        private zone: NgZone) {
    }

    ngAfterViewInit() {
        // Using ngAfterViewInit instead of ngAfterContentInit, because the MDCToolbarFoundation.init
        // uses MdcToolbarAdapter.hasClass on classes that we bind in this component. Those classes are only
        // available after the view is fully initialized.
        // TODO: in other components we just check the property value instead of the class (property based on
        //   the classname given to the adapter), so that ngAfterContentInit can be used after all. That
        //   seems a nicer strategy.
        this._initialized = true;
        this.initFixedScroll();
        this.foundation.init();
    }

    ngOnDestroy() {
        this.destroyFixedScroll();
        this.foundation.destroy();
    }

    initFixedScroll() {
        if (this._viewport && this._fixed) {
            this.zone.runOutsideAngular(() => {
                // simulate 'fixed' relative to view position of parent by setting position to
                // absolute (MDC sets it to fixed), and updating the vertical position on scroll:
                this.root.nativeElement.style.position = 'absolute';
                this._viewport.addEventListener('scroll', this._updateViewPort, util.applyPassive());
                this._viewport.addEventListener('touchmove', this._updateViewPort, util.applyPassive());
                window.addEventListener('resize', this._updateViewPort, util.applyPassive());
            });
            this._updateViewPort();
        }
    }

    destroyFixedScroll() {
        if (this._viewport && this._fixed) {
            this._viewport.removeEventListener('scroll', this._updateViewPort);
            this._viewport.removeEventListener('touchmove', this._updateViewPort);
            window.removeEventListener('resize', this._updateViewPort);
        }
    }

    _updateViewPort = () => {
        // simulate 'fixed' relative to view position of parent:
        this.root.nativeElement.style.top = this._viewport.scrollTop + 'px';
    }

    /**
     * If set to a value other than false, the toolbar will be fixed to the top of the
     * screen (or viewport).
     */
    @Input() @HostBinding('class.mdc-toolbar--fixed') get fixed() {
        return this._fixed;
    }

    set fixed(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._fixed !== newValue)
            throw new Error('fixed property should not be changed after the mdcToolbar is initialized');
        this._fixed = newValue;
    }

    /**
     * If set to a value other than false, and used in combination with <code>fixed</code>
     * the toolbar will become a waterfall toolbar.
     * A waterfall toolbar is initially static and has no elevation, but when content scrolls under it,
     * the toolbar becomes fixed and gains elevation.
     */
    @Input() @HostBinding('class.mdc-toolbar--waterfall') get waterfall() {
        return this._waterfall;
    }

    set waterfall(val: any) {
        this._waterfall = asBoolean(val);
    }

    /**
     * If set to a value other than false, fixed toolbars will anchor only the last row to the top.
     */
    @Input() @HostBinding('class.mdc-toolbar--fixed-lastrow-only') get fixedLastrowOnly() {
        return this._fixedLastRowOnly;
    }

    set fixedLastrowOnly(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._fixedLastRowOnly !== newValue)
            throw new Error('fixedLastrowOnly property should not be changed after the mdcToolbar is initialized');
        this._fixedLastRowOnly = newValue;
    }

    /**
     * A flexible toolbar changes height when the user scrolls. Flexible behavior is highly customizable,
     * quoted from the upstream <code>mdc-toolbar</code> documentation:
     * <blockquote>
     * We only define the change of flexible space size without making further assumptions.
     * But we do recommend the height of flexible space should be an integral number of
     * toolbar row height and provide a easier way for user to customize height.
     * Users can adjust the height of flexible space through sass variable
     * <code>$mdc-toolbar-ratio-to-extend-flexible</code> or css variable
     * <code>--mdc-toolbar-ratio-to-extend-flexible</code>.
     * </blockquote>
     */
    @Input() @HostBinding('class.mdc-toolbar--flexible') get flexible() {
        return this._flexible;
    }

    set flexible(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._flexible !== newValue)
            throw new Error('flexible property should not be changed after the mdcToolbar is initialized');
        this._flexible = newValue;
    }

    /**
     * A default behavior for flexible toolbars.
     * For more information see:
     * <a href="https://github.com/material-components/material-components-web/tree/v0.23.0/packages/mdc-toolbar#flexible-toolbar-requires-javascript" target="_blank">
     * Flexible Toolbar documention
     * </a>.
     */
    @Input() @HostBinding('class.mdc-toolbar--flexible-default-behavior') get flexibleDefaultBehavior() {
        return this._flexibleDefaultBehavior;
    }

    set flexibleDefaultBehavior(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._flexibleDefaultBehavior !== newValue)
            throw new Error('flexibleDefaultBehavior property should not be changed after the mdcToolbar is initialized');
        this._flexibleDefaultBehavior = newValue;
    }

    /**
     * Assign any <code>HTMLElement</code> to this property to place a flexible toolbar fixed to that element
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

    set viewport(elm: HTMLElement) {
        if (this._initialized && elm !== this._viewport)
            throw new Error('viewport directive should not be changed after the mdcToolbar is initialized');
        this._viewport = elm;
    }
}
