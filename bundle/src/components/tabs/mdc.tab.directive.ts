import { AfterContentInit, ContentChild, ContentChildren, EventEmitter, forwardRef, QueryList, Directive, ElementRef,
    HostBinding, HostListener, Input, OnDestroy, Optional, Output, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCTabFoundation } from '@material/tabs';
import { MdcTabAdapter } from './mdc.tab.adapter';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

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

@Directive({
    selector: '[mdcTab]'
})
export class MdcTabDirective {
    @HostBinding('class.mdc-tab') _hostClass = true;
    @ContentChild(MdcTabIconDirective) _mdcTabIcon: MdcTabIconDirective;
    @ContentChild(MdcTabIconTextDirective) _mdcTabIconText: MdcTabIconTextDirective;
    @Output() mdcSelect: EventEmitter<{tab: MdcTabDirective}> = new EventEmitter();
    private _adapter: MdcTabAdapter = {
        addClass: (className: string) => this._rndr.addClass(this._root.nativeElement, className),
        removeClass: (className: string) => this._rndr.removeClass(this._root.nativeElement, className),
        registerInteractionHandler: (type: string, handler: EventListener) => this._registry.listen(this._rndr, type, handler, this._root),
        deregisterInteractionHandler: (type: string, handler: EventListener) => this._registry.unlisten(type, handler),
        getOffsetWidth: () => this._root.nativeElement.offsetWidth,
        getOffsetLeft: () => this._root.nativeElement.offsetLeft,
        notifySelected: () => this.mdcSelect.emit({tab: this})
    };
    _foundation = new MDCTabFoundation(this._adapter);

    constructor(private _rndr: Renderer2, private _root: ElementRef, private _registry: MdcEventRegistry) {
    }

    ngAfterContentInit() {
        this._foundation.init();
    }

    ngOnDestroy() {
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
