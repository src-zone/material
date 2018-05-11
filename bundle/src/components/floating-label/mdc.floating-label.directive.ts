import { AfterContentInit, Directive, ElementRef, forwardRef, HostBinding,
  OnDestroy, Renderer2 } from '@angular/core';
import { MDCFloatingLabelFoundation } from '@material/floating-label';
import { MdcFloatingLabelAdapter } from './mdc.floating-label.adapter';
import { AbstractMdcLabel } from '../abstract/abstract.mdc.label';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Directive for the floating label of input fields. Flaoting labels are used by
 * <code>mdcTextField</code> and <code>mdcSelect</code> to display the type of input
 * the field requires. Floating labels are resting when the field is inactive, and
 * float when the field is active.
 * For an <code>mdcTextField</code> the label must be added just after the
 * <code>mdcTextFieldInput</code> as a direct child of an
 * <code>mdcTextField</code>. There is no need to assign the <code>for</code>
 * attribute, the label will automatically get its for attribute assigned to the
 * id of the parent <code>mdcInput</code>.
 */
@Directive({
    selector: 'label[mdcFloatingLabel]',
    providers: [{provide: AbstractMdcLabel, useExisting: forwardRef(() => MdcFloatingLabelDirective) }]
})
export class MdcFloatingLabelDirective extends AbstractMdcLabel implements AfterContentInit, OnDestroy {
    _initialized = false;
    /** @docs-private */
    @HostBinding() for: string;
    @HostBinding('class.mdc-floating-label') _cls = true;
    _mdcAdapter: MdcFloatingLabelAdapter = {
        addClass: (className: string) => {
            this._rndr.addClass(this._elm.nativeElement, className);
        },
        removeClass: (className: string) => {
            this._rndr.removeClass(this._elm.nativeElement, className);
        },
        getWidth:() => this._elm.nativeElement.offsetWidth,
        registerInteractionHandler: (type: string, handler: EventListener) => {
            this.registry.listen(this._rndr, type, handler, this._elm);
        },
        deregisterInteractionHandler: (type: string, handler: EventListener) => {
            this.registry.unlisten(type, handler);
        }
    };
    _foundation: {
        init: Function,
        destroy: Function,
        float: (should: boolean) => void,
        shake: (should: boolean) => void,
        getWidth: () => number
    } = new MDCFloatingLabelFoundation(this._mdcAdapter);

    constructor(private _rndr: Renderer2, public _elm: ElementRef, private registry: MdcEventRegistry) {
        super();
    }

    ngAfterContentInit() {
        this._foundation.init();
        this._initialized = true;
    }

    ngOnDestroy() {
        this._foundation.init();
        this._initialized = false;
    }
}
