import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef,
  HostBinding, HostListener, Input, OnDestroy, Optional, Output, Provider, QueryList, Renderer2, Self, ViewChild,
  ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCToolbar, MDCToolbarFoundation, util } from '@material/toolbar';
import { cssClasses, strings } from '@material/toolbar/constants';
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
    @Input() @HostBinding('class.mdc-toolbar__section--align-start') get mdcAlignStart() {
        return this._alignStart;
    }

    set mdcAlignStart(val: any) {
        this._alignStart = asBoolean(val);
    }

    /**
     * Make the section align to the end of the toolbar row (default alignment is to the
     * center).
     */
    @Input() @HostBinding('class.mdc-toolbar__section--align-end') get mdcAlignEnd() {
        return this._alignEnd;
    }

    set mdcAlignEnd(val: any) {
        this._alignEnd = asBoolean(val);
    }

    /**
     * Toolbar sections are laid out using flexbox. Each section will take up an equal amount
     * of space within the toolbar by default. To accomodate very long sections (e.g. a  long title),
     * set <code>mdcShrinkToFit</code> to a value other than false on the other sections in the row.
     */
    @Input() @HostBinding('class.mdc-toolbar__section--shrink-to-fit') get mdcShrinkToFit() {
        return this._shrinkToFit;
    }

    set mdcShrinkToFit(val: any) {
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
 * For <code>mdcFixed</code> toolbars, this directive should be put on the page's
 * content wrapper element, and the exported directive should be assigned to the
 * <code>mdcFixedAdjust</code> property of the <code>MdcToolbarDirective</code>.
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
     * content of the page. Required for <code>mdcFixed</code> toolbars,
     * to properly layout the toolbar and the content when users scroll.
     */
    @Input() mdcFixedAdjust: MdcToolbarFixedAdjustDirective;
    /**
     * A number between [0, 1] that represents the <em>ratio of flexible space
     * that has already been collapsed divided by the total amount of flexible space</em>
     * for flexible toolbars.
     */
    @Output() mdcExpansionRatio = new EventEmitter<number>();
    @ContentChild(MdcToolbarTitleDirective) _title;
    @ContentChild(MdcToolbarRowDirective) _firstRow;
    private _mdcViewport: HTMLElement;
    private _mdcViewPortScrollListener;
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
            if (this._mdcViewport)
                this._mdcViewport.addEventListener('scroll', handler, util.applyPassive());
            else
                window.addEventListener('scroll', handler, util.applyPassive());
        },
        deregisterScrollHandler: (handler: EventListener) => {
            if (this._mdcViewport)
                this._mdcViewport.removeEventListener('scroll', handler, util.applyPassive());
            else
                window.removeEventListener('scroll', handler, util.applyPassive());
        },
        registerResizeHandler: (handler: EventListener) => {
            window.addEventListener('resize', handler, util.applyPassive());
        },
        deregisterResizeHandler: (handler: EventListener) => {
            window.removeEventListener('resize', handler, util.applyPassive());
        },
        getViewportWidth: () => this._mdcViewport ? this._mdcViewport.clientWidth : window.innerWidth,
        getViewportScrollY: () => this._mdcViewport ? this._mdcViewport.scrollTop : window.pageYOffset,
        getOffsetHeight: () => this.root.nativeElement.offsetHeight,
        getFirstRowElementOffsetHeight: () => this._firstRow._elm.nativeElement.offsetHeight,
        notifyChange: (evtData: {flexibleExpansionRatio: number}) => {
            this.mdcExpansionRatio.emit(evtData.flexibleExpansionRatio);
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
            if (this.mdcFixedAdjust)
                this.renderer.setStyle(this.mdcFixedAdjust._elm.nativeElement, property, value);
        }
    };
    private foundation: { init: Function, destroy: Function } = new MDCToolbarFoundation(this.mdcAdapter);

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry) {
    }

    ngAfterViewInit() {
        // Using ngAfterViewInit instead of ngAfterContentInit, because the MDCToolbarFoundation.init
        // uses MdcToolbarAdapter.hasClass on classes that we bind in this component. Those classes are only
        // available after the view is fully initialized.
        this._initialized = true;
        if (this._mdcViewport) {
            this._mdcViewPortScrollListener = () => {this._updateViewPort();}
            this._mdcViewport.addEventListener('scroll', this._mdcViewPortScrollListener, util.applyPassive());
        }
        this._updateViewPort();
        this.foundation.init();
    }

    ngOnDestroy() {
        if (this._mdcViewPortScrollListener)
            this._mdcViewport.removeEventListener('scroll', this._mdcViewPortScrollListener, util.applyPassive());
        this.foundation.destroy();
    }

    @HostListener('window:resize', ['$event'])
    _updateViewPort() {
        if (this._initialized && this._mdcViewport) {
            if (this._fixed) {
                // simulate 'fixed' relative to view position of parent:
                this.root.nativeElement.style.position = 'absolute';
                this.root.nativeElement.style.top = this._mdcViewport.scrollTop + 'px';
            } else {
                // reset to position from mdc stylesheets:
                this.root.nativeElement.style.position = null;
                this.root.nativeElement.style.top = null;
            }
        }
    }

    /**
     * If set to a value other than false, the toolbar will be fixed to the top of the
     * screen (or viewport).
     */
    @Input() @HostBinding('class.mdc-toolbar--fixed') get mdcFixed() {
        return this._fixed;
    }

    set mdcFixed(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._fixed !== newValue)
            throw new Error('mdcFixed directive should not be changed after the mdcToolbar is initialized');
        this._fixed = newValue;
    }

    /**
     * If set to a value other than false, and used in combination with <code>mdcFixed</code>
     * the toolbar will become a waterfall toolbar.
     * A waterfall toolbar is initially static and has no elevation, but when content scrolls under it,
     * the toolbar becomes fixed and gains elevation.
     */
    @Input() @HostBinding('class.mdc-toolbar--waterfall') get mdcWaterfall() {
        return this._waterfall;
    }

    set mdcWaterfall(val: any) {
        this._waterfall = asBoolean(val);
    }

    /**
     * If set to a value other than false, fixed toolbars will anchor only the last row to the top.
     */
    @Input() @HostBinding('class.mdc-toolbar--fixed-lastrow-only') get mdcFixedLastrowOnly() {
        return this._fixedLastRowOnly;
    }

    set mdcFixedLastrowOnly(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._fixedLastRowOnly !== newValue)
            throw new Error('mdcFixedLastrowOnly directive should not be changed after the mdcToolbar is initialized');
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
    @Input() @HostBinding('class.mdc-toolbar--flexible') get mdcFlexible() {
        return this._flexible;
    }

    set mdcFlexible(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._flexible !== newValue)
            throw new Error('mdcFlexible directive should not be changed after the mdcToolbar is initialized');
        this._flexible = newValue;
    }

    /**
     * A default behavior for flexible toolbars.
     * For more information see:
     * <a href="https://github.com/material-components/material-components-web/tree/v0.23.0/packages/mdc-toolbar#flexible-toolbar-requires-javascript">
     * Flexible Toolbar documention
     * </a>.
     */
    @Input() @HostBinding('class.mdc-toolbar--flexible-default-behavior') get mdcFlexibleDefaultBehavior() {
        return this._flexibleDefaultBehavior;
    }

    set mdcFlexibleDefaultBehavior(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._flexibleDefaultBehavior !== newValue)
            throw new Error('mdcFlexibleDefaultBehavior directive should not be changed after the mdcToolbar is initialized');
        this._flexibleDefaultBehavior = newValue;
    }

    /**
     * Assign any <code>HTMLElement</code> to this property to place a flexible toolbar fixed to that element
     * (usually the parent container), instead of to the browser window. This property is mainly added for creating nice
     * demos of toolbars embedded inside oher pages (such as on this documentation page). It is not recommended to use
     * this for a real application toolbar. The position is kept fixed to the container element by listening
     * for scroll/resize events, and using javascript to recompute the position. This may influence the smoothness
     * of the scrolling experience, especially on mobile devices.
     * The viewport element should have css styling: <code>position: relative</code>, and should have a fixed
     * height.
     */
    @Input() get mdcViewport() {
        return this._mdcViewport;
    }

    set mdcViewport(elm: HTMLElement) {
        if (this._initialized && elm !== this._mdcViewport)
            throw new Error('mdcViewport directive should not be changed after the mdcToolbar is initialized');
        this._mdcViewport = elm;
    }
}
