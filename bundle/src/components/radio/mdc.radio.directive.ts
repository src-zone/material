import { AfterContentInit, Directive, ElementRef, HostBinding,
  Input, OnDestroy, Optional, Renderer2, Self, forwardRef, ContentChildren, QueryList } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCRadioFoundation, MDCRadioAdapter } from '@material/radio';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Directive for the input element of an <code>MdcRadioDirective</code>.
 */
@Directive({
    selector: 'input[mdcRadioInput][type=radio]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcRadioInputDirective) }]
})
export class MdcRadioInputDirective extends AbstractMdcInput {
    @HostBinding('class.mdc-radio__native-control') _cls = true;
    private _id: string | null = null;
    private _disabled = false;

    constructor(public _elm: ElementRef, @Optional() @Self() public _cntr: NgControl) {
        super();
    }

    /** @docs-private */
    @HostBinding()
    @Input() get id() {
        return this._id;
    }
  
    set id(value: string | null) {
        this._id = value;
    }

    /** @docs-private */
    @HostBinding()
    @Input() get disabled() {
        return this._cntr ? !!this._cntr.disabled : this._disabled;
    }

    set disabled(value: boolean) {
        this._disabled = asBoolean(value);
    }

    static ngAcceptInputType_disabled: boolean | '';
}

/**
 * Directive for creating a Material Design radio button. The radio button is driven by an
 * underlying native radio input, which must use the <code>MdcRadioInputDirective</code>
 * directive.
 * The current implementation will add all other required DOM elements (such as the
 * background).
 * Future implementations will also support supplying (customized) background
 * elements.
 * 
 * This directive can be used together with an <code>mdcFormField</code> to
 * easily position radio buttons and their labels, see
 * <a href="/material/components/form-field">mdcFormField</a>.
 */
@Directive({
    selector: '[mdcRadio]'
})
export class MdcRadioDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-radio') _cls = true;
    @ContentChildren(MdcRadioInputDirective) _inputs?: QueryList<MdcRadioInputDirective>;
    private mdcAdapter: MDCRadioAdapter = {
        // We can just ignore all adapter calls, since we have a HostBinding for the
        // disabled classes, and never call foundation.setDisabled
        addClass: () => undefined,
        removeClass: () => undefined,
        setNativeControlDisabled: () => undefined
    };
    private foundation: MDCRadioFoundation | null = new MDCRadioFoundation(this.mdcAdapter);

    constructor(private renderer: Renderer2, private root: ElementRef, registry: MdcEventRegistry) {
        super(root, renderer, registry);
    }

    ngAfterContentInit() {
        this.addBackground();
        this.addRippleSurface('mdc-radio__ripple');
        this.initRipple(true);
        this.foundation!.init();
        this._inputs!.changes.subscribe(() => {
            this.reinitRipple();
        });
    }

    ngOnDestroy() {
        this.destroyRipple();
        this.foundation?.destroy();
        this.foundation = null;
    }

    private addBackground() {
        let outerCircle = this.renderer.createElement('div');
        this.renderer.addClass(outerCircle, 'mdc-radio__outer-circle');
        let innerCircle = this.renderer.createElement('div');
        this.renderer.addClass(innerCircle, 'mdc-radio__inner-circle');
        let bg = this.renderer.createElement('div');
        this.renderer.appendChild(bg, outerCircle);
        this.renderer.appendChild(bg, innerCircle);
        this.renderer.addClass(bg, 'mdc-radio__background');
        this.renderer.appendChild(this.root.nativeElement, bg);
    }

    /** @docs-private */
    protected getRippleInteractionElement() {
        return this._input?._elm;
    }

    /** @docs-private */
    isRippleSurfaceActive() {
        // This is what the @material/radio MDCRadio component does, with the following comment:
        // "Radio buttons technically go 'active' whenever there is *any* keyboard interaction.
        //  This is not the UI we desire."
        return false;
    }

    // instead of calling foundation.setDisabled on disabled state changes, we just
    // bind the class to the property:
    @HostBinding('class.mdc-radio--disabled') get _disabled() {
        return this._input == null || this._input.disabled;
    }

    get _input() {
        return this._inputs && this._inputs.length > 0 ? this._inputs.first : null;
    }
}

export const RADIO_DIRECTIVES = [
    MdcRadioInputDirective,
    MdcRadioDirective
];
