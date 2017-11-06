import { AfterContentInit, ContentChild, ContentChildren, forwardRef, Directive, ElementRef,
    HostBinding, HostListener, Input, OnDestroy, Optional, Output, Renderer2, Self } from '@angular/core';
import { getCorrectPropertyName } from '@material/animation';
import { MDCTabBarScrollerFoundation } from '@material/tabs';
import { AbstractMdcTabDirective } from './mdc.tab.directive';
import { MdcTabBarScrollerAdapter } from './mdc.tab.bar.scroller.adapter';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { MdcTabBarDirective } from './mdc.tab.bar.directive';

const CLASS_SCROLLER = 'mdc-tab-bar-scroller';
const CLASS_INDICATOR = 'mdc-tab-bar-scroller__indicator';
const CLASS_INDICATOR_INNER = 'mdc-tab-bar-scroller__indicator__inner';
const CLASS_INDICATOR_BACK = 'mdc-tab-bar-scroller__indicator--back';
const CLASS_INDICATOR_FORWARD = 'mdc-tab-bar-scroller__indicator--forward';
const CLASS_SCROLLER_FRAME = 'mdc-tab-bar-scroller__scroll-frame';

@Directive({
    selector: '[mdcTabBarScrollerInner]'
})
export class MdcTabBarScrollerInnerDirective {
    @HostBinding('class.' + CLASS_INDICATOR_INNER) _hostClass = true;
}

@Directive({
    selector: '[mdcTabBarScrollerBack]'
})
export class MdcTabBarScrollerBackDirective {
    @HostBinding('class.' + CLASS_INDICATOR) _hostClass = true;
    @HostBinding('class.' + CLASS_INDICATOR_BACK) _back = true;

    constructor(public _el: ElementRef) {
    }
}

@Directive({
    selector: '[mdcTabBarScrollerForward]'
})
export class MdcTabBarScrollerForwardDirective {
    @HostBinding('class.' + CLASS_INDICATOR) _hostClass = true;
    @HostBinding('class.' + CLASS_INDICATOR_FORWARD) _forward = true;

    constructor(public _el: ElementRef) {
    }
}

@Directive({
    selector: '[mdcTabBarScrollerFrame]'
})
export class MdcTabBarScrollerFrameDirective implements AfterContentInit {
    @HostBinding('class.' + CLASS_SCROLLER_FRAME) _hostClass = true;
    @ContentChild(MdcTabBarDirective) _tabBar: MdcTabBarDirective;

    constructor(public _el: ElementRef) {
    }

    ngAfterContentInit() {
        if (this._tabBar)
            this._tabBar._insideScrollFrame = true;
    }

    _tabAt(index: number) {
        if (this._tabBar) {
            let tabs = this._tabBar._tabs.toArray();
            if (index >= 0 && index < tabs.length)
                return tabs[index];
        }
        return null;
    }
}

@Directive({
    selector: '[mdcTabBarScroller]'
})
export class MdcTabBarScrollerDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.' + CLASS_SCROLLER) _hostClass = true;
    @ContentChild(MdcTabBarScrollerBackDirective) _back: MdcTabBarScrollerBackDirective;
    @ContentChild(MdcTabBarScrollerForwardDirective) _forward: MdcTabBarScrollerForwardDirective;
    @ContentChild(MdcTabBarScrollerFrameDirective) _scrollFrame: MdcTabBarScrollerFrameDirective;
    @Input() direction = 'ltr';
    private _adapter: MdcTabBarScrollerAdapter = {
        addClass: (className: string) => this._rndr.addClass(this._el.nativeElement, className),
        removeClass: (className: string) => this._rndr.removeClass(this._el.nativeElement, className),
        eventTargetHasClass: (target: HTMLElement, className: string) => target.classList.contains(className),
        addClassToForwardIndicator: (className: string) => {
            if (this._forward)
                this._rndr.addClass(this._forward._el.nativeElement, className);
        },
        removeClassFromForwardIndicator: (className: string) => {
            if (this._forward)
                this._rndr.removeClass(this._forward._el.nativeElement, className);
        },
        addClassToBackIndicator: (className: string) => {
            if (this._back)
                this._rndr.addClass(this._back._el.nativeElement, className);            
        },
        removeClassFromBackIndicator: (className: string) => {
            if (this._back)
                this._rndr.removeClass(this._back._el.nativeElement, className);
        },
        isRTL: () => this.direction === 'rtl',
        registerBackIndicatorClickHandler: (handler: EventListener) => {
            if (this._back)
                this.registry.listen(this._rndr, 'click', handler, this._back._el);
        },
        deregisterBackIndicatorClickHandler: (handler: EventListener) => {
            if (this._back)
                this.registry.unlisten('click', handler);
        },
        registerForwardIndicatorClickHandler: (handler: EventListener) => {
            if (this._forward)
                this.registry.listen(this._rndr, 'click', handler, this._forward._el);
        },
        deregisterForwardIndicatorClickHandler: (handler: EventListener) => {
            if (this._forward)
                this.registry.unlisten('click', handler);
        },
        registerCapturedInteractionHandler: (evt: string, handler: EventListener) => {
            this.registry.listen(this._rndr, evt, handler, this._el);
        },
        deregisterCapturedInteractionHandler: (evt: string, handler: EventListener) => {
            this.registry.unlisten(evt, handler);
        },
        registerWindowResizeHandler: (handler: EventListener) => window.addEventListener('resize', handler),
        deregisterWindowResizeHandler: (handler: EventListener) => window.removeEventListener('resize', handler),
        getNumberOfTabs: () => {
            if (this._scrollFrame && this._scrollFrame._tabBar)
                return this._scrollFrame._tabBar._tabs.length;
            return 0;
        },
        getComputedWidthForTabAtIndex: (index: number) => this._tabAt(index)._foundation.getComputedWidth(),
        getComputedLeftForTabAtIndex: (index: number) => this._tabAt(index)._foundation.getComputedLeft(),
        getOffsetWidthForScrollFrame: () => {
            if (this._scrollFrame)
                return this._scrollFrame._el.nativeElement.offsetWidth;
            return 0;
        },
        getScrollLeftForScrollFrame: () => {
            if (this._scrollFrame)
                return this._scrollFrame._el.nativeElement.scrollLeft;
            return 0;
        },
        setScrollLeftForScrollFrame: (scrollLeftAmount: number) => {
            if (this._scrollFrame)
                this._rndr.setProperty(this._scrollFrame._el.nativeElement, 'scrollLeft', scrollLeftAmount);
        },
        getOffsetWidthForTabBar: () => {
            if (this._scrollFrame && this._scrollFrame._tabBar)
                return this._scrollFrame._tabBar._el.nativeElement.offsetWidth;
            return 0;
        },
        setTransformStyleForTabBar: (value: string) => {
            if (this._scrollFrame && this._scrollFrame._tabBar)
                this._rndr.setStyle(this._scrollFrame._tabBar._el.nativeElement, getCorrectPropertyName(window, 'transform'), value);
        },
        getOffsetLeftForEventTarget: (target: HTMLElement) => target.offsetLeft,
        getOffsetWidthForEventTarget: (target: HTMLElement) => target.offsetWidth
    }
    private _foundation = new MDCTabBarScrollerFoundation(this._adapter);

    constructor(private _rndr: Renderer2, private _el: ElementRef, private registry: MdcEventRegistry) {
    }

    ngAfterContentInit() {
        this._foundation.init();
    }

    ngOnDestroy() {
        this._foundation.destroy();
    }

    private _tabAt(index: number) {
        if (this._scrollFrame)
            return this._scrollFrame._tabAt(index);
        return null;
    }
}
