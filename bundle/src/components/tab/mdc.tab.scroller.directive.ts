import { AfterContentInit, ContentChildren, Directive, ElementRef,
    HostBinding, OnDestroy, Renderer2, QueryList, Inject } from '@angular/core';
import { MDCTabScrollerFoundation, MDCTabScrollerAdapter, util } from '@material/tab-scroller';
import { events, ponyfill } from '@material/dom';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AbstractMdcTabDirective } from './mdc.tab.directive';

/**
 * Directive for a the scroll content of an `mdcTabScrollerArea`. This directive must wrap the
 * `mdcTab` directives for each of the tabs.
 */
@Directive({
    selector: '[mdcTabScrollerContent]'
})
export class MdcTabScrollerContentDirective {
    /** @internal */
    @HostBinding('class.mdc-tab-scroller__scroll-content') readonly _cls = true;

    constructor(public _el: ElementRef) {}
}

/**
 * Directive for a the scroll area of an `mdcTabScroller`. This directive should have exactly one
 * `mdcTabScrollerContent` child directive.
 */
@Directive({
    selector: '[mdcTabScrollerArea]'
})
export class MdcTabScrollerAreaDirective {
    /** @internal */
    @HostBinding('class.mdc-tab-scroller__scroll-area') readonly _cls = true;

    constructor(public _el: ElementRef) {}
}

/**
 * Directive for a scrollable tab bar. This directive should have exactly one
 * `mdcTabScrollerArea` child directive.
 */
@Directive({
    selector: '[mdcTabScroller]'
})
export class MdcTabScrollerDirective implements AfterContentInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-tab-scroller') readonly _cls = true;
    private onDestroy$: Subject<any> = new Subject();
    /** @internal */
    @ContentChildren(MdcTabScrollerAreaDirective) _areas?: QueryList<MdcTabScrollerAreaDirective>;
    /** @internal */
    @ContentChildren(MdcTabScrollerContentDirective, {descendants: true}) _contents?: QueryList<MdcTabScrollerContentDirective>;
    /** @internal */
    @ContentChildren(AbstractMdcTabDirective, {descendants: true}) _tabs?: QueryList<AbstractMdcTabDirective>;
    private document: Document;
    private _adapter: MDCTabScrollerAdapter = {
        eventTargetMatchesSelector: (target, selector) => ponyfill.matches(target as Element, selector),
        addClass: (name) => this._rndr.addClass(this._el.nativeElement, name),
        removeClass: (name) => this._rndr.removeClass(this._el.nativeElement, name),
        addScrollAreaClass: (name) => this._rndr.addClass(this._area!._el.nativeElement, name),
        setScrollAreaStyleProperty: (name, value) => this._rndr.setStyle(this._area!._el.nativeElement, name, value),
        setScrollContentStyleProperty: (name, value) => this._rndr.setStyle(this._content!._el.nativeElement, name, value),
        getScrollContentStyleValue: (name) => getComputedStyle(this._content!._el.nativeElement).getPropertyValue(name),
        setScrollAreaScrollLeft: (scrollX) => this._area!._el.nativeElement.scrollLeft = scrollX,
        getScrollAreaScrollLeft: () => this._area!._el.nativeElement.scrollLeft,
        getScrollContentOffsetWidth: () => this._content!._el.nativeElement.offsetWidth,
        getScrollAreaOffsetWidth: () => this._area!._el.nativeElement.offsetWidth,
        computeScrollAreaClientRect: () => this._area!._el.nativeElement.getBoundingClientRect(),
        computeScrollContentClientRect: () => this._content!._el.nativeElement.getBoundingClientRect(),
        computeHorizontalScrollbarHeight: () => util.computeHorizontalScrollbarHeight(this.document)
    };
    /** @internal */
    _foundation: MDCTabScrollerFoundation | null = null;

    constructor(private _rndr: Renderer2, private _el: ElementRef, private registry: MdcEventRegistry, @Inject(DOCUMENT) doc: any) {
        this.document = doc as Document; // work around ngc issue https://github.com/angular/angular/issues/20351
    }

    ngAfterContentInit() {
        let initializer = () => {
            this.destroyFoundation();
            if (this._content && this._area)
                this.initFoundation();
        };
        initializer();
        this._contents!.changes.pipe(takeUntil(this.onDestroy$)).subscribe(initializer);
        this._areas!.changes.pipe(takeUntil(this.onDestroy$)).subscribe(initializer);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.destroyFoundation();
    }

    private initFoundation() {
        this._foundation = new MDCTabScrollerFoundation(this._adapter);
        this._foundation.init();
        // manual registration of event listeners, because we need applyPassive, which is not (yet)
        // supported by angular bindings:
        this.registry.listen(this._rndr, 'wheel', this._handleInteraction, this._area!._el, events.applyPassive());
        this.registry.listen(this._rndr, 'touchstart', this._handleInteraction, this._area!._el, events.applyPassive());
        this.registry.listen(this._rndr, 'pointerdown', this._handleInteraction, this._area!._el, events.applyPassive());
        this.registry.listen(this._rndr, 'mousedown', this._handleInteraction, this._area!._el, events.applyPassive());
        this.registry.listen(this._rndr, 'keydown', this._handleInteraction, this._area!._el, events.applyPassive());
        this.registry.listen(this._rndr, 'transitionend', this._handleTransitionEnd, this._content!._el);
    }

    private destroyFoundation() {
        let destroy = this._foundation != null;
        if (destroy) {
            this.registry.unlisten('wheel', this._handleInteraction);
            this.registry.unlisten('touchstart', this._handleInteraction);
            this.registry.unlisten('pointerdown', this._handleInteraction);
            this.registry.unlisten('mousedown', this._handleInteraction);
            this.registry.unlisten('keydown', this._handleInteraction);
            this.registry.unlisten('transitionend', this._handleTransitionEnd);
            this._foundation!.destroy();
        }
        this._foundation = null;
        return destroy;
    }

    private _handleInteraction = () => this._foundation!.handleInteraction();
    private _handleTransitionEnd = (evt: Event) => this._foundation!.handleTransitionEnd(evt);

    /** @internal */
    _getScrollContentWidth() {
        return this._adapter.getScrollContentOffsetWidth();
    }

    private get _area() {
        return this._areas && this._areas.length > 0 ? this._areas.first : null;
    }
    
    private get _content() {
        return this._contents && this._contents.length > 0 ? this._contents.first : null;
    }
}

export const TAB_SCROLLER_DIRECTIVES = [MdcTabScrollerContentDirective, MdcTabScrollerAreaDirective, MdcTabScrollerDirective];
