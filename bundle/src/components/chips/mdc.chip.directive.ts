import { AfterContentInit, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, Input,
    OnDestroy,Output, QueryList, Renderer2, ChangeDetectorRef, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MDCChipAdapter, MDCChipSetAdapter, MDCChipFoundation, MDCChipSetFoundation } from '@material/chips';
import { EventSource} from '@material/chips/chip/constants';
import { announce } from '@material/dom/announce';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { asBoolean } from '../../utils/value.utils';
import { Subscription } from 'rxjs';

export enum ChipEventSource {
    primary = EventSource.PRIMARY,
    trailing = EventSource.TRAILING,
    none = EventSource.NONE
};

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
    /** @internal */
    @HostBinding('class.mdc-chip__icon') readonly _cls = true;
    /** @internal */
    @HostBinding('class.mdc-chip__icon--leading') _leading = false;
    /**
     * Event emitted for trailing icon user interactions. Please note that chip removal should be
     * handled by the `remove` output of the chip, *not* by a handler for this output.
     */
    @Output() readonly interact: EventEmitter<void> = new EventEmitter();
    /** @internal */
    @HostBinding('class.mdc-chip__icon--trailing') _trailing = false;
    private _originalTabindex: number | null = null;
    private __tabindex: number = -1;
    private __role: string | null = null;
    /** @internal */
    _chip: MdcChipDirective | null = null;

    constructor(public _elm: ElementRef, private _rndr: Renderer2, public _cdRef: ChangeDetectorRef) {
        this.__role = _elm.nativeElement.getAttribute('role');
        let tabIndex = _elm.nativeElement.getAttribute('tabindex');
        if (tabIndex) {
            this._originalTabindex = +tabIndex;
            this.__tabindex = +tabIndex;
        }
    }

    ngOnDestroy() {
        this._chip = null;
    }

    /** @internal */
    @HostBinding('attr.tabindex') get _tabindex() {
        return this._trailing ? this.__tabindex : this._originalTabindex;
    }

    /** @internal */
    set _tabindex(val: number | null) {
        this.__tabindex = val == null ? -1 : val;
    }

    /** @internal */
    @HostBinding('attr.role') get _role() {
        if (this.__role)
            return this.__role;
        return this._trailing ? 'button' : null;
    }

    /** @internal */
    @HostListener('click', ['$event']) _handleClick(event: MouseEvent) {
        if (this._chip && this._trailing)
            this._chip._foundation?.handleTrailingIconInteraction(event);
    }

    /** @internal */
    @HostListener('keydown', ['$event']) _handleInteraction(event: KeyboardEvent) {
        if (this._chip && this._trailing)
            this._chip._foundation?.handleTrailingIconInteraction(event);
    }
}

/**
 * Directive for the text of an `mdcChip`. Must be contained in an `mdcChipPrimaryAction`
 * directive.
 */
@Directive({
    selector: '[mdcChipText]'
})
export class MdcChipTextDirective {
    @HostBinding('class.mdc-chip__text') readonly _cls = true;

    constructor(public _elm: ElementRef) {}
}

/**
 * Directive for the primary action element of a chip. The `mdcChipPrimaryAction` must
 * contain the `mdcChipText` directive, and be contained by an `mdcChipCell` directive.
 */
@Directive({
    selector: '[mdcChipPrimaryAction]'
})
export class MdcChipPrimaryActionDirective {
    /** @internal */
    @HostBinding('class.mdc-chip__primary-action') readonly _cls = true;
    private __tabindex: number = -1;
    /** @internal */
    __role: string = 'button';

    constructor(public _elm: ElementRef) {
        this.__tabindex = +(this._elm.nativeElement.getAttribute('tabindex') || -1);
    }

    /** @internal */
    @HostBinding('attr.role') get _role() {
        return this.__role;
    }

    /** @internal */
    @HostBinding('attr.tabindex') get _tabindex() {
        return this.__tabindex;
    }

    /** @internal */
    set _tabindex(val: number) {
        this.__tabindex = val;
    }
}

/**
 * Directive for the main content of a chip. This directive mus contain
 * the `mdcChipPrimaryActione` directive, and must be the child of an `mdcChip`.
 */
@Directive({
    selector: '[mdcChipCell]'
})
export class MdcChipCellDirective {
    /** @internal */
    @HostBinding('attr.role') _role = 'gridcell';

    constructor(public _elm: ElementRef) {}
}

