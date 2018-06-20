import { AfterContentInit, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, Input,
    OnDestroy, Optional, Output, QueryList, Renderer2, Self, forwardRef, ChangeDetectorRef } from '@angular/core';
import { MDCChipFoundation, MDCChipSetFoundation } from '@material/chips';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { asBoolean } from '../../utils/value.utils';
import { MdcChipAdapter } from './mdc.chip.adapter';
import { MdcChipSetAdapter } from './mdc.chip-set.adapter';
import { Subscription } from 'rxjs';

/**
 * Directive for the (optional) leading or trailing icon of an <code>mdcChip</code>.
 * Depenending on the position within the <code>mdcChip</code> the icon will determine
 * whether it is a leading or trailing icon.
 * Trailing icons must implement the functionality to remove the chip from the set, and
 * must only be added to input chips (<code>mdcChipSet="input"</code>). Chips with a trailing
 * icon must implement the <code>remove</code> event.
 */
@Directive({
    selector: '[mdcChipIcon]'
})
export class MdcChipIconDirective {
    @HostBinding('class.mdc-chip__icon') _cls = true;
    @HostBinding('class.mdc-chip__icon--leading') _leading = false;
    /**
     * Event emitted for trailing icon user interactions.
     */
    @Output() interact: EventEmitter<void> = new EventEmitter();
    private __trailing = false;
    private _oldTabIndex: number;
    private _oldRole: string;

    constructor(public _elm: ElementRef, private _rndr: Renderer2, public _cdRef: ChangeDetectorRef) {}

    @HostBinding('class.mdc-chip__icon--trailing') get _trailing() {
        return this.__trailing;
    }

    set _trailing(val: boolean) {
        if (val !== this._trailing) {
            this.__trailing = val;
            if (this._trailing) {
                this._oldTabIndex = this._elm.nativeElement.tabIndex;
                this._elm.nativeElement.tabIndex = 0;
                this._oldRole = this._elm.nativeElement.getAttribute('role');
                this._rndr.setAttribute(this._elm.nativeElement, 'role', 'button');
            } else {
                if (this._oldTabIndex) {
                    this._elm.nativeElement.tabIndex = this._oldTabIndex;
                    if (this._oldRole)
                        this._rndr.setAttribute(this._elm.nativeElement, 'role', this._oldRole);
                    else
                        this._rndr.removeAttribute(this._elm.nativeElement, 'role');
                }
                this._oldTabIndex = null;
                this._oldRole = null;
            }
        }
    }
}

/**
 * Directive for the text of an <code>mdcChip</code>.
 */
@Directive({
    selector: '[mdcChipText]'
})
export class MdcChipTextDirective {
    @HostBinding('class.mdc-chip__text') _cls = true;

    constructor(public _elm: ElementRef) {}
}

/**
 * Directive for a chip. Chips must be child elements of an <code>mdcChipSet</code>.
 */
