import { AfterContentInit, ContentChild, ContentChildren, EventEmitter, forwardRef, QueryList, Directive, ElementRef,
    HostBinding, HostListener, Input, OnDestroy, Optional, Output, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MDCTabBarFoundation, MDCTabBarScrollerFoundation } from '@material/tabs';
import { MdcTabBarAdapter } from './mdc.tab.bar.adapter';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { AbstractMdcTabDirective, MdcTabChange } from './mdc.tab.directive';

const CLASS_TAB_BAR = 'mdc-tab-bar';
const CLASS_INDICATOR = 'mdc-tab-bar__indicator';
const CLASS_ICONS_BAR = 'mdc-tab-bar--icon-tab-bar';
const CLASS_ICONS_WITH_TEXT_BAR = 'mdc-tab-bar--icons-with-text';

@Directive({
    selector: '[mdcTabBar]'
})
export class MdcTabBarDirective {
    @HostBinding('class.' + CLASS_TAB_BAR) _hostClass = true;
    @HostBinding('class.mdc-tab-bar-scroller__scroll-frame__tabs') _insideScrollFrame = false;
    @ContentChildren(AbstractMdcTabDirective, {descendants: false}) _tabs: QueryList<AbstractMdcTabDirective>;
    @Output() tabChange: EventEmitter<MdcTabChange> = new EventEmitter();
    private _indicator: HTMLElement;
    private _adapter: MdcTabBarAdapter = {
        addClass: (className: string) => this._rndr.addClass(this._el.nativeElement, className),
        removeClass: (className: string) => this._rndr.removeClass(this._el.nativeElement, className),
        bindOnMDCTabSelectedEvent: () => this._listenTabSelected(),
        unbindOnMDCTabSelectedEvent: () => this._unlistenTabSelected(),
        registerResizeHandler: (handler: EventListener) => window.addEventListener('resize', handler),
        deregisterResizeHandler: (handler: EventListener) => window.removeEventListener('resize', handler),
        getOffsetWidth: () => this._el.nativeElement.offsetWidth,
        setStyleForIndicator: (propertyName: string, value: string) => this._rndr.setStyle(this._indicator, propertyName, value),
        getOffsetWidthForIndicator: () => this._indicator.offsetWidth,
        notifyChange: (evtData: {activeTabIndex: number}) => {
            this.tabChange.emit({tab: null, tabIndex: evtData.activeTabIndex});
        },
        getNumberOfTabs: () => this._tabs.length,
        isTabActiveAtIndex: (index: number) => index >= 0 ? this._tabs.toArray()[index]._active : false,
        setTabActiveAtIndex: (index: number, isActive = true) => this._tabs.toArray()[index]._active = isActive,
        isDefaultPreventedOnClickForTabAtIndex: (index: number) => !!this._tabs.toArray()[index]._foundation.preventsDefaultOnClick,
        setPreventDefaultOnClickForTabAtIndex: (index: number, preventDefaultOnClick: boolean) => this._tabs.toArray()[index]._foundation.setPreventDefaultOnClick(preventDefaultOnClick),
        measureTabAtIndex: (index: number) => this._tabs.toArray()[index]._foundation.measureSelf(),
        getComputedWidthForTabAtIndex: (index: number) => this._tabs.toArray()[index]._foundation.getComputedWidth(),
        getComputedLeftForTabAtIndex: (index: number) => this._tabs.toArray()[index]._foundation.getComputedLeft()
    };
    private _subscriptions: Subscription[];
    private _foundation = new MDCTabBarFoundation(this._adapter);

    constructor(private _rndr: Renderer2, public _el: ElementRef, private registry: MdcEventRegistry) {
    }

    ngAfterContentInit() {
        this._tabs.changes.subscribe(() => {
            if (this._subscriptions)
                // make sure we update the tab change event subscriptions:
                this._listenTabSelected();
        });
        this.addIndicator();
        this._foundation.init();
    }

    ngOnDestroy() {
        this._foundation.destroy();
    }

    private addIndicator() {
        this._indicator = this._rndr.createElement('span');
        this._rndr.addClass(this._indicator, CLASS_INDICATOR);
        this._rndr.appendChild(this._el.nativeElement, this._indicator);
    }

    private _listenTabSelected() {
        if (this._subscriptions)
            this._unlistenTabSelected();
        this._subscriptions = new Array<Subscription>();
        this._tabs.forEach(tab => {
            this._subscriptions.push(tab.activate.subscribe(event => {
                this._setActive(event.tab, true);
            }));
        });
    }

    private _unlistenTabSelected() {
        this._subscriptions.forEach(sub => sub.unsubscribe());
        this._subscriptions = null;
    }

    private _setActive(tab: AbstractMdcTabDirective, notifyChange: boolean) {
        const index = this._tabs.toArray().indexOf(tab);
        this._foundation.switchToTabAtIndex(index, notifyChange);
    }
    
    @HostBinding('class.' + CLASS_ICONS_BAR)
    get _tabBarWithIcon() {
        return this._tabs.length > 0
            && this._tabs.first._mdcTabIcon != null
            && this._tabs.first._mdcTabIconText == null;
    }

    @HostBinding('class.' + CLASS_ICONS_WITH_TEXT_BAR)
    get _tabBarWithIconAndText() {
        return this._tabs.length > 0
            && this._tabs.first._mdcTabIcon != null
            && this._tabs.first._mdcTabIconText != null;
    }
}
