import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, Renderer2, forwardRef } from '@angular/core';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Use this directive for adding an icon to an <code>mdcButton</code>. This directive can be
 * added to font-style icons (such as <a href="https://material.io/icons/" target="_blank">material icons</a>
 * from Google fonts), or with <code>svg</code> elements for svg based icons.
 */
@Directive({
    selector: '[mdcButtonIcon]'
})
export class MdcButtonIconDirective {
    @HostBinding('class.mdc-button__icon') _cls = true;
    @HostBinding('attr.aria-hidden') _ariaHidden = true;
}

/**
 * Directive for the label of an <code>mdcButton</code>. Must be a direct child
 * of <code>mdcButton</code>.
 */
@Directive({
    selector: '[mdcButtonLabel]'
})
export class MdcButtonLabelDirective {
    @HostBinding('class.mdc-button__label') _cls = true;
}

/**
 * Material design button. Anchors can also be styled as buttons with this directive.
 * Defaults to a button that is flushed with the surface.
 * Use the input modifiers to alter the styling, or create your own style
 * based on the provided sass-mixins.
 * 
 * For buttons with a trailing icon, you must put the label inside an `mdcButtonLabel`
 * directive. For all other buttons it is also recommnded to put the label inside
 * an `mdcButtonLabel`, because future version of material-components-web may make
 * it's use mandatory.
 * 
 * A ripple (and the required DOM elements for the ripple) will be added automatically.
 */
@Directive({
    selector: 'button[mdcButton],a[mdcButton]',
    providers: [{provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcButtonDirective) }]
})
export class MdcButtonDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-button') _cls = true;
    private _raised = false;
    private _unelevated = false;
    private _outlined = false;

    constructor(public _elm: ElementRef, renderer: Renderer2, registry: MdcEventRegistry) {
        super(_elm, renderer, registry);
        this.addRippleSurface('mdc-button__ripple');
    }

    ngAfterContentInit() {
        this.initRipple();
    }

    ngOnDestroy() {
        this.destroyRipple();
    }

    /**
     * When this input is defined and does not have value false, the button will be elevated
     * upon the surface.
     */
    @HostBinding('class.mdc-button--raised') @Input()
    get raised() {
        return this._raised;
    }

    set raised(val: boolean) {
        this._raised = asBoolean(val);
    }

    static ngAcceptInputType_raised: boolean | '';

    /**
     * When this input is defined and does not have value false, the button will be styled 
     * flush with the surface and have a visible border.
     */
    @HostBinding('class.mdc-button--outlined') @Input()
    get outlined() {
        return this._outlined;
    }

    set outlined(val: boolean) {
        this._outlined = asBoolean(val);
    }

    static ngAcceptInputType_outlined: boolean | '';

    /**
     * Set this property to a non false value for a contained button
     * flush with the surface.
     */
    @HostBinding('class.mdc-button--unelevated') @Input()
    get unelevated() {
        return this._unelevated;
    }

    set unelevated(val: boolean) {
        this._unelevated = asBoolean(val);
    }

    static ngAcceptInputType_unelevated: boolean | '';
}

export const BUTTON_DIRECTIVES = [
    MdcButtonIconDirective,
    MdcButtonLabelDirective,
    MdcButtonDirective
];
