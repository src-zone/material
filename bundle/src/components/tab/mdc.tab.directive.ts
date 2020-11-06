import { AfterContentInit, ContentChildren, EventEmitter, forwardRef, Directive, ElementRef,
    HostBinding, Input, OnDestroy, Output, Renderer2, QueryList, HostListener } from '@angular/core';
import { MDCTabFoundation, MDCTabAdapter } from '@material/tab';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { MdcTabIndicatorDirective } from './mdc.tab.indicator.directive';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

/**
 * The interface for events send by the <code>activate</code> output of an
 * `mdcTab` directive, or by the <code>tabChange</code> output of an <code>mdcTabBar</code>.
 */
export interface MdcTabChange {
    /**
     * A reference to the tab that sends the event.
     */
    tab: AbstractMdcTabDirective,
    /**
     * The index of the tab that sends the event.
     */
    tabIndex: number
}

/**
 * Directive for an optional icon when having a tab bar with icons.
 * This directive must be used as a child of an `mdcTabContent`, and as a sibbling
 * to a following `mdcTabLabel`.
 */
@Directive({
    selector: '[mdcTabIcon]'
})
export class MdcTabIconDirective {
    @HostBinding('class.mdc-tab__icon') _hostClass = true;
    @HostBinding('attr.aria-hidden') _ariaHidden = true;
}

/**
 * Directive for the text label of a tabs.
 * This directive must be used as a child of an `mdcTabContent`.
 * It can be preceded by an optional `mdcTabIcon`.
 */
@Directive({
    selector: '[mdcTabLabel]'
})
export class MdcTabLabelDirective {
    @HostBinding('class.mdc-tab__text-label') _hostClass = true;
}

/**
 * Directive for the content (label and optional icon of the tab).
 * This directive must be used as a child of an `mdcTab`, and
 * can contain an (optional) `mdcTabIcon` and a `mdcTabLabel`.
 */
@Directive({
    selector: '[mdcTabContent]'
})
export class MdcTabContentDirective {
    @HostBinding('class.mdc-tab__content') _hostClass = true;

    constructor(public _root: ElementRef) {}
}

export abstract class AbstractMdcTabDirective extends AbstractMdcRipple implements OnDestroy, AfterContentInit {
    @HostBinding('class.mdc-tab') _hostClass = true;
    private onDestroy$: Subject<any> = new Subject();
    protected _active: ClientRect | boolean = false;
    @HostBinding('attr.role') _role = 'tab';
    @ContentChildren(MdcTabContentDirective) _contents: QueryList<MdcTabContentDirective>;
    @ContentChildren(MdcTabIndicatorDirective, {descendants: true}) _indicators: QueryList<MdcTabIndicatorDirective>;
    /**
     * Event called when the tab is activated.
     */
    @Output() activate: EventEmitter<MdcTabChange> = new EventEmitter();
    @Output() interact: EventEmitter<MdcTabChange> = new EventEmitter();
    protected _adapter: MDCTabAdapter = {
        addClass: (className) => this._rndr.addClass(this._root.nativeElement, className),
        removeClass: (className) => this._rndr.removeClass(this._root.nativeElement, className),
        hasClass: (className) => this._root.nativeElement.classList.contains(className),
        setAttr: (attr, value) => this._rndr.setAttribute(this._root.nativeElement, attr, value),
        activateIndicator: (previousIndicatorClientRect) => this._indicator?.activate(previousIndicatorClientRect),
        deactivateIndicator: () => this._indicator?.deactivate(),
        notifyInteracted: () => this.interact.emit({tab: this, tabIndex: null}),
        getOffsetLeft: () => this._root.nativeElement.offsetLeft,
        getOffsetWidth: () => this._root.nativeElement.offsetWidth,
        getContentOffsetLeft: () => this._content._root.nativeElement.offsetLeft,
        getContentOffsetWidth: () => this._content._root.nativeElement.offsetWidth,
        focus: () => this._root.nativeElement.focus()
    };
    _foundation: MDCTabFoundation;

    constructor(protected _rndr: Renderer2, public _root: ElementRef, protected _registry: MdcEventRegistry) {
        super(_root, _rndr, _registry);
    }

    ngAfterContentInit() {
        this.addRippleSurface('mdc-tab__ripple');
        this.initRipple();

        let initializer = () => {
            this.destroyFoundation();
            if (this._content && this._indicator)
                this.initFoundation();
        };
        initializer();
        this._contents.changes.pipe(takeUntil(this.onDestroy$)).subscribe(initializer);
        this._indicators.changes.pipe(takeUntil(this.onDestroy$)).subscribe(initializer);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.destroyRipple();
        this.destroyFoundation();
    }

    private destroyFoundation() {
        let destroy = this._foundation != null;
        if (destroy)
            this._foundation.destroy();
        this._foundation = null;
        return destroy;
    }

    private initFoundation() {
        this._foundation = new MDCTabFoundation(this._adapter);
        this._foundation.init();
        if (this._active) {
            let clientRect = typeof this._active === 'boolean' ? null : this._active;
            this._foundation.activate(clientRect);
        }
    }

    _activate(previousIndicatorClientRect?: ClientRect) {
        this._active = previousIndicatorClientRect || true;
        if (this._foundation)
            this._foundation.activate(previousIndicatorClientRect);
    }

    _deactivate() {
        this._active = false;
        if (this._foundation)
            this._foundation.deactivate();
    }

    _focus() {
        this._adapter.focus();
    }

    _computeIndicatorClientRect() {
        return this._indicator?._computeContentClientRect();
    }
    
    _computeDimensions() {
        return this._foundation?.computeDimensions();
    }

    /**
     * Input for activating the tab. Assign a truthy value to activate the tab. A falsy value
     * will have no effect: to deactivate the tab, you must activate another tab.
     */
    @Input() get active() {
        return !!this._active;
    }

    set active(value: boolean) {
        // Note: this should not set the _active property. It just notifies the tab-bar
        // that it wants to be activated. The tab-bar will deactivate the previous tab, and activate
        // this one.
        let activate = asBoolean(value);
        if (activate)
            this.interact.emit({tab: this, tabIndex: null});
    }

    @HostListener('click') _onClick() {
        if (this._foundation)
            this._foundation.handleClick();
    }

    private get _indicator() {
        return this._indicators && this._indicators.length > 0 ? this._indicators.first : null;
    }

    private get _content() {
        return this._contents && this._contents.length > 0 ? this._contents.first : null;
    }
}

/**
 * Directive for a tab. This directive must be used as a child of <code>mdcTabBar</code>.
 */
@Directive({
    selector: '[mdcTab]:not([routerLink])',
    exportAs: 'mdcTab',
    providers: [{provide: AbstractMdcTabDirective, useExisting: forwardRef(() => MdcTabDirective) }]
})
export class MdcTabDirective extends AbstractMdcTabDirective {
    constructor(rndr: Renderer2, root: ElementRef, registry: MdcEventRegistry) {
        super(rndr, root, registry);
    }
}

export const TAB_DIRECTIVES = [MdcTabIconDirective, MdcTabLabelDirective, MdcTabContentDirective, MdcTabDirective];
