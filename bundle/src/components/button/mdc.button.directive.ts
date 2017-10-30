import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, Renderer2, forwardRef } from '@angular/core';
import { MDCRipple } from '@material/ripple';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

// TODO: mdc-button__icon

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
    private _compact = false;
    private _dense = false;
    private _primary = false;
    private _accent = false;
    private _raised = false;
    private _stroked = false;

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
    @HostBinding('class.mdc-button--stroked') @Input()
    get stroked() {
        return this._stroked;
    }

    set stroked(val: any) {
        this._stroked = asBoolean(val);
    }

    /**
     * When this input is defined and does not have value false, the amount of horizontal padding
     * in the button will be reduced.
     */
    @HostBinding('class.mdc-button--compact') @Input()
    get compact() {
        return this._compact;
    }

    set compact(val: any) {
        this._compact = asBoolean(val);
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
