import { AfterContentInit, ContentChildren, Directive, ElementRef,
    HostBinding, Input, OnDestroy, Renderer2, QueryList } from '@angular/core';
import { MDCTabIndicatorFoundation, MDCFadingTabIndicatorFoundation, MDCSlidingTabIndicatorFoundation, MDCTabIndicatorAdapter } from '@material/tab-indicator';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

/**
 * Child directive for an `mdcTabIndicator`. Must be present, and can be assigned
 * the value `underline` (default), or `icon`, to set the type of indicator.
 */
@Directive({
    selector: '[mdcTabIndicatorContent]'
})
export class MdcTabIndicatorContentDirective {
    /** @internal */
    @HostBinding('class.mdc-tab-indicator__content') readonly _cls = true;
    /** @internal */
    _type: 'underline' | 'icon' = 'underline';

    constructor(public _root: ElementRef) {}

   /**
     * By default the indicator is represented as an underline. Set this value to
     * `icon` to have it represented as an icon.
     * You can use SVG, or font icon libraries to set the content icon.
     */
    @Input() get mdcTabIndicatorContent() {
        return this._type;
    }

    set mdcTabIndicatorContent(value: 'underline' | 'icon') {
        this._type = value === 'icon' ? value : 'underline'
    }

    static ngAcceptInputType_mdcTabIndicatorContent: 'underline' | 'icon' | '';

    @HostBinding('class.mdc-tab-indicator__content--underline') get _underline() {
        return this._type === 'underline';
    }

    @HostBinding('class.mdc-tab-indicator__content--icon') get _icon() {
        return this._type === 'icon';
    }
}

/**
 * Directive for the content (label and optional icon of the tab).
 * This directive must be used as a child of an `mdcTab`, or `mdcTabRouter`.
 */
@Directive({
    selector: '[mdcTabIndicator]'
})
export class MdcTabIndicatorDirective implements AfterContentInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-tab-indicator') readonly _cls = true;
    private onDestroy$: Subject<any> = new Subject();
    /** @internal */
    @ContentChildren(MdcTabIndicatorContentDirective) _contents?: QueryList<MdcTabIndicatorContentDirective>;
    /** @internal */
    _type: 'slide' | 'fade' = 'slide';
    private active: ClientRect | boolean = false;
    
    private mdcAdapter: MDCTabIndicatorAdapter = {
        addClass: (className) => {
            this.rndr.addClass(this.root.nativeElement, className);
        },
        removeClass: (className) => {
            this.rndr.removeClass(this.root.nativeElement, className);
        },
        computeContentClientRect: () => this._content!._root.nativeElement.getBoundingClientRect(),
        setContentStyleProperty: (name, value) => this.rndr.setStyle(this._content!._root.nativeElement, name, value)
    };
    private foundation: MDCTabIndicatorFoundation | null = null;

    constructor(private rndr: Renderer2, private root: ElementRef) {}

    ngAfterContentInit() {
        if (this._content) {
            this.initFoundation();
        }
        this._contents!.changes.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            this.destroyFoundation();
            if (this._content)
                this.initFoundation();
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next(); this.onDestroy$.complete();
        this.destroyFoundation();
    }

    private destroyFoundation() {
        let destroy = this.foundation != null;
        if (destroy) {
            this.foundation!.destroy();
            this.mdcAdapter.removeClass('mdc-tab-indicator--active');
        }
        this.foundation = null;
        return destroy;
    }

    private initFoundation() {
        this.foundation = this._type === 'fade' ?
            new MDCFadingTabIndicatorFoundation(this.mdcAdapter) :
            new MDCSlidingTabIndicatorFoundation(this.mdcAdapter);
        this.foundation.init();
        if (this.active) {
            let clientRect = typeof this.active === 'boolean' ? undefined : this.active;
            this.foundation.activate(clientRect);
        }
    }

    /**
     * By default the indicator is a sliding indicator: when another tab is activated, the indicator
     * animates a slide to the new tab. Set this property `fade` to have a fading animation
     * instead.
     */
    @Input() get mdcTabIndicator() {
        return this._type;
    }

    set mdcTabIndicator(value: 'slide' | 'fade') {
        let newValue: 'slide' | 'fade' = value === 'fade' ? value : 'slide'
        if (newValue !== this._type) {
            this._type = newValue;
            if (this.destroyFoundation())
                this.initFoundation();
        }
    }

    static ngAcceptInputType_mdcTabIndicator: 'slide' | 'fade' | '';

    /** @internal */
    activate(previousIndicatorClientRect: ClientRect | undefined) {
        this.active = previousIndicatorClientRect || true;
        if (this.foundation)
            this.foundation.activate(previousIndicatorClientRect);
    }

    /** @internal */
    deactivate() {
        this.active = false;
        if (this.foundation)
            this.foundation.deactivate();
    }

    /** @internal */
    @HostBinding('class.mdc-tab-indicator--fade') get _slide() {
        return this._type === 'fade';
    }

    private get _content() {
        return this._contents && this._contents.length > 0 ? this._contents.first : null;
    }

    /** @internal */
    _computeContentClientRect() {
        return this.foundation?.computeContentClientRect();
    }
}

export const TAB_INDICATOR_DIRECTIVES = [MdcTabIndicatorContentDirective, MdcTabIndicatorDirective];