@Directive({
    selector: '[mdcChip]'
})
export class MdcChipDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-chip') _cls = true;
    private initialized = false;
    private selectedMem = false;
    /**
     * Event emitted for user interaction with the chip.
     */
    @Output() interact: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted when the user has removed (by clicking the trailing icon) the chip.
     * This event must be implemented when the chip has a trailing icon, and the implementation
     * must remove the chip from the set. Without such implementation the directive will
     * animate the chip out of vision, but will not remove the chip from the DOM.
     */
    @Output() remove: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted when the chip changes from not-selected to selected state or vice versa
     * (for filter and choice chips).
     */
    @Output() selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    _set: MdcChipSetDirective;
    private _checkmark: HTMLElement;
    private _leadingIcon: MdcChipIconDirective;
    private _trailingIcon: MdcChipIconDirective;
    @ContentChildren(MdcChipIconDirective, {descendants: true}) _icons: QueryList<MdcChipIconDirective>;
    @ContentChildren(MdcChipTextDirective, {descendants: true}) _texts: QueryList<MdcChipTextDirective>;
    private _adapter: MdcChipAdapter = {
        addClass: (className: string) => {
            let selectedChanged = className === 'mdc-chip--selected' && !this._elm.nativeElement.classList.contains(className);
            this._renderer.addClass(this._elm.nativeElement, className);
            if (selectedChanged)
                this.selectedChange.emit(true);
        },
        removeClass: (className: string) => {
            let selectedChanged = className === 'mdc-chip--selected' && this._elm.nativeElement.classList.contains(className);
            this._renderer.removeClass(this._elm.nativeElement, className);
            if (selectedChanged)
                this.selectedChange.emit(false);
        },
        hasClass: (className) => this._elm.nativeElement.classList.contains(className),
        addClassToLeadingIcon: (className: string) => {
            let icon = this._leadingIcon;
            if (icon)
                this._renderer.addClass(icon._elm.nativeElement, className);
        },
        removeClassFromLeadingIcon: (className: string) => {
            let icon = this._leadingIcon;
            if (icon)
                this._renderer.removeClass(icon._elm.nativeElement, className);
        },
        eventTargetHasClass: (target: HTMLElement, className: string) => target.classList.contains(className),
        registerEventHandler: (evt: string, handler: EventListener) => this._registry.listen(this._renderer, evt, handler, this._elm),
        deregisterEventHandler: (evt: string, handler: EventListener) => this._registry.unlisten(evt, handler),
        registerTrailingIconInteractionHandler: (evt: string, handler: EventListener) => {
            let icon = this._trailingIcon;
            if (icon)
                this._registry.listen(this._renderer, evt, handler, icon._elm);
        },
        deregisterTrailingIconInteractionHandler: (evt: string, handler: EventListener) => this._registry.unlisten(evt, handler),
        notifyInteraction: () => this.interact.emit(),
        notifyTrailingIconInteraction: () => this._trailingIcon.interact.emit(),
        notifyRemoval: () => this.remove.emit(),
        getComputedStyleValue: (propertyName: string) => getComputedStyle(this._elm.nativeElement).getPropertyValue(propertyName),
        setStyleProperty: (style: string, value: string) => this._renderer.setStyle(this._elm.nativeElement, style, value)
    };
    _foundation: {
        init: Function,
        destroy: Function,
        isSelected: () => boolean,
        setSelected: (selected: boolean) => void
    } = new MDCChipFoundation(this._adapter);

    constructor(private _elm: ElementRef, rndr: Renderer2, registry: MdcEventRegistry) {
        super(_elm, rndr, registry);
    }

    ngAfterContentInit() {
        if (!this._elm.nativeElement.hasAttribute('tabindex'))
            // unless overridden, make the chip tabbable:
            this._elm.nativeElement.tabIndex = 0;
        this.initIcons();
        this._icons.changes.subscribe(() => {
            this._reInit();
        });
        this._texts.changes.subscribe(() => {
            this._reInit();
        });
        this.initRipple();
        this.initCheckMark();
        this._foundation.init();
        if (this.selectedMem)
            // triggers setting the foundation selected state (and possibly for other [choice] chips too):
            this.selected = this.selectedMem;
        this.initialized = true;
    }

    ngOnDestroy() {
        this.destroyRipple();
        this._foundation.destroy();
    }

    _reInit() {
        // if icons have changed, the foundation must be reinitialized, because
        // trailingIconInteractionHandler might have to be removed and/or attached
        // to another icon:
        this._foundation.destroy();
        this._foundation = new MDCChipFoundation(this._adapter);
        this.initIcons();
        this.initCheckMark();
        this._foundation.init();
        // no need to call setSelected again, as the previous state will still be available via
        // the mdc-chip--selected class
    }

    private initIcons() {
        let newLeading = this.computeLeadingIcon();
        let newTrailing = this.computeTrailingIcon(newLeading);
        if (newLeading !== this._leadingIcon || newTrailing !== this._trailingIcon) {
            this._leadingIcon = newLeading;
            this._trailingIcon = newTrailing;
            this._icons.forEach(icon => {
                let leading = icon === this._leadingIcon;
                let trailing = icon === this._trailingIcon;
                let changed = leading !== icon._leading || trailing !== icon._trailing;
                icon._leading = icon === this._leadingIcon;
                icon._trailing = icon === this._trailingIcon;
                if (changed) // if we don't do this we get ExpressionChangedAfterItHasBeenCheckedError:
                    icon._cdRef.detectChanges();
            });
            this.removeCheckMark(); // checkmark may have changed position, will be readded later (for filter chips)
        }
    }

    private computeLeadingIcon() {
        if (this._icons.length > 0) {
            let icon = this._icons.first;
            let prev = this.previousElement(icon._elm.nativeElement);
            let last = icon._elm.nativeElement;
            while (true) {
                // if it is contained in another element, check the siblings of the container too:
                if (prev == null && last != null && last.parentElement !== this._elm.nativeElement)
                    prev = last.parentElement;
                // no more elements before, must be the leading icon:
                if (prev == null)
                    return icon;
                // comes after the text, so it's not the leading icon:
                if (this._text && (prev === this._text._elm.nativeElement || prev.contains(this._text._elm.nativeElement)))
                    return null;
                last = prev;
                prev = this.previousElement(prev);
            }
        }
        return null;
    }

    private get _text() {
        return this._texts.first;
    }

    private computeTrailingIcon(leading: MdcChipIconDirective) {
        if (this._icons.length > 0) {
            let icon = this._icons.last;
            if (icon === leading)
                return null;
            // if not the leading icon, it must be the trailing icon:
            return icon;
        }
        return null;
    }

    private previousElement(el: Element): Element {
        let result = el.previousSibling;
        while (result != null && !(result instanceof Element))
            result = result.previousSibling;
        return <Element>result;
    }

    private initCheckMark() {
        if (this._set && this._set._type === 'filter')
            this.addCheckMark();
        else
            this.removeCheckMark();
    }
    
    private addCheckMark() {
        if (!this._checkmark) {
            let path = this._renderer.createElement('path', 'svg');
            this._renderer.addClass(path, 'mdc-chip__checkmark-path');
            this._renderer.setAttribute(path, 'fill', 'none');
            this._renderer.setAttribute(path, 'stroke', 'black');
            this._renderer.setAttribute(path, 'd', 'M1.73,12.91 8.1,19.28 22.79,4.59');
            let svg = this._renderer.createElement('svg', 'svg');
            this._renderer.appendChild(svg, path);
            this._renderer.addClass(svg, 'mdc-chip__checkmark-svg');
            this._renderer.setAttribute(svg, 'viewBox', '-2 -3 30 30');
            this._checkmark = this._renderer.createElement('div');
            this._renderer.appendChild(this._checkmark, svg);
            this._renderer.addClass(this._checkmark, 'mdc-chip__checkmark');
            let beforeElement = this._text ? this._text._elm.nativeElement : null;
            if (beforeElement)
                // checkmark should go after leading icon:
                this._renderer.insertBefore(this._elm.nativeElement, this._checkmark, beforeElement);
            else
                this._renderer.appendChild(this._elm.nativeElement, this._checkmark);
        }
    }

    private removeCheckMark() {
        if (this._checkmark) {
            this._checkmark.parentElement.removeChild(this._checkmark);
            this._checkmark = null;
        }
    }

    /**
     * The 'selected' state of the chip. Filter and choice chips are either selected or
     * not selected. Making a choice chip selected, will make all other chips in that set
     * not selected.
     */
    @Input() get selected(): any {
        return this.initialized ? this._foundation.isSelected() : this.selectedMem;
    }

    set selected(val: any) {
        let value = asBoolean(val);
        this.selectedMem = value;
        if (this.initialized && value !== this._foundation.isSelected()) {
            if (value && this._set)
                // this will also trigger deselection of other values for choice chips
                this._set._foundation.select(this._foundation);
            else
                this._foundation.setSelected(val);
        }
        // when not initialized the selectedChange will be emitted via the foundation after
        // initialization
    }

    /** @docs-private */
    protected computeRippleBoundingRect() {
        if (this._checkmark && !this._leadingIcon) {
            const height = this._rippleElm.nativeElement.getBoundingClientRect().height;
            // https://github.com/material-components/material-components-web/blob/cb373ad34857070734a7c02bf59116e21853842a/packages/mdc-chips/chip/index.js#L60:
            // the checkmark should be square, but initiallly the width is set to 0
            return { height: height, width: height };
        }
        return super.computeRippleBoundingRect();
    }
}

