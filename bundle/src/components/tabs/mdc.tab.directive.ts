import { AfterContentInit, ContentChild, ContentChildren, EventEmitter, forwardRef, Directive, ElementRef,
    HostBinding, HostListener, Input, OnDestroy, Optional, Output, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCTabFoundation } from '@material/tabs';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcTabAdapter } from './mdc.tab.adapter';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

export interface MdcTabChange {
    tab: AbstractMdcTabDirective,
    tabIndex: number
}

@Directive({
    selector: '[mdcTabIcon]'
})
export class MdcTabIconDirective {
    @HostBinding('class.mdc-tab__icon') _hostClass = true;
}

@Directive({
    selector: '[mdcTabIconText]'
})
export class MdcTabIconTextDirective {
    @HostBinding('class.mdc-tab__icon-text') _hostClass = true;
}

export class AbstractMdcTabDirective extends AbstractMdcRipple implements OnDestroy, AfterContentInit {
    @HostBinding('class.mdc-tab') _hostClass = true;
    @ContentChild(MdcTabIconDirective) _mdcTabIcon: MdcTabIconDirective;
    @ContentChild(MdcTabIconTextDirective) _mdcTabIconText: MdcTabIconTextDirective;
    @Output() activate: EventEmitter<MdcTabChange> = new EventEmitter();
    protected _adapter: MdcTabAdapter = {
        addClass: (className: string) => this._rndr.addClass(this._root.nativeElement, className),
        removeClass: (className: string) => this._rndr.removeClass(this._root.nativeElement, className),
        registerInteractionHandler: (type: string, handler: EventListener) => this._registry.listen(this._rndr, type, handler, this._root),
        deregisterInteractionHandler: (type: string, handler: EventListener) => this._registry.unlisten(type, handler),
        getOffsetWidth: () => this._root.nativeElement.offsetWidth,
        getOffsetLeft: () => this._root.nativeElement.offsetLeft,
        notifySelected: () => this.activate.emit({tab: this, tabIndex: null})
    };
    _foundation = new MDCTabFoundation(this._adapter);

    constructor(protected _rndr: Renderer2, protected _root: ElementRef, protected _registry: MdcEventRegistry) {
        super(_root, _rndr, _registry);
    }

    ngAfterContentInit() {
        this.initRipple();
        this._foundation.init();
    }

    ngOnDestroy() {
        this.destroyRipple();
        this._foundation.destroy();
    }

    @HostBinding('class.mdc-tab--with-icon-and-text')
    get _tabWithIconAndText() {
        return this._mdcTabIcon != null && this._mdcTabIconText != null;
    }

    @HostBinding('class.mdc-tab--active')
    get _active() {
        return this._foundation.isActive();
    }

    set _active(value: boolean) {
        this._foundation.setActive(value);
    }
}

@Directive({
    selector: '[mdcTab]',
    providers: [{provide: AbstractMdcTabDirective, useExisting: forwardRef(() => MdcTabDirective) }]
})
export class MdcTabDirective extends AbstractMdcTabDirective {
    constructor(rndr: Renderer2, root: ElementRef, registry: MdcEventRegistry) {
        super(rndr, root, registry);
    }

    @Input()
    get isActive() {
        return this._active;
    }

    set isActive(value: boolean) {
        let activate = asBoolean(value);
        if (activate) {
            this._active = true;
            this._adapter.notifySelected();
        }
    }
}
