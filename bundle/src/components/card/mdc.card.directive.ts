import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, Directive, ElementRef, HostBinding, HostListener,
  Input, OnDestroy, QueryList, Renderer2, ViewEncapsulation } from '@angular/core';
import { asBoolean } from '../../utils/value.utils';
import { MdcButtonDirective } from '../button/mdc.button.directive';

/**
 * Directive for the primary area (containing titles and subtitles) of a card.
 * The primary area is typically composed of a title (<code>MdcCardTitleDirective</code>),
 * and subtitle (<code>MdcCardSubtitleDirective</code>).
 * This directive should be put inside the card itself (<code>MdcCardDirective</code>),
 * or inside an horizontal block in the card (<code>MdcCardHorizontalDirective</code>).
 */
@Directive({
    selector: '[mdcCardPrimary]'
})
export class MdcCardPrimaryDirective {
    @HostBinding('class.mdc-card__primary') _cls = true;

    constructor() {}
}

/**
 * Directive for the title of a card. Should be put inside the primary area
 * (<code>MdcCardPrimaryDirective</code>) of a card.
 */
@Directive({
    selector: '[mdcCardTitle]',
})
export class MdcCardTitleDirective {
    @HostBinding('class.mdc-card__title') _cls = true;
    private _large = false;
    
    constructor() {}

    /**
     * When this input is defined and does not have value false,
     * the title will be made larger.
     */
    @HostBinding('class.mdc-card__title--large') @Input()
    get large() {
        return this._large;
    }

    set large(val: any) {
        this._large = asBoolean(val);
    }
}

/**
 * Directive for the subtitle of a card. Should be put inside the primary area
 * (<code>MdcCardPrimaryDirective</code>) of a card.
 */
@Directive({
    selector: '[mdcCardSubtitle]',
})
export class MdcCardSubtitleDirective {
    @HostBinding('class.mdc-card__subtitle') _cls = true;
    
    constructor() {}
}

/**
 * Directive for the textual content of the card.
 * If used, this directive should be put inside the card itself ( (<code>MdcCardDirective</code>)),
 * or inside an horizontal block in the card (<code>MdcCardHorizontalDirective</code>)
 */
@Directive({
    selector: '[mdcCardText]',
})
export class MdcCardTextDirective {
    @HostBinding('class.mdc-card__supporting-text') _cls = true;

    constructor() {}
}

/**
 * Directive for rich media embedded in cards.
 * If used, this directive should be put inside the card itself (<code>MdcCardDirective</code>).
 * For media items inside an horizonal block, use <code>MdcCardMediaItemDirective</code>
 * instead.
 */
@Directive({
    selector: '[mdcCardMedia]',
})
export class MdcCardMediaDirective {
    @HostBinding('class.mdc-card__media') _cls = true;
    
    constructor() {}
}

/**
 * Directive for showing the different actions a user can take. Composed of one or more
 * card actions, which must be buttons that have the <code>MdcButtonDirective</code>.
 * (Icon buttons as actions are currently not supported by the upstream Material Components
 * Web library. Once they are supported, we'll add support for them as card actions too).
 */
@Directive({
    selector: '[mdcCardActions]'
})
export class MdcCardActionsDirective implements AfterContentInit  {
    @HostBinding('class.mdc-card__actions') _cls = true;
    @ContentChildren(MdcButtonDirective, {descendants: false}) _children: QueryList<MdcButtonDirective>;
    private _initialized = false;
    private _compact: boolean;
    private _vertical = false;

    constructor(private renderer: Renderer2) {}

    ngAfterContentInit() {
        this._initialized = true;
        this._initChildren();
        this._children.changes.subscribe(() => {
            this._initChildren();
        });
    }

    private _initChildren() {
        if (this._initialized)
            this._children.forEach(btn => {
                this.renderer.addClass(btn._elm.nativeElement, 'mdc-card__action');
                if (this._compact != null)
                    if (this._compact)
                        btn.compact = true;
                    else
                        btn.compact = false;
            });
    }

    /**
     * When this input is defined and does not have value false, all contained buttions
     * will automagically get compact styling, which is equal to setting the <code>compact</code>
     * input on the buttons individually.
     */
    @Input()
    get compact() {
        return this._compact;
    }

    set compact(val: any) {
        if (val == null)
            this._compact = val;
        else {
            val = asBoolean(val);
            if (this._compact !== val) {
                this._compact = val;
                this._initChildren();
            }
        }
    }

    /**
     * When this input is defined and does not have value false, the actions are layed out
     * vertically inside of horizontally.
     */
    @HostBinding('class.mdc-card__actions--vertical') @Input()
    get vertical() {
        return this._vertical;
    }

    set vertical(val: any) {
        this._vertical = asBoolean(val);
    }
}

/**
 * Directive for stacking multiple card blocks horizontally instead of vertically inside the card.
 * This directive should be put inside the card itself (<code>MdcCardDirective</code>) and wraps
 * the blocks that should be stacked horizontally, such as <code>MdcCardPrimaryDirective</code>,
 * <code>MdcCardMediaItemDirective</code>, and <code>MdcCardActionsDirective</code>.
 */
@Directive({
    selector: '[mdcCardHorizontal]',
})
export class MdcCardHorizontalDirective {
    @HostBinding('class.mdc-card__horizontal-block') _cls = true;
    
    constructor() {}
}

/**
 * Directive for media items. They are intended for use in horizontal blocks, taking up a fixed height,
 * rather than stretching to the width of the card.
 * Use the <code>sizeFactor</code> input to select from some predefined media item sizes.
 */
@Directive({
    selector: '[mdcCardMediaItem]',
})
export class MdcCardMediaItemDirective {
    @HostBinding('class.mdc-card__media-item') _cls = true;
    private _size = 1;
    
    constructor() {}

    @HostBinding('class.mdc-card__media-item--1dot5x') get _size1dot5() {
        return this._size === 1.5;
    }

    @HostBinding('class.mdc-card__media-item--2x') get _size2() {
        return this._size === 2;
    }

    @HostBinding('class.mdc-card__media-item--3x') get _size3() {
        return this._size === 3;
    }

    /**
     * Directive to select the media item size. Possible values are:<br/>
     * 1 (the default): sets the height to 80px.<br/>
     * 1.5: sets the height to 120px.<br/>
     * 2: sets the height to 160px.<br/>
     * 3: sets the height to 240px.<br/>
     * Any other value will reset <code>sizeFactor</code> to 1, to have a 80px height.
     */
    @Input()
    get sizeFactor() {
        return this._size;
    }
    
    set sizeFactor(val: any) {
        if (+val === 1.5)
            this._size = 1.5;
        else if (+val === 2)
            this._size = 2;
        else if (+val === 3)
            this._size = 3;
        else
            this._size = 1;
    }
}

/**
 * Directive for a material designed card. The card can be composed with the following directives:
 * <code>MdcCardPrimaryDirective</code>, <code>MdcCardTextDirective</code>, <code>MdcCardMediaDirective</code>,
 * <code>MdcCardActionsDirective</code>, <code>MdcCardHorizontalDirective</code>.
 */
@Directive({
    selector: '[mdcCard]'
})
export class MdcCardDirective {
    @HostBinding('class.mdc-card') _cls = true;

    constructor() {}
}