/**
 * Directive for a chip-set (a collection of <code>mdcChip</code>).
 */
@Directive({
    selector: '[mdcChipSet]'
})
export class MdcChipSetDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-chip-set') _cls = true;
    @ContentChildren(MdcChipDirective, {descendants: true}) _chips: QueryList<MdcChipDirective>;
    private _interactSubscriptions: Subscription[];
    private _removeSubscriptions: Subscription[];
    private _initialized = false;
    private _interactionHandler: EventListener;
    _type: 'choice' | 'filter' | 'input' | 'action' = 'action';
    _adapter: MdcChipSetAdapter = {
        hasClass: (className: string) => this._elm.nativeElement.classList.contains(className),
        registerInteractionHandler: (evt: string, handler: EventListener) => {
            if (evt === 'MDCChip:interaction')
                this._interactionHandler = handler;
            // 'MDCChip:removal' is not really used, we call deselect/removeChip directly on the angular eventemitter subscription
            else
                this._registry.listen(this._rndr, evt, handler, this._elm);
        },
        deregisterInteractionHandler: (evt: string, handler: EventListener) => {
            if (evt === 'MDCChip:interaction')
                this._interactionHandler = null;
            else
                this._registry.unlisten(evt, handler);
        },
        removeChip: (chip: any) => {
            throw new Error('this adapter method should be unreachable in the MdcChipSetDirective implementation');
        }
    };
    _foundation: {
        init: Function,
        destroy: Function,
        select: (chip: MDCChipFoundation) => void,
        deselect: (chip: MDCChipFoundation) => void
    } = new MDCChipSetFoundation(this._adapter);

    constructor(private _elm: ElementRef, private _rndr: Renderer2, private _registry: MdcEventRegistry) {}

    ngAfterContentInit() {
        this._chips.changes.subscribe(() => {
            this.initSubscriptions();
            this.initChips();
        });
        this.initSubscriptions();
        this.initChips();
        this._foundation.init();
        this._initialized = true;
    }

    ngOnDestroy() {
        this._foundation.destroy();
        this.destroySubscriptions();
        this._initialized = false;
    }

    /**
     * Chip sets by default contain 'action' chips. Set this value to <code>choice</code>,
     * <code>filter</code>, <code>input</code>, or <code>action</code> to determine the kind
     * of chips that are contained in the chip set.
     */
    @Input() get mdcChipSet() {
        return this._type;
    }

    set mdcChipSet(value: any) {
        if (value !== this._type) {
            if (value === 'choice' || value === 'filter' || value ==='input')
                this._type = value;
            else
                this._type = 'action';
            if (this._initialized)
                this.initChips(true);
        }
    }

    private initChips(force = false) {
        this._chips.forEach(chip => {
            if (force || chip._set !== this) {        
                chip._set = this;
                chip._reInit();
            }
        });
    }

    private destroySubscriptions() {
        try {
            if (this._interactSubscriptions)
                this._interactSubscriptions.forEach(sub => sub.unsubscribe());
            if (this._removeSubscriptions)
                this._removeSubscriptions.forEach(sub => sub.unsubscribe());
        } finally {
            this._interactSubscriptions = null;
            this._removeSubscriptions = null;
        }
    }

    private initSubscriptions() {
        this.destroySubscriptions();
        this._interactSubscriptions = [];
        this._removeSubscriptions = [];
        this._chips.forEach(chip => {
            this._interactSubscriptions.push(chip.interact.subscribe(event => {
                // using the interactionHandler that was registered by the foundation:
                if (this._interactionHandler)
                    this._interactionHandler(<any>{
                        detail: { chip: { foundation: chip._foundation }}
                    });
            }));
            this._removeSubscriptions.push(chip.remove.subscribe(event => {
                // directly handling, bypassing event handlers:
                this._foundation.deselect(chip._foundation);
                // don't call this._adapter.removeChip(chip);
            }));
        });
    }

    @HostBinding('class.mdc-chip-set--choice') get _choice() {
        return this._type === 'choice';
    }

    @HostBinding('class.mdc-chip-set--filter') get _filter() {
        return this._type === 'filter';
    }

    @HostBinding('class.mdc-chip-set--input') get _input() {
        return this._type === 'input';
    }
}

export const CHIP_DIRECTIVES = [
    MdcChipIconDirective, MdcChipTextDirective, MdcChipDirective, MdcChipSetDirective
];
