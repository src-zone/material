import { AfterContentInit, ContentChild, Directive, ElementRef, forwardRef, HostBinding,
  Input, OnDestroy, OnInit, Optional, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCSelectFoundation } from '@material/select';
import { MDCFloatingLabelFoundation } from '@material/floating-label';
import { MDCLineRippleFoundation } from '@material/line-ripple';
import { MdcSelectAdapter } from './mdc.select.adapter';
import { MdcFloatingLabelDirective } from '../floating-label/mdc.floating-label.directive';
import { MdcLineRippleAdapter } from '../line-ripple/mdc.line-ripple.adapter';
import { AbstractMdcInput } from '../abstract/abstract.mdc.input';
import { asBoolean } from '../../utils/value.utils';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { NotchedOutlineSupport } from '../notched-outline/notched-outline.support';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

const CLASS_SELECT = 'mdc-select';
const CLASS_SELECT_CONTROL = 'mdc-select__native-control';
const CLASS_LINE_RIPPLE = 'mdc-line-ripple';

let nextId = 1;

/**
 * Directive for the select control of an <code>mdcSelect</code> directive.
 * Should be used as the first child element of the <code>mdcSelect</code>.
 */
@Directive({
    selector: 'select[mdcSelectControl]',
    providers: [{provide: AbstractMdcInput, useExisting: forwardRef(() => MdcSelectControlDirective) }]
})
export class MdcSelectControlDirective extends AbstractMdcInput implements OnInit, OnDestroy {
    @HostBinding('class.' + CLASS_SELECT_CONTROL) _cls = true;
    _onChange = (value) => {};
    private _id: string;
    private _disabled = false;
    private cachedId: string;

    constructor(public _elm: ElementRef, private renderer: Renderer2,
        public _registry: MdcEventRegistry, @Optional() @Self() public _cntr: NgControl) {
        super();
    }

    ngOnInit() {
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        // Listen to changes, so that the label style can be updated when a value is
        // set or cleared:
        if (this._cntr)
            this._cntr.valueChanges.subscribe(value => {
                this._onChange(this._elm.nativeElement.selectedIndex);
            });
    }

    ngOnDestroy() {
    }

    /**
     * Mirrors the <code>id</code> attribute. If no id is assigned, this directive will
     * assign a unique id by itself. If an <code>mdcFloatingLabel</code> for this select control
     * is available, the <code>mdcFloatingLabel</code> will automatically set its <code>for</code>
     * attribute to this <code>id</code> value.
     */
    @HostBinding()
    @Input() get id() {
        return this._id;
    }
  
    set id(value: string) {
        this._id = value || this._newId();
    }

    /**
     * If set to a value other than false, the mdcSelectControl will be in disabled state.
     */
    @HostBinding()
    @Input() get disabled() {
        return this._cntr ? this._cntr.disabled : this._disabled;
    }

    set disabled(value: any) {
        this._disabled = asBoolean(value);
    }

    _newId(): string {
        this.cachedId = this.cachedId || `mdc-select-${nextId++}`;
        return this.cachedId;
    }
}

/**
 * Directive for a spec aligned material design 'Select Control'.
 * This directive should wrap an <code>mdcSelectControl</code>, and an
 * <code>mdcFloatingLabel</code> directive.
 */
