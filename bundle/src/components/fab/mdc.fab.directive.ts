import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, Renderer2, forwardRef } from '@angular/core';
import { MDCRipple } from '@material/ripple';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Directive for the icon of a Floating Action Button
 * (<code>mdcFab</code>). The icon of a Floating Action Button is
 * optional when the <code>extended</code> property is set.
 */
@Directive({
    selector: '[mdcFabIcon]'
})
export class MdcFabIconDirective {
    @HostBinding('class.mdc-fab__icon') _cls = true;
}

/**
 * Directive for the label of an extended Floating Action Button
 * (<code>mdcFab</code>). The label may be placed before or after the icon.
 * It is also possible to only have a label for an extended Floating Action
 * Button.
 */
@Directive({
    selector: '[mdcFabLabel]'
})
export class MdcFabLabelDirective {
    @HostBinding('class.mdc-fab__label') _cls = true;
}

/**
 * Material design Floating Action Button. The element should embed
 * an icon element with the <code>MdcFabIconDirective</code>.
 */
@Directive({
    selector: '[mdcFab]',
    providers: [{provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcFabDirective) }]
})
export class MdcFabDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-fab') _cls = true;
    private _mini = false;
    private _extended = false;
    private _exited = false;

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
     * When this input is defined and does not have value false, the FAB will
     * be modified to a smaller size.
     */
    @HostBinding('class.mdc-fab--mini') @Input()
    get mini() {
        return this._mini;
    }

    set mini(val: any) {
        this._mini = asBoolean(val);
    }

    /**
     * When this input is defined and does not have value false, the FAB will
     * be extended to a wider size which includes a text label. Use directive
     * <code>mdcFabLabel</code> for the text label.
     */
    @HostBinding('class.mdc-fab--extended') @Input()
    get extended() {
        return this._extended;
    }

    set extended(val: any) {
        this._extended = asBoolean(val);
    }

    /**
     * Setting this property to true will animate the FAB out of view.
     * Setting it to false will animate the FAB back into view.
     */
    @HostBinding('class.mdc-fab--exited') @Input()
    get exited() {
        return this._exited;
    }

    set exited(val: any) {
        this._exited = asBoolean(val);
    }
}

export const FAB_DIRECTIVES = [
    MdcFabIconDirective, MdcFabLabelDirective, MdcFabDirective
];
