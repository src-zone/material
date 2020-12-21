import { ContentChildren, EventEmitter, QueryList, Directive, ElementRef, HostBinding, Output, Renderer2, HostListener, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MDCTabBarFoundation, MDCTabBarAdapter } from '@material/tab-bar';
import { AbstractMdcTabDirective, MdcTabChange } from './mdc.tab.directive';
import { MdcTabScrollerDirective } from './mdc.tab.scroller.directive';
import { takeUntil } from 'rxjs/operators';

/**
 * Directive for a tab bar. This directive must have an `mdcTabScroller` as only child.
 */
@Directive({
    selector: '[mdcTabBar]'
})
export class MdcTabBarDirective implements AfterContentInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-tab-bar') readonly _cls = true;
    /** @internal */
    @HostBinding('attr.role') _role = 'tablist';
    private onDestroy$: Subject<any> = new Subject();
    private onTabsChange$: Subject<any> = new Subject();
    /** @internal */
    @ContentChildren(MdcTabScrollerDirective) _scrollers?: QueryList<MdcTabScrollerDirective>;
    /**
     * Event emitted when the active tab changes.
     */
    @Output() readonly tabChange: EventEmitter<MdcTabChange> = new EventEmitter();
    private _adapter: MDCTabBarAdapter = {
        scrollTo: (scrollX) => this._scroller!._foundation!.scrollTo(scrollX),
        incrementScroll: (scrollXIncrement) => this._scroller!._foundation!.incrementScroll(scrollXIncrement),
        getScrollPosition: () => this._scroller!._foundation!.getScrollPosition(),
        getScrollContentWidth: () => this._scroller!._getScrollContentWidth(),
        getOffsetWidth: () => (this._el.nativeElement as HTMLElement).offsetWidth,
        isRTL: () => getComputedStyle(this._el.nativeElement).getPropertyValue('direction') === 'rtl',
        setActiveTab: (index) => this._foundation!.activateTab(index),
        activateTabAtIndex: (index, clientRect) => this._tabs!.toArray()[index]._activate(index, clientRect),
        deactivateTabAtIndex: (index) => this._tabs!.toArray()[index]._deactivate(),
        focusTabAtIndex: (index) => this._tabs!.toArray()[index]._focus(),
        getTabIndicatorClientRectAtIndex: (index) => this._tabs!.toArray()[index]._computeIndicatorClientRect()!,
        getTabDimensionsAtIndex: (index) => this._tabs!.toArray()[index]._computeDimensions()!,
        getPreviousActiveTabIndex: () => this._tabs!.toArray().findIndex(e => e.isActive()),
        getFocusedTabIndex: () => this._tabs!.map(t => t._root.nativeElement).indexOf(document.activeElement),
        getIndexOfTabById: () => -1, // we're not using the id's, and nothing should call getIndexOfTabById
        getTabListLength: () => this._tabs!.length,
        notifyTabActivated: (tabIndex) => this.tabChange.emit({tab: this._tabs!.toArray()[tabIndex], tabIndex})
    };
    private _subscriptions: Subscription[] = [];
    private _foundation: MDCTabBarFoundation | null = null;

    constructor(public _el: ElementRef) {}

    ngAfterContentInit() {
        let scrollersObservable$ = this._scrollers!.changes.pipe(takeUntil(this.onDestroy$));
        const tabChangeInit = () => {
            if (this._tabs) {
                this._tabs.changes.pipe(
                    takeUntil(scrollersObservable$), takeUntil(this.onDestroy$)
                ).subscribe(() => {
                    this.onTabsChange$.next();
                });
            }
        }
        scrollersObservable$.subscribe(() => {
            this.onTabsChange$.next();
            tabChangeInit();
        });
        tabChangeInit();

        this.onTabsChange$.pipe(
            takeUntil(this.onDestroy$)
        ).subscribe(() => {
            this.destroyFoundation();
            if (this._tabs)
                this.initFoundation();
        });
        if (this._tabs)
            this.initFoundation();
    }

    ngOnDestroy() {
        this.onTabsChange$.complete();
        this.onDestroy$.next(); this.onDestroy$.complete();
        this.destroyFoundation();
    }

    private initFoundation() {
        this._foundation = new MDCTabBarFoundation(this._adapter);
        this._foundation.init();
        this._listenTabSelected();
    }

    private destroyFoundation() {
        this._unlistenTabSelected();
        let destroy = this._foundation != null;
        if (destroy) {
            this._foundation!.destroy();
        }
        this._foundation = null;
        return destroy;
    }

    private _listenTabSelected() {
        this._unlistenTabSelected();
        this._subscriptions = new Array<Subscription>();
        this._tabs?.forEach(tab => {
            this._subscriptions!.push(tab.activationRequest$.subscribe(activated => {
                if (activated)
                    this._setActive(tab);
            }));
        });
    }

    private _unlistenTabSelected() {
        this._subscriptions.forEach(sub => sub.unsubscribe());
        this._subscriptions = [];
    }

    private _setActive(tab: AbstractMdcTabDirective) {
        if (this._foundation && this._tabs) {
            let index = this._tabs.toArray().indexOf(tab);
            // This is what foundation.handleTabInteraction would do, but more accessible, without
            // the need for assigned tabIds:
            if (index >= 0)
                this._adapter.setActiveTab(index);
        }
    }

    /** @internal */
    @HostListener('keydown', ['$event']) _handleInteraction(event: KeyboardEvent) {
        if (this._foundation)
            this._foundation.handleKeyDown(event);
    }

    private get _scroller() {
        return this._scrollers && this._scrollers.length > 0 ? this._scrollers.first : null;
    }

    private get _tabs() {
        return this._scroller ? this._scroller._tabs : null;
    }
}

export const TAB_BAR_DIRECTIVES = [MdcTabBarDirective];
