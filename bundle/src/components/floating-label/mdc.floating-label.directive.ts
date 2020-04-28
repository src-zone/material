import { AfterContentInit, Directive, ElementRef, forwardRef, HostBinding,
  OnDestroy, Renderer2, Input, OnInit } from '@angular/core';
import { MDCFloatingLabelFoundation, MDCFloatingLabelAdapter } from '@material/floating-label';
import { estimateScrollWidth } from '@material/dom/ponyfill';
import { AbstractMdcLabel } from '../abstract/abstract.mdc.label';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

let nextId = 1;

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
export class MdcFloatingLabelDirective implements AfterContentInit, OnDestroy, OnInit {
    private _id: string;
    private cachedId: string;
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
        getWidth:() => estimateScrollWidth(this._elm.nativeElement),
        registerInteractionHandler: (type, handler) => {
            this.registry.listen(this._rndr, type, handler, this._elm);
        },
        deregisterInteractionHandler: (type, handler) => {
            this.registry.unlisten(type, handler);
        }
    };
    private _foundation = new MDCFloatingLabelFoundation(this._mdcAdapter);

    constructor(private _rndr: Renderer2, public _elm: ElementRef, private registry: MdcEventRegistry) {
    }

    ngOnInit() {
        // Force setter to be called in case id was not specified.
        this.id = this.id;
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

    /**
     * Mirrors the <code>id</code> attribute. If no id is assigned, this directive will
     * assign a unique id by itself.
     */
    @HostBinding()
    @Input() get id() {
        return this._id;
    }
  
    set id(value: string) {
        this._id = value || this._newId();
    }

    _newId(): string {
        this.cachedId = this.cachedId || `mdc-floating-label-${nextId++}`;
        return this.cachedId;
    }

    isLabelElement() {
        return this._elm.nativeElement.nodeName.toLowerCase() === 'label';
    }
}
