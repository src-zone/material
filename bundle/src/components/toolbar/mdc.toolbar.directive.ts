import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef,
  HostBinding, HostListener, Input, OnDestroy, Optional, Output, Provider, QueryList, Renderer2, Self, ViewChild,
  ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCToolbar, MDCToolbarFoundation, util } from '@material/toolbar';
import { cssClasses, strings } from '@material/toolbar/constants';
import { MdcToolbarAdapter } from './mdc.toolbar.adapter';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

@Directive({
    selector: '[mdcToolbarRow]'
})
export class MdcToolbarRowDirective {
    @HostBinding('class.mdc-toolbar__row') _hostClass = true;

    constructor(public _elm: ElementRef) {
    }
}

@Directive({
    selector: '[mdcToolbarSection]'
})
export class MdcToolbarSectionDirective {
    @HostBinding('class.mdc-toolbar__section') _hostClass = true;
    private _alignEnd = false;
    private _alignStart = false;
    private _shrinkToFit = false;

    @Input() @HostBinding('class.mdc-toolbar__section--align-start') get mdcAlignStart() {
        return this._alignStart;
    }

    set mdcAlignStart(val: any) {
        this._alignStart = asBoolean(val);
    }

    @Input() @HostBinding('class.mdc-toolbar__section--align-end') get mdcAlignEnd() {
        return this._alignEnd;
    }

    set mdcAlignEnd(val: any) {
        this._alignEnd = asBoolean(val);
    }

    @Input() @HostBinding('class.mdc-toolbar__section--shrink-to-fit') get mdcShrinkToFit() {
        return this._shrinkToFit;
    }

    set mdcShrinkToFit(val: any) {
        this._shrinkToFit = asBoolean(val);
    }
}

@Directive({
    selector: '[mdcToolbarTitle]'
})
export class MdcToolbarTitleDirective {
    @HostBinding('class.mdc-toolbar__title') _hostClass = true;

    constructor(public _elm: ElementRef) {
    }
}

@Directive({
    selector: '[mdcToolbarIcon]'
})
export class MdcToolbarIcon {
    @HostBinding('class.mdc-toolbar__icon') _hostClass = true;

    constructor(public _elm: ElementRef) {
    }
}

@Directive({
    selector: '[mdcToolbarMenuIcon]'
})
export class MdcToolbarMenuIcon {
    @HostBinding('class.mdc-toolbar__menu-icon') _hostClass = true;

    constructor(public _elm: ElementRef) {
    }
}

@Directive({
    selector: '[mdcToolbarFixedAdjust]',
    exportAs: 'mdcFixedAdjust'
})
export class MdcToolbarFixedAdjustDirective {
    @HostBinding('class.mdc-toolbar-fixed-adjust') _hostClass = true;

    constructor(public _elm: ElementRef) {
    }
}

@Directive({
    selector: '[mdcToolbar]'
})
export class MdcToolbarDirective implements AfterViewInit, OnDestroy {
    @HostBinding('class.mdc-toolbar') _hostClass = true;
    @Input() mdcFixedAdjust: MdcToolbarFixedAdjustDirective;
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

    @Input() @HostBinding('class.mdc-toolbar--fixed') get mdcFixed() {
        return this._fixed;
    }

    set mdcFixed(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._fixed !== newValue)
            throw new Error('mdcFixed directive should not be changed after the mdcToolbar is initialized');
        this._fixed = newValue;
    }

    @Input() @HostBinding('class.mdc-toolbar--waterfall') get mdcWaterfall() {
        return this._waterfall;
    }

    set mdcWaterfall(val: any) {
        this._waterfall = asBoolean(val);
    }

    @Input() @HostBinding('class.mdc-toolbar--fixed-lastrow-only') get mdcFixedLastrowOnly() {
        return this._fixedLastRowOnly;
    }

    set mdcFixedLastrowOnly(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._fixedLastRowOnly !== newValue)
            throw new Error('mdcFixedLastrowOnly directive should not be changed after the mdcToolbar is initialized');
        this._fixedLastRowOnly = newValue;
    }

    @Input() @HostBinding('class.mdc-toolbar--flexible') get mdcFlexible() {
        return this._flexible;
    }

    set mdcFlexible(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._flexible !== newValue)
            throw new Error('mdcFlexible directive should not be changed after the mdcToolbar is initialized');
        this._flexible = newValue;
    }

    @Input() @HostBinding('class.mdc-toolbar--flexible-default-behavior') get mdcFlexibleDefaultBehavior() {
        return this._flexibleDefaultBehavior;
    }

    set mdcFlexibleDefaultBehavior(val: any) {
        let newValue = asBoolean(val);
        if (this._initialized && this._flexibleDefaultBehavior !== newValue)
            throw new Error('mdcFlexibleDefaultBehavior directive should not be changed after the mdcToolbar is initialized');
        this._flexibleDefaultBehavior = newValue;
    }

    @Input() get mdcViewport() {
        return this._mdcViewport;
    }

    set mdcViewport(elm: HTMLElement) {
        if (this._initialized && elm !== this._mdcViewport)
            throw new Error('mdcViewport directive should not be changed after the mdcToolbar is initialized');
        this._mdcViewport = elm;
    }
}
