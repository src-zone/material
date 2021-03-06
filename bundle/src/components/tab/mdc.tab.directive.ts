import { AfterContentInit, ContentChildren, EventEmitter, forwardRef, Directive, ElementRef,
    HostBinding, Input, OnDestroy, Output, Renderer2, QueryList, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MDCTabFoundation, MDCTabAdapter } from '@material/tab';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { MdcTabIndicatorDirective } from './mdc.tab.indicator.directive';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';  

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
    /** @internal */
    @HostBinding('class.mdc-tab__icon') readonly _cls = true;
    /** @internal */
    @HostBinding('attr.aria-hidden') _ariaHidden = true;
}

/**
 * Directive for the text label of a tab.
 * This directive must be used as a child of an `mdcTabContent`.
 * It can be preceded by an optional `mdcTabIcon`.
 */
@Directive({
    selector: '[mdcTabLabel]'
})
export class MdcTabLabelDirective {
    /** @internal */
    @HostBinding('class.mdc-tab__text-label') readonly _cls = true;
}

/**
 * Directive for the content (label and optional icon of the tab).
 * This directive must be used as a child of an `mdcTab`, and
 * can contain an (optional) `mdcTabIcon` and an `mdcTabLabel`.
 */
@Directive({
    selector: '[mdcTabContent]'
})
export class MdcTabContentDirective {
    /** @internal */
    @HostBinding('class.mdc-tab__content') readonly _cls = true;

    constructor(public _root: ElementRef) {}
}

@Directive()
export abstract class AbstractMdcTabDirective extends AbstractMdcRipple implements OnDestroy, AfterContentInit {
    /** @internal */
    @HostBinding('class.mdc-tab') readonly _cls = true;
    private onDestroy$: Subject<any> = new Subject();
    /** @internal */
    protected _active: ClientRect | boolean = false;
    /** @internal */
    @HostBinding('attr.role') _role = 'tab';
    /** @internal */
    @ContentChildren(MdcTabContentDirective) _contents?: QueryList<MdcTabContentDirective>;
    /** @internal */
    @ContentChildren(MdcTabIndicatorDirective, {descendants: true}) _indicators?: QueryList<MdcTabIndicatorDirective>;
    /**
     * Event called when the tab is activated.
     */
    @Output() readonly activate: EventEmitter<MdcTabChange> = new EventEmitter();
    private activationRequest: Subject<boolean> = new ReplaySubject<boolean>(1);
    /** @internal */
    protected _adapter: MDCTabAdapter = {
        addClass: (className) => this._rndr.addClass(this._root.nativeElement, className),
        removeClass: (className) => this._rndr.removeClass(this._root.nativeElement, className),
        hasClass: (className) => this._root.nativeElement.classList.contains(className),
        setAttr: (attr, value) => this._rndr.setAttribute(this._root.nativeElement, attr, value),
        activateIndicator: (previousIndicatorClientRect) => this._indicator?.activate(previousIndicatorClientRect),
        deactivateIndicator: () => this._indicator?.deactivate(),
        notifyInteracted: () => this.activationRequest.next(true),
        getOffsetLeft: () => this._root.nativeElement.offsetLeft,
        getOffsetWidth: () => this._root.nativeElement.offsetWidth,
        getContentOffsetLeft: () => this._content!._root.nativeElement.offsetLeft,
        getContentOffsetWidth: () => this._content!._root.nativeElement.offsetWidth,
        focus: () => this._root.nativeElement.focus()
    };
    /** @internal */
    _foundation: MDCTabFoundation | null = null;

    constructor(protected _rndr: Renderer2, public _root: ElementRef, protected _registry: MdcEventRegistry, @Inject(DOCUMENT) doc: any) {
        super(_root, _rndr, _registry, doc as Document);
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
        this._contents!.changes.pipe(takeUntil(this.onDestroy$)).subscribe(initializer);
        this._indicators!.changes.pipe(takeUntil(this.onDestroy$)).subscribe(initializer);
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
            this._foundation!.destroy();
        this._foundation = null;
        return destroy;
    }

    private initFoundation() {
        this._foundation = new MDCTabFoundation(this._adapter);
        this._foundation.init();
        if (this._active) {
            let clientRect = typeof this._active === 'boolean' ? undefined : this._active;
            this._foundation.activate(clientRect);
        } else {
            // foundation doesn't initialize these attributes:
            this._rndr.setAttribute(this._root.nativeElement, 'aria-selected', 'false');
            this._rndr.setAttribute(this._root.nativeElement, 'tabindex', '-1');
        }
    }

    /** @internal */
    protected getRippleStylingElement() {
        return this.rippleSurface;
    }

    /** @internal */
    _activate(tabIndex: number, previousIndicatorClientRect?: ClientRect) {
        this._active = previousIndicatorClientRect || true;
        if (this._foundation)
            this._foundation.activate(previousIndicatorClientRect);
        this.activate.emit({tab: this, tabIndex});
    }

    /** @internal */
    _deactivate() {
        this._active = false;
        if (this._foundation)
            this._foundation.deactivate();
    }

    /** @internal */
    _focus() {
        this._adapter.focus();
    }

    /** @internal */
    _computeIndicatorClientRect() {
        return this._indicator?._computeContentClientRect();
    }
    
    /** @internal */
    _computeDimensions() {
        return this._foundation?.computeDimensions();
    }

    /** @internal */
    isActive() {
        return !!this._active;
    } 

    /** @internal */
    triggerActivation(value: boolean = true) {
        // Note: this should not set the _active property. It just notifies the tab-bar
        // that it wants to be activated. The tab-bar will deactivate the previous tab, and activate
        // this one.
        this.activationRequest.next(value);
    }

    /** @internal */
    get activationRequest$() {
        return this.activationRequest.asObservable();
    }

    /** @internal */
    @HostListener('click') _onClick() {
        if (this._foundation)
            this._foundation.handleClick();
    }

    /** @internal */
    private get _indicator() {
        return this._indicators && this._indicators.length > 0 ? this._indicators.first : null;
    }

    /** @internal */
    private get _content() {
        return this._contents && this._contents.length > 0 ? this._contents.first : null;
    }
}

/**
 * Directive for a tab. This directive must be used as a child of <code>mdcTabBar</code>.
 * When using tabs in combination with angular routes, add a `routerLink` property, so that
 * the `MdcTabRouterDirective` is selected instead of this directive.
 */
@Directive({
    selector: '[mdcTab]:not([routerLink])',
    exportAs: 'mdcTab',
    providers: [{provide: AbstractMdcTabDirective, useExisting: forwardRef(() => MdcTabDirective) }]
})
export class MdcTabDirective extends AbstractMdcTabDirective {
    constructor(rndr: Renderer2, root: ElementRef, registry: MdcEventRegistry, @Inject(DOCUMENT) doc: any) {
        super(rndr, root, registry, doc as Document);
    }

    /**
     * Input for activating the tab. Assign a truthy value to activate the tab. A falsy value
     * will have no effect. In order to deactivate the tab, you must activate another tab.
     */
    @Input() get active() {
        return this.isActive();
    }

    set active(value: boolean) {
        this.triggerActivation(asBoolean(value));
    }

    static ngAcceptInputType_active: boolean | '';
}

export const TAB_DIRECTIVES = [MdcTabIconDirective, MdcTabLabelDirective, MdcTabContentDirective, MdcTabDirective];