/**
 * Directive for a chip. Chips must be child elements of an `mdcChipSet`,
 * and must contain an `mdcChipCell`, and may additionally contain an `mdcChipIcon` for
 * the leading icon. An optional trailing icon must be wrapped in a second `mdcChipCell`.
 */
@Directive({
    selector: '[mdcChip]'
})
export class MdcChipDirective extends AbstractMdcRipple implements AfterContentInit, OnDestroy {
    /** @internal */
    static nextValue = 1; // for computing a unique value, if no value was provided
    /** @internal */
    @HostBinding('class.mdc-chip') readonly _cls = true;
    /** @internal */
    @HostBinding('attr.role') _role = 'row';
    private initialized = false;
    private selectedMem = false;
    private removableMem = true;
    private _uniqueValue: string;
    private _value: string | null = null;
    /**
     * Event emitted for user interaction with the chip.
     */
    @Output() readonly interact: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted when the user has removed (by clicking the trailing icon) the chip.
     * This event must be implemented when the `removable` property is set, and the chip
     * has a trailing icon. The implementation must remove the chip from the set.
     * Without such implementation the directive will animate the chip out of vision,
     * but will not remove the chip from the DOM.
     */
    @Output() readonly remove: EventEmitter<void> = new EventEmitter();
    /**
     * Event emitted when a navigation event has occured.
     */
    @Output() readonly navigation: EventEmitter<{key: string, source: ChipEventSource}> = new EventEmitter();
    /**
     * Event emitted when the chip changes from not-selected to selected state or vice versa
     * (for filter and choice chips).
     */
    @Output() readonly selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    // Like selectedChange, but only the events that should go to the chipset (i.e. not including the ones initiated by the chipset)
    /** @internal */
    @Output() readonly _selectedForChipSet: EventEmitter<boolean> = new EventEmitter();
    /** @internal */
    @Output() readonly _notifyRemoval: EventEmitter<{removedAnnouncement: string | null}> = new EventEmitter();
    /** @internal */
    _set: MdcChipSetDirective | null = null;
    private _checkmark: HTMLElement | null = null;
    private _leadingIcon: MdcChipIconDirective | null = null;
    private _trailingIcon: MdcChipIconDirective | null = null;
    /** @internal */
    @ContentChildren(MdcChipIconDirective, {descendants: true}) _icons?: QueryList<MdcChipIconDirective>;
    /** @internal */
    @ContentChildren(MdcChipTextDirective, {descendants: true}) _texts?: QueryList<MdcChipTextDirective>;
    /** @internal */
    @ContentChildren(MdcChipPrimaryActionDirective, {descendants: true}) _primaryActions?: QueryList<MdcChipPrimaryActionDirective>;
    /** @internal */
    @ContentChildren(MdcChipCellDirective) _chipCells?: QueryList<MdcChipCellDirective>;
    private _adapter: MDCChipAdapter = {
        addClass: (className: string) => {
            const hasClass = this._elm.nativeElement.classList.contains(className);
            this._renderer.addClass(this._elm.nativeElement, className);
            if (!hasClass && className === 'mdc-chip--selected') {
                this.selectedMem = true;
                this.selectedChange.emit(true);
            }
        },
        removeClass: (className: string) => {
            const hasClass = this._elm.nativeElement.classList.contains(className);
            this._renderer.removeClass(this._elm.nativeElement, className);
            if (hasClass && className === 'mdc-chip--selected') {
                this.selectedMem = false;
                this.selectedChange.emit(false);
            }
        },
        hasClass: (className) => this._elm.nativeElement.classList.contains(className),
        addClassToLeadingIcon: (className: string) => this._leadingIcon && this._renderer.addClass(this._leadingIcon._elm.nativeElement, className),
        removeClassFromLeadingIcon: (className: string) => this._leadingIcon && this._renderer.removeClass(this._leadingIcon._elm.nativeElement, className),
        eventTargetHasClass: (target: HTMLElement, className: string) => !!target && target.classList.contains(className),
        getAttribute: (attr: string) => this._elm.nativeElement.getAttribute(attr),
        notifyInteraction: () => this.interact.emit(),
        notifySelection: (selected: boolean, chipSetShouldIgnore: boolean) => {
            if (!chipSetShouldIgnore)
                this._selectedForChipSet.emit(selected);
        },
        notifyTrailingIconInteraction: () => this._trailingIcon!.interact.emit(),
        notifyRemoval: (removedAnnouncement: string | null) => this._notifyRemoval.emit({removedAnnouncement}),
        notifyNavigation: (key: string, source: EventSource) => this.navigation.emit({key, source: <number>source}),
        getComputedStyleValue: (propertyName: string) => getComputedStyle(this._elm.nativeElement).getPropertyValue(propertyName),
        setStyleProperty: (style: string, value: string) => this._renderer.setStyle(this._elm.nativeElement, style, value),
        hasLeadingIcon: () => !!this._leadingIcon,
        getRootBoundingClientRect: () => this._elm.nativeElement.getBoundingClientRect(),
        getCheckmarkBoundingClientRect: () => this._checkmark?.getBoundingClientRect() || null,
        setPrimaryActionAttr: (attr: string, value: string) => this._primaryAction && this._renderer.setAttribute(this._primaryAction._elm.nativeElement, attr, value),
        focusPrimaryAction: () => this._primaryAction?._elm.nativeElement.focus(),
        hasTrailingAction: () => !!this._trailingIcon,
        setTrailingActionAttr: (attr: string, value: string) => this._trailingIcon && this._renderer.setAttribute(this._trailingIcon._elm.nativeElement, attr, value),
        focusTrailingAction: () => this._trailingIcon?._elm.nativeElement.focus(),
        isRTL: () => getComputedStyle(this._elm.nativeElement).getPropertyValue('direction') === 'rtl'
    };
    /** @internal */
    _foundation: MDCChipFoundation = new MDCChipFoundation(this._adapter);

