import { AfterContentInit, Directive, ElementRef, forwardRef, HostBinding,
  OnDestroy, Renderer2, OnInit } from '@angular/core';
import { MDCFloatingLabelFoundation, MDCFloatingLabelAdapter } from '@material/floating-label';
import { ponyfill } from '@material/dom';
import { AbstractMdcLabel } from '../abstract/abstract.mdc.label';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { HasId } from '../abstract/mixin.mdc.hasid';
import { applyMixins } from '../../utils/mixins';

@Directive()
class MdcFloatingLabelDirectiveBase {}
interface MdcFloatingLabelDirectiveBase extends HasId {}
applyMixins(MdcFloatingLabelDirectiveBase, [HasId]);
/**
 * Directive for the floating label of input fields. Floating labels are used by
 * <code>mdcTextField</code> and <code>mdcSelect</code> to display the type of input
 * the field requires. Floating labels are resting when the field is inactive, and
 * float when the field is active.
 * For an <code>mdcTextField</code> the label must be added just after the
 * <code>mdcTextFieldInput</code> as a direct child of an
 * <code>mdcTextField</code>. There is no need to assign the <code>for</code>
 * attribute, as the label will automatically get its <code>for</code> attribute assigned
 * to the id of the parent <code>mdcInput</code>.
 */
@Directive({
    selector: '[mdcFloatingLabel]',
    providers: [{provide: AbstractMdcLabel, useExisting: forwardRef(() => MdcFloatingLabelDirective) }]
})
export class MdcFloatingLabelDirective extends MdcFloatingLabelDirectiveBase implements AfterContentInit, OnDestroy, OnInit {
    /** @docs-private */
    @HostBinding('attr.for') for: string | null = null;
    @HostBinding('class.mdc-floating-label') _cls = true;
    private _mdcAdapter: MDCFloatingLabelAdapter = {
        addClass: (className: string) => {
            this._rndr.addClass(this._elm.nativeElement, className);
        },
        removeClass: (className: string) => {
            this._rndr.removeClass(this._elm.nativeElement, className);
        },
        getWidth:() => ponyfill.estimateScrollWidth(this._elm.nativeElement),
        registerInteractionHandler: (type, handler) => {
            this.registry.listen(this._rndr, type, handler, this._elm);
        },
        deregisterInteractionHandler: (type, handler) => {
            this.registry.unlisten(type, handler);
        }
    };
    private _foundation = new MDCFloatingLabelFoundation(this._mdcAdapter);

    constructor(private _rndr: Renderer2, public _elm: ElementRef, private registry: MdcEventRegistry) {
        super();
    }

    ngOnInit() {
        this.initId();
    }

    ngAfterContentInit() {
        this._foundation.init();
    }

    ngOnDestroy() {
        this._foundation.destroy();
    }

    shake(shouldShake: boolean) {
        this._foundation.shake(shouldShake);
    }

    float(shouldFloat: boolean) {
        this._foundation.float(shouldFloat);
    }

    getWidth(): number {
        return this._foundation.getWidth();
    }

    isLabelElement() {
        return this._elm.nativeElement.nodeName.toLowerCase() === 'label';
    }
}
