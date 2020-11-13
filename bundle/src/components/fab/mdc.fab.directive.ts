import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, Renderer2, forwardRef, ContentChild, ContentChildren } from '@angular/core';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Directive for the icon of a Floating Action Button
 * (`mdcFab`).
 */
@Directive({
    selector: '[mdcFabIcon]'
})
export class MdcFabIconDirective {
    @HostBinding('class.mdc-fab__icon') _cls = true;
}

/**
 * Directive for the label of an extended Floating Action Button
 * (`mdcFab`). The label may be placed before or after the icon.
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
 * an icon element with the `mdcFabIcon`, or (to make it an extended floating action button)
 * a label with the `mdcFabLabel` directive. Extended floating actions button may (in addition
 * to the label) also add an `mdcFabIcon` before or after the label.
 */
@Directive({
    selector: '[mdcFab]',
    providers: [{provide: AbstractMdcRipple, useExisting: forwardRef(() => MdcFabDirective) }]
})
export class MdcFabDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-fab') _cls = true;
    @ContentChild(MdcFabLabelDirective) private label;
    @ContentChildren(MdcFabLabelDirective) private _labels;
    private _mini = false;
    private _exited = false;

    constructor(public _elm: ElementRef, renderer: Renderer2, registry: MdcEventRegistry) {
        super(_elm, renderer, registry);
        this.addRippleSurface('mdc-fab__ripple');
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

    /** @docs-private */
    @HostBinding('class.mdc-fab--extended') get extended() {
        return !!this.label;
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