    constructor(private _elm: ElementRef, rndr: Renderer2, registry: MdcEventRegistry, @Inject(DOCUMENT) doc: any) {
        super(_elm, rndr, registry, doc as Document);
        this._uniqueValue = `mdc-chip-${MdcChipDirective.nextValue++}`;
    }

    ngAfterContentInit() {
        this.initActions();
        this.initIcons();
        this._icons!.changes.subscribe(() => this._reInit());
        this._texts!.changes.subscribe(() => this._reInit());
        this._primaryActions!.changes.subscribe(() => this._reInit());
        this._chipCells!.changes.subscribe(() => this._reInit());
        this.addRippleSurface('mdc-chip__ripple');
        this.initCheckMark();
        this.initRipple();
        this._foundation.init();
        if (this.selectedMem)
            // triggers setting the foundation selected state (and possibly for other [choice] chips too):
            this.selected = this.selectedMem;
        if (!this.removableMem)
            this._foundation.setShouldRemoveOnTrailingIconClick(this.removableMem);
        this.initialized = true;
    }

    ngOnDestroy() {
        this.destroyRipple();
        this._foundation.destroy();
    }

    /** @internal */
    _reInit() {
        // if icons have changed, the foundation must be reinitialized, because
        // trailingIconInteractionHandler might have to be removed and/or attached
        // to another icon:
        this._foundation.destroy();
        this._foundation = new MDCChipFoundation(this._adapter);
        this.initActions();
        this.initIcons();
        this.initCheckMark();
        this._foundation.init();
        if (!this.removableMem)
            this._foundation.setShouldRemoveOnTrailingIconClick(this.removableMem);
        // no need to call setSelected again, as the previous state will still be available via
        // the mdc-chip--selected class
    }

    private initActions() {
        if (this._set) {
            let role = 'button';
            if (this._set._type === 'choice')
                role = 'radio';
            else if (this._set._type === 'filter')
                role = 'checkbox';
            this._primaryActions!.forEach(action => {
                action.__role = role;
            });
        }
    }

