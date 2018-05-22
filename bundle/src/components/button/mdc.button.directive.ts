import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, Renderer2, forwardRef } from '@angular/core';
import { MDCRipple } from '@material/ripple';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Use this directive for adding an icon to an <code>mdcButton</code>. This directive can be
 * added to font-style icons (such as <a href="https://material.io/icons/">material icons</a>
 * from Google fonts), or with <code>svg</code> elements for svg based icons.
 */
@Directive({
    selector: 'mdcButtonIcon'
})
export class MdcButtonIconDirective {
    @HostBinding('class.mdc-button__icon') _cls = true;
    @HostBinding('attr.aria-hidden') _ariaHidden = true;
}

/**
 * Material design button. Anchors can also be styled as buttons with this directive.
 * Defaults to a button that is flushed with the surface.
 * Use the input modifiers to alter the styling, or create your own style
 * based on the provided sass-mixins.
 */
@Directive({
    selector: 'button[mdcButton],a[mdcButton]',
    providers: [{provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcButtonDirective) }]
})
export class MdcButtonDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-button') _cls = true;
    private _dense = false;
    private _raised = false;
    private _outlined = false;

    constructor(public _elm: ElementRef, renderer: Renderer2, registry: MdcEventRegistry) {
        super(_elm, renderer, registry);
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

    set raised(val: any) {
        this._raised = asBoolean(val);
    }

    /**
     * When this input is defined and does not have value false, the button will be styled 
     * flush with the surface and have a visible border.
     */
    @HostBinding('class.mdc-button--outlined') @Input()
    get outlined() {
        return this._outlined;
    }

    set outlined(val: any) {
        this._outlined = asBoolean(val);
    }

    /**
     * When this input is defined and does not have value false, the button text is compressed
     * to make it slightly smaller.
     */
    @HostBinding('class.mdc-button--dense') @Input()
    get dense() {
        return this._dense;
    }

    set dense(val: any) {
        this._dense = asBoolean(val);
    }
}