@Directive({
    selector: '[mdcSelect]'
})
export class MdcSelectDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.' + CLASS_SELECT) _cls = true;
    @ContentChild(MdcSelectControlDirective) _control: MdcSelectControlDirective;
    @ContentChild(MdcFloatingLabelDirective) _label: MdcFloatingLabelDirective;
    private _outlineSupport: NotchedOutlineSupport;
    private _initialized = false;
    private _box = false;
    private _outlined = false;
    private _bottomLineElm: HTMLElement = null;
    private _lineRippleAdapter: MdcLineRippleAdapter = {
        addClass: (className: string) => this._rndr.addClass(this._bottomLineElm, className),
        removeClass: (className: string) => this._rndr.removeClass(this._bottomLineElm, className),
        hasClass: (className) => this._bottomLineElm.classList.contains(className),
        setStyle: (name: string, value: string) => this._rndr.setStyle(this._bottomLineElm, name, value),
        registerEventHandler: (evtType: string, handler: EventListener) => this._registry.listenElm(this._rndr, evtType, handler, this._bottomLineElm),
        deregisterEventHandler: (evtType: string, handler: EventListener) => this._registry.unlisten(evtType, handler)
    };
    private _lineRippleFoundation: {
        init: Function,
        destroy: Function,
        activate: Function,
        deactivate: Function,
        setRippleCenter: (x: number) => void
    } = new MDCLineRippleFoundation(this._lineRippleAdapter);
    private adapter: MdcSelectAdapter = {
        addClass: (className: string) => this._rndr.addClass(this._elm.nativeElement, className),
        removeClass: (className: string) => this._rndr.removeClass(this._elm.nativeElement, className),
        floatLabel: (value: boolean) => {
            if (this._label) this._label._foundation.float(value);
        },
        activateBottomLine: () => {
            if (this._bottomLineElm) this._lineRippleFoundation.activate();
        },
        deactivateBottomLine: () => {
            if (this._bottomLineElm) this._lineRippleFoundation.deactivate();
        },
        registerInteractionHandler: (type, handler) => this._control._registry.listen(this._rndr, type, handler, this._control._elm),
        deregisterInteractionHandler: (type, handler) => this._control._registry.unlisten(type, handler),
        getSelectedIndex: () => this._control._elm.nativeElement.selectedIndex,
        setSelectedIndex: (index: number) => this._control._elm.nativeElement.selectedIndex = index,
        setDisabled: (disabled: boolean) => this._control._elm.nativeElement.disabled = disabled,
        getValue: () => this._control._elm.nativeElement.value,
        setValue: (value: string) => this._control._elm.nativeElement.value = value,
        isRtl: () => getComputedStyle(this._elm.nativeElement).getPropertyValue('direction') === 'rtl',
        hasLabel: () => !!this._label,
        getLabelWidth: () => this._label._foundation.getWidth(),
        hasOutline: () => this._outlined,
        notchOutline: (labelWidth: number, isRtl: boolean) => this._outlineSupport.foundation.notch(labelWidth, isRtl),
        closeOutline: () => this._outlineSupport.foundation.closeNotch()
    };
    private foundation: {
        init(),
        destroy(),
        setValue(value: string),
        setDisabled(disabled: boolean),
        setSelectedIndex(index: number),
        notchOutline(openNotch: boolean)
    };

    constructor(private _elm: ElementRef, private _rndr: Renderer2, _registry: MdcEventRegistry) {
        super(_elm, _rndr, _registry);
        this._outlineSupport = new NotchedOutlineSupport(_elm, _rndr);
    }

    ngAfterContentInit() {
        if (!this._control || !this._label)
            throw new Error('mdcSelect requires an embedded mdcSelectControl and mdcFloatingLabel');
        if (!this._label._initialized)
            throw new Error('mdcFloatingLabel not properly initialized');
        this._initialized = true;
        this.initComponent();

        if (this._control)
            this._control._onChange = (value) => this.foundation.setSelectedIndex(value);
    }

    ngOnDestroy() {
        this.destroyLineRipple();
        this.foundation.destroy();
        this._control._onChange = (value) => {};
    }

    private initComponent() {
        this.initLineRipple();
        this.initBox();
        this.initOutline();
        this.foundation = new MDCSelectFoundation(this.adapter);
        this.foundation.init();
    }

    private destroyComponent() {
        this.destroyLineRipple();
        this.destroyBox();
        this.destroyOutline();
        this.foundation.destroy();
    }

    private reconstructComponent() {
        if (this._initialized) {
            this.destroyComponent();
            this.initComponent();
            this.recomputeOutline();
        }
    }

    private initLineRipple() {
        if (!this._outlined) {
            this._bottomLineElm = this._rndr.createElement('div');
            this._rndr.addClass(this._bottomLineElm, CLASS_LINE_RIPPLE);
            this._rndr.appendChild(this._elm.nativeElement, this._bottomLineElm);
            this._lineRippleFoundation.init();
        }
    }

    private destroyLineRipple() {
        if (this._bottomLineElm) {
            this._lineRippleFoundation.destroy();
            this._rndr.removeChild(this._elm.nativeElement, this._bottomLineElm);
            this._bottomLineElm = null;
        }
    }

    private initBox() {
        if (this._box)
            this.initRipple();
    }

    private destroyBox() {
        this.destroyRipple();
    }

    private initOutline() {
        if (this._outlined)
            this._outlineSupport.init();
    }

    private destroyOutline() {
        this._outlineSupport.destroy();
    }

    private recomputeOutline() {
        if (this._outlined) {
            // the outline may not be valid after re-initialisation, recompute outline when all
            // style/structural changes have been employed:
            let inputValue = this._control._elm.nativeElement.value;
            let shouldFloat = inputValue != null && inputValue.length > 0;
            setTimeout(() => {this.foundation.notchOutline(shouldFloat); }, 0);
        }
    }

    /**
     * When this input is defined and does not have value false, the select will be styled as a
     * box select.
     */
    @Input() @HostBinding('class.mdc-select--box')
    get box() {
        return this._box;
    }

    set box(val: any) {
        let newVal = asBoolean(val);
        if (newVal !== this._box) {
            this._box = asBoolean(val);
            this.reconstructComponent();
        }
    }

    /**
     * When this input is set to a value other than false, the select control will be styled
     * with a notched outline.
     */
    @HostBinding('class.mdc-select--outlined') @Input()
    get outlined() {
        return this._outlined;
    }

    set outlined(val: any) {
        let newVal = asBoolean(val);
        if (newVal !== this._outlined) {
            this._outlined = asBoolean(val);
            this.reconstructComponent();
        }
    }

    @HostBinding('class.mdc-select--disabled') get _disabled() {
        return !this._control || this._control.disabled;
    }
}
