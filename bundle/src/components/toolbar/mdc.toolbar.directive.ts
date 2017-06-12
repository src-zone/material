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
    @HostBinding('class.mdc-toolbar__row') hasHostClass = true;

    constructor(public elementRef: ElementRef) {
    }
}

@Directive({
    selector: '[mdcToolbarSection]'
})
export class MdcToolbarSectionDirective {
    @HostBinding('class.mdc-toolbar__section') hasHostClass = true;
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
    @HostBinding('class.mdc-toolbar__title') hasHostClass = true;

    constructor(public elementRef: ElementRef) {
    }
}

@Directive({
    selector: '[mdcToolbarFixedAdjust]',
    exportAs: 'mdcFixedAdjust'
})
export class MdcToolbarFixedAdjustDirective {
    @HostBinding('class.mdc-toolbar-fixed-adjust') hasHostClass = true;

    constructor(public elementRef: ElementRef) {
    }
}

@Directive({
    selector: '[mdcToolbar]'
})
export class MdcToolbarDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-toolbar') hasHostClass = true;
    @Input() mdcFixedAdjust: MdcToolbarFixedAdjustDirective;
    @Output() expansionRatio = new EventEmitter<number>();
    @ContentChild(MdcToolbarTitleDirective) mdcTitle;
    @ContentChild(MdcToolbarRowDirective) mdcFirstRow;
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
            window.addEventListener('scroll', handler, util.applyPassive());
        },
        deregisterScrollHandler: (handler: EventListener) => {
            window.removeEventListener('scroll', handler, util.applyPassive());
        },
        registerResizeHandler: (handler: EventListener) => {
            window.addEventListener('resize', handler, util.applyPassive());
        },
        deregisterResizeHandler: (handler: EventListener) => {
            window.removeEventListener('resize', handler, util.applyPassive());
        },
        getViewportWidth: () => window.innerWidth,
        getViewportScrollY: () => window.pageYOffset,
        getOffsetHeight: () => this.root.nativeElement.offsetHeight,
        getFlexibleRowElementOffsetHeight: () => this.mdcFirstRow.elementRef.nativeElement.offsetHeight,
        notifyChange: (evtData: {flexibleExpansionRatio: number}) => {
            this.expansionRatio.emit(evtData.flexibleExpansionRatio);
        },
        setStyle: (property: string, value: number) => {
            this.renderer.setStyle(this.root.nativeElement, property, value);
        },
        setStyleForTitleElement: (property: string, value: number) => {
            if (this.mdcTitle)
                this.renderer.setStyle(this.mdcTitle.elementRef.nativeElement, property, value);
        },
        setStyleForFlexibleRowElement: (property: string, value: number) => {
            this.renderer.setStyle(this.mdcFirstRow.elementRef.nativeElement, property, value);
        },
        setStyleForFixedAdjustElement: (property: string, value: number) => {
            if (this.mdcFixedAdjust)
                this.renderer.setStyle(this.mdcFixedAdjust.elementRef.nativeElement, property, value);
        }
    };
    private foundation: { init: Function, destroy: Function } = new MDCToolbarFoundation(this.mdcAdapter);

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry) {
    }

    ngAfterContentInit() {
        this.foundation.init();
    }

    ngOnDestroy() {
        this.foundation.destroy();
    }

    @Input() @HostBinding('class.mdc-toolbar--fixed') get mdcFixed() {
        return this._fixed;
    }

    set mdcFixed(val: any) {
        this._fixed = asBoolean(val);
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
        this._fixedLastRowOnly = asBoolean(val);
    }

    @Input() @HostBinding('class.mdc-toolbar--flexible') get mdcFlexible() {
        return this._flexible;
    }

    set mdcFlexible(val: any) {
        this._flexible = asBoolean(val);
    }

    @Input() @HostBinding('class.mdc-toolbar--flexible') get mdcFlexibleDefaultBehavior() {
        return this._flexibleDefaultBehavior;
    }

    set mdcFlexibleDefaultBehavior(val: any) {
        this._flexibleDefaultBehavior = asBoolean(val);
    }
}