    private initIcons() {
        let newLeading = this.computeLeadingIcon();
        let newTrailing = this.computeTrailingIcon(newLeading);
        if (newLeading !== this._leadingIcon || newTrailing !== this._trailingIcon) {
            this._leadingIcon = newLeading;
            this._trailingIcon = newTrailing;
            this._icons!.forEach(icon => {
                icon._chip = this;
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

    private get _text() {
        return this._texts?.first;
    }

    private get _primaryAction() {
        return this._primaryActions?.first;
    }

    private get _chipCell() {
        return this._chipCells?.first;
    }

    private computeLeadingIcon() {
        if (this._icons && this._icons.length > 0) {
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

    private computeTrailingIcon(leading: MdcChipIconDirective | null) {
        if (this._icons!.length > 0) {
            let icon = this._icons!.last;
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
        if (!this._checkmark && this._chipCell) {
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
            this._renderer.insertBefore(this._elm.nativeElement, this._checkmark, this._chipCell._elm.nativeElement);
        }
    }

    private removeCheckMark() {
        if (this._checkmark) {
            this._checkmark.parentElement!.removeChild(this._checkmark);
            this._checkmark = null;
        }
    }

    /**
     * The value the chip represents. The value must be unique for the `mdcChipSet`. If you do not provide a value
     * a unique value will be computed automatically.
     */
    @Input() get value(): string {
        return this._value ? this._value : this._uniqueValue;
    }

    set value(val: string) {
        this._value = val;
    }

    /**
     * The 'selected' state of the chip. Filter and choice chips are either selected or
     * not selected. Making a choice chip selected, will make all other chips in that set
     * not selected.
     */
    @Input() get selected(): boolean {
        return this.initialized ? this._foundation.isSelected() : this.selectedMem;
    }

    set selected(val: boolean) {
        let value = asBoolean(val);
        this.selectedMem = value;
        if (this.initialized && value !== this._foundation.isSelected())
            this._foundation.setSelected(value);
        // when not initialized the selectedChange will be emitted via the foundation after
        // initialization
    }

    static ngAcceptInputType_selected: boolean | '';

    /**
     * If set to a value other than `false`, clicking the trailing icon will animate the
     * chip out of view, and then emit the `remove` output.
     */
    @HostBinding('class.mdc-chip--deletable')
    @Input() get removable(): boolean {
        return this.initialized ? this._foundation.getShouldRemoveOnTrailingIconClick() : this.removableMem;
    }

    set removable(val: boolean) {
        let value = asBoolean(val);
        this.removableMem = value;
        if (this.initialized && value !== this._foundation.getShouldRemoveOnTrailingIconClick())
            this._foundation.setShouldRemoveOnTrailingIconClick(value);
        // when not initialized the removable change will be set on the foundation after
        // initialization
    }

    static ngAcceptInputType_removable: boolean | '';

    /** @docs-private */
    protected computeRippleBoundingRect() {
        return this._foundation.getDimensions();
    }

    /** @internal */
    @HostListener('click', ['$event']) _handleInteraction(event: MouseEvent) {
        this._foundation?.handleInteraction(event);
    }

    /** @internal */
    @HostListener('transitionend', ['$event']) _handleTransitionEnd(event: TransitionEvent) {
        this._foundation?.handleTransitionEnd(event);
    }

    /** @internal */
    @HostListener('keydown', ['$event']) _handleKeydown(event: KeyboardEvent) {
        this._foundation?.handleKeydown(event);
        this._foundation?.handleInteraction(event);
    }

    /** @internal */
    _untabbable() {
        if (this._primaryAction)
            this._primaryAction._tabindex = -1;
        if (this._trailingIcon)
            this._trailingIcon._tabindex = -1;
    }

    /** @internal */
    _allowtabbable() {
        let result = !!this._primaryAction && this._primaryAction._tabindex !== -1;
        if (result && this._trailingIcon)
            this._trailingIcon._tabindex = -1;
        if (!result)
            result = !!this._trailingIcon && this._trailingIcon._tabindex != null && this._trailingIcon._tabindex !== -1;
        return result;
    }

    /** @internal */
    _forceTabbable() {
        if (this._primaryAction)
            this._primaryAction._tabindex = 0;
        else if (this._trailingIcon)
            this._trailingIcon._tabindex = 0;
    }
}

/**
 * Directive for a chip-set (a collection of <code>mdcChip</code>).
 */
@Directive({
    selector: '[mdcChipSet]'
})
export class MdcChipSetDirective implements AfterContentInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-chip-set') readonly _cls = true;
    /** @internal */
    @HostBinding('attr.role') _role = 'grid';
    /** @internal */
    @ContentChildren(MdcChipDirective, {descendants: true}) _chips?: QueryList<MdcChipDirective>;
    private _subscriptions: Subscription[] = [];
    private _initialized = false;
    /** @internal */
    _type: 'choice' | 'filter' | 'input' | 'action' = 'action';
    /** @internal */
    _adapter: MDCChipSetAdapter = {
        hasClass: (className: string) => this._elm.nativeElement.classList.contains(className),
        removeChipAtIndex: (index: number) => {
            this.chip(index)!.remove.emit();
            // needed so that when focusChipTrailingActionAtIndex is called the
            // chip has already been removed from the DOM:
            this.cdRef.detectChanges();
        },
        selectChipAtIndex: (index: number, selected: boolean, shouldNotifyClients: boolean) => {
            this.chip(index)?._foundation.setSelectedFromChipSet(selected, shouldNotifyClients);
        },
        getIndexOfChipById: (chipValue) => this.findChipIndex(chipValue),
        focusChipPrimaryActionAtIndex: (index) => this.chip(index)?._foundation.focusPrimaryAction(),
        focusChipTrailingActionAtIndex: (index) => this.chip(index)?._foundation.focusTrailingAction(),
        removeFocusFromChipAtIndex: (index) => this.chip(index)?._foundation.removeFocus(),
        isRTL: () => getComputedStyle(this._elm.nativeElement).getPropertyValue('direction') === 'rtl',
        getChipListCount: () => this._chips!.length,
        announceMessage: (message: string) => announce(message)
    };
    /** @internal */
    _foundation: MDCChipSetFoundation | null = new MDCChipSetFoundation(this._adapter);

    constructor(private _elm: ElementRef, private cdRef: ChangeDetectorRef) {}

    ngAfterContentInit() {
        this._chips!.changes.subscribe(() => {
            this.initSubscriptions();
            this.initChips();
            this.cdRef.detectChanges();
        });
        this.initSubscriptions();
        this.initChips();
        this._foundation!.init();
        this._initialized = true;
        this.cdRef.detectChanges();
    }

    ngOnDestroy() {
        this._foundation?.destroy();
        this._foundation = null;
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

    set mdcChipSet(value: 'choice' | 'filter' | 'input' | 'action') {
        if (value !== this._type) {
            if (value === 'choice' || value === 'filter' || value ==='input')
                this._type = value;
            else
                this._type = 'action';
            if (this._initialized)
                this.initChips(true);
        }
    }

    static ngAcceptInputType_mdcChipSet: 'choice' | 'filter' | 'input' | 'action' | '';

    private initChips(force = false) {
        let hasTabbableItem = false;
        this._chips!.forEach(chip => {
            if (force || chip._set !== this) {        
                chip._set = this;
                chip._reInit();
            }
            if (hasTabbableItem)
                chip._untabbable();
            else
                hasTabbableItem = chip._allowtabbable();
        });
        if (!hasTabbableItem && this._chips!.length > 0)
            this._chips!.first!._forceTabbable();
    }

    private destroySubscriptions() {
        try {
            this._subscriptions.forEach(sub => sub.unsubscribe());
        } finally {
            this._subscriptions = [];
        }
    }

    private initSubscriptions() {
        this.destroySubscriptions();
        this._subscriptions = [];
        this._chips!.forEach(chip => {
            this._subscriptions!.push(chip.interact.subscribe(() => this._foundation!.handleChipInteraction({chipId: chip.value})));
            this._subscriptions!.push(chip._selectedForChipSet.subscribe((selected: boolean) =>
                this._foundation!.handleChipSelection({chipId: chip.value, selected, shouldIgnore: false})));
            this._subscriptions!.push(chip._notifyRemoval.subscribe(({removedAnnouncement}: {removedAnnouncement: string | null}) =>
                this._foundation!.handleChipRemoval({chipId: chip.value, removedAnnouncement})));
            this._subscriptions!.push(chip.navigation.subscribe(({key, source}: {key: string, source: EventSource}) =>
                this._foundation!.handleChipNavigation({chipId: chip.value, key, source})));
        });
    }

    private chip(index: number) {
        if (index < 0 || index >= this._chips!.length)
            return null;
        return this._chips!.toArray()[index];
    }

    private findChipIndex(chipValue: any): number {
        return this._chips!.toArray().findIndex(chip => chip.value === chipValue);
    }

    /** @internal */
    @HostBinding('class.mdc-chip-set--choice') get _choice() {
        return this._type === 'choice';
    }

    /** @internal */
    @HostBinding('class.mdc-chip-set--filter') get _filter() {
        return this._type === 'filter';
    }

    /** @internal */
    @HostBinding('class.mdc-chip-set--input') get _input() {
        return this._type === 'input';
    }
}

export const CHIP_DIRECTIVES = [
    MdcChipIconDirective,
    MdcChipTextDirective,
    MdcChipPrimaryActionDirective,
    MdcChipCellDirective,
    MdcChipDirective,
    MdcChipSetDirective
];
