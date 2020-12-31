import { AfterContentInit, ContentChildren, Directive, ElementRef, HostBinding, Inject, Input, OnDestroy,
    QueryList, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcIcon } from '../icon-button/abstract.mdc.icon';
import { MdcButtonDirective } from '../button/mdc.button.directive';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Directive for an area that displays a custom background-image. See the <code>size</code>
 * property for the sizing of the image.
 * If used, this directive should be put inside the card itself (<code>MdcCardDirective</code>).
 * Add an <code>mdcCardMediaContent</code> as sub-element for displaying a title, text,
 * or icon on top of the background image. 
 */
@Directive({
    selector: '[mdcCardMedia]',
})
export class MdcCardMediaDirective {
    /** @internal */
    @HostBinding('class.mdc-card__media') readonly _cls = true;
    private _size: 'cover' | '16:9' | 'square' = 'cover';
        
    constructor() {}

    /** @internal */
    @HostBinding('class.mdc-card__media--square') get _square() {
        return this._size === 'square';
    }

    /** @internal */
    @HostBinding('class.mdc-card__media--16-9') get _size2() {
        return this._size === '16:9';
    }

    /**
     * Directive to select size to which this element's background-image should
     * be scaled. Can be one of 'cover', '16:9', or 'square'. The default value
     * is 'cover'.
     */
    @Input() get size(): 'cover' | '16:9' | 'square' {
        return this._size;
    }
    
    set size(val: 'cover' | '16:9' | 'square') {
        this._size = val;
    }
}

/**
 * Directive for displaying text on top of a <code>mdcCardMedia</code> element.
 * This directive should be used as child element of the <code>mdcCardMedia</code>, and
 * creates an absolutely positioned box the same size as the media area.
 */
@Directive({
    selector: '[mdcCardMediaContent]'
})
export class MdcCardMediaContentDirective {
    /** @internal */
    @HostBinding('class.mdc-card__media-content') readonly _cls = true;
}

/**
 * Directive for displaying the button card actions. Composed of one or more
 * card actions, which must be buttons that have the <code>MdcButtonDirective</code>.
 * This directive should be placed inside an <code>MdcCardActionsDirective</code>.
 */
@Directive({
    selector: '[mdcCardActionButtons]'
})
export class MdcCardActionButtonsDirective {
    /** @internal */
    @HostBinding('class.mdc-card__action-buttons') readonly _cls = true;
}

/**
 * Directive for displaying the icon card actions. Composed of one or more
 * card actions, which must be icons (for instance <code>mdcIconButton</code>.
 * This directive should be placed inside an <code>MdcCardActionsDirective</code>.
 */
@Directive({
    selector: '[mdcCardActionIcons]'
})
export class MdcCardActionIconsDirective {
    /** @internal */
    @HostBinding('class.mdc-card__action-icons') readonly _cls = true;
}

/**
 * Directive for showing the different actions a user can take. Use
 * <code>mdcButton</code>, or <code>mdcIconButton</code> as child elements.
 * If you want to use both buttons and icons in the same row, wrap them in
 * <code>mdcCardActionButtons</code>, and <code>mdcCardActionIcons</code> directives.
 */
@Directive({
    selector: '[mdcCardActions]',
})
export class MdcCardActionsDirective implements AfterContentInit {
    /** @internal */
    @HostBinding('class.mdc-card__actions') readonly _cls = true;
    /** @internal */
    @ContentChildren(MdcButtonDirective, {descendants: true}) _buttons?: QueryList<MdcButtonDirective>;
    /** @internal */
    @ContentChildren(AbstractMdcIcon, {descendants: true}) _icons?: QueryList<AbstractMdcIcon>;
    private _initialized = false;
    private _fullBleed = false;

    constructor(private renderer: Renderer2) {}

    ngAfterContentInit() {
        this._initialized = true;
        this._initButtons();
        this._initIcons();
        this._buttons!.changes.subscribe(() => {
            this._initButtons();
        });
        this._icons!.changes.subscribe(() => {
            this._initIcons();
        })
    }

    private _initButtons() {
        if (this._initialized)
            this._buttons!.forEach(btn => {
                this.renderer.addClass(btn._elm.nativeElement, 'mdc-card__action');
                this.renderer.addClass(btn._elm.nativeElement, 'mdc-card__action--button');
            });
    }

    private _initIcons() {
        if (this._initialized)
            this._icons!.forEach(icon => {
                this.renderer.addClass(icon._elm.nativeElement, 'mdc-card__action');
                this.renderer.addClass(icon._elm.nativeElement, 'mdc-card__action--icon');
            });
    }

    /**
     * When this input is defined and does not have value false, the contained
     * button takes up the entire width of the action row. This should be used only when
     * there is a single button contained in the directive.
     */
    @HostBinding('class.mdc-card__actions--full-bleed') @Input()
    get fullBleed() {
        return this._fullBleed;
    }

    set fullBleed(val: boolean) {
        this._fullBleed = asBoolean(val);
    }

    static ngAcceptInputType_fullBleed: boolean | '';
}

/**
 * Directive for the main tappable area of the card (so should be a child of <code>mdcCard</code>).
 * Typically contains most (or all) card content except <code>mdcCardActions</code>.
 * Only applicable to cards that have a primary action that the main surface should trigger.
 */
@Directive({
    selector: '[mdcCardPrimaryAction]',
})
export class MdcCardPrimaryActionDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-card__primary-action') readonly _cls = true;

    constructor(private elm: ElementRef, renderer: Renderer2, registry: MdcEventRegistry, @Inject(DOCUMENT) doc: any) {
        super(elm, renderer, registry, doc as Document);
    }

    ngAfterContentInit() {
        if (!this.elm.nativeElement.hasAttribute('tabindex'))
            // unless overridden, make the action tabbable:
            this.elm.nativeElement.tabIndex = 0;
        this.initRipple();
    }
  
    ngOnDestroy() {
        this.destroyRipple();
    }
}

/**
 * Directive for a material designed card. The card can be composed with the following directives:
 * <code>MdcCardMediaDirective</code>, <code>MdcCardActionsDirective</code>
 */
@Directive({
    selector: '[mdcCard]'
})
export class MdcCardDirective {
    /** @internal */
    @HostBinding('class.mdc-card') readonly _cls = true;
    private _outlined = false;

    /**
     * When this input is set to a value other than false, the card will have a
     * hairline stroke instead of a shadow.
     */
    @HostBinding('class.mdc-card--outlined') @Input()
    get outlined() {
        return this._outlined;
    }

    set outlined(val: boolean) {
        this._outlined = asBoolean(val);
    }

    static ngAcceptInputType_outlined: boolean | '';
}

export const CARD_DIRECTIVES = [
    MdcCardMediaDirective,
    MdcCardMediaContentDirective,
    MdcCardActionButtonsDirective,
    MdcCardActionIconsDirective,
    MdcCardActionsDirective,
    MdcCardPrimaryActionDirective,
    MdcCardDirective
];