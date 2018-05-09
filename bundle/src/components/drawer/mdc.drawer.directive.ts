import { AfterContentInit, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef,
    HostBinding, Input, OnDestroy, Output, QueryList, Renderer2 } from '@angular/core';
import { FOCUSABLE_ELEMENTS, MDCSlidableDrawerFoundation } from '@material/drawer/slidable';
import { MDCPersistentDrawerFoundation, MDCTemporaryDrawerFoundation, util } from '@material/drawer';
import { MdcSlidableDrawerAdapter } from './mdc.slidable.drawer.adapter';
import { MdcPersistentDrawerAdapter } from './mdc.persistent.drawer.adapter';
import { MdcTemporaryDrawerAdapter } from './mdc.temporary.drawer.adapter';
import { AbstractDrawerElement, MdcDrawerType } from '../abstract/abstract.mdc.drawer.element';
import { asBoolean, asBooleanOrNull } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * A toolbar spacer is an optional first child of an <code>mdcDrawer</code>.
 * A toolbar spacer adds space to the drawer in the same amount of the space that the toolbar takes up in your application.
 * This is useful for visual alignment and consistency. Note that you can place content inside the toolbar spacer.
 */
@Directive({
    selector: '[mdcDrawerToolbarSpacer]',
    providers: [{provide: AbstractDrawerElement, useExisting: forwardRef(() => MdcDrawerToolbarSpacerDirective) }]
})
export class MdcDrawerToolbarSpacerDirective extends AbstractDrawerElement {
    constructor() {
        super();
    }

    @HostBinding('class.mdc-permanent-drawer__toolbar-spacer') get _isPermanent() {
        return this._drawerType === 'permanent';
    }

    @HostBinding('class.mdc-persistent-drawer__toolbar-spacer') get _isPersistent() {
        return this._drawerType === 'persistent';
    }

    @HostBinding('class.mdc-temporary-drawer__toolbar-spacer') get _isTemporary() {
        return this._drawerType === 'temporary';
    }
}

/**
 * A toolbar header is an optional first child of an <code>mdcDrawer</code>.
 * A toolbar header adds space to create a 16:9 drawer header.
 * It's often used for user account selection or profile information.
 * </p><p>
 * To place content inside a toolbar header, add a child element with the
 * <code>mdcDrawerHeaderContent</code> directive.
 */
@Directive({
    selector: '[mdcDrawerHeader]',
    providers: [{provide: AbstractDrawerElement, useExisting: forwardRef(() => MdcDrawerHeaderDirective) }]
})
export class MdcDrawerHeaderDirective extends AbstractDrawerElement {
    constructor() {
        super();
    }

    @HostBinding('class.mdc-permanent-drawer__header') get _isPermanent() {
        return this._drawerType === 'permanent';
    }

    @HostBinding('class.mdc-persistent-drawer__header') get _isPersistent() {
        return this._drawerType === 'persistent';
    }

    @HostBinding('class.mdc-temporary-drawer__header') get _isTemporary() {
        return this._drawerType === 'temporary';
    }
}

/**
 * Directive for the content of a drawer header. This should be the child of an
 * <code>mdcDrawerHeader</code> directive. The content of the header will be bottom
 * aligned.
 */
@Directive({
    selector: '[mdcDrawerHeaderContent]',
    providers: [{provide: AbstractDrawerElement, useExisting: forwardRef(() => MdcDrawerHeaderContentDirective) }]
})
export class MdcDrawerHeaderContentDirective extends AbstractDrawerElement {
    constructor() {
        super();
    }

    @HostBinding('class.mdc-permanent-drawer__header-content') get _isPermanent() {
        return this._drawerType === 'permanent';
    }

    @HostBinding('class.mdc-persistent-drawer__header-content') get _isPersistent() {
        return this._drawerType === 'persistent';
    }

    @HostBinding('class.mdc-temporary-drawer__header-content') get _isTemporary() {
        return this._drawerType === 'temporary';
    }
}

/**
 * Directive for the drawer content. You would typically also apply the <code>mdcList</code>
 * or <code>mdcListGroup</code> directive to the drawer content (see the examples).
 */
@Directive({
    selector: '[mdcDrawerContent]',
    providers: [{provide: AbstractDrawerElement, useExisting: forwardRef(() => MdcDrawerContentDirective) }]    
})
export class MdcDrawerContentDirective extends AbstractDrawerElement {
    constructor() {
        super();
    }

    @HostBinding('class.mdc-permanent-drawer__content') get _isPermanent() {
        return this._drawerType === 'permanent';
    }

    @HostBinding('class.mdc-persistent-drawer__content') get _isPersistent() {
        return this._drawerType === 'persistent';
    }

    @HostBinding('class.mdc-temporary-drawer__content') get _isTemporary() {
        return this._drawerType === 'temporary';
    }
}

/**
 * A standalone <code>mdcDrawer</code> is a <i>permanent</i> drawer. A <i>permanent</i>
 * drawer is always open, sitting to the side of the content. It is appropriate for any
 * display size larger than mobile.
 * </p><p>
 * To make a drawer that can be opened/closed, wrap the <code>mdcDrawer</code> inside an
 * <code>mdcDrawerContainer</code>. That makes the drawer a <i>persistent</i> or
 * <i>temporary</i> drawer. See <code>MdcDrawerContainerDirective</code> for more information.
 */
@Directive({
    selector: '[mdcDrawer]',
    providers: [{provide: AbstractDrawerElement, useExisting: forwardRef(() => MdcDrawerDirective) }]
})
export class MdcDrawerDirective implements AfterContentInit {
    private initialized = false;
    private type: MdcDrawerType = 'permanent';
    @ContentChildren(AbstractDrawerElement, {descendants: true}) _children: QueryList<AbstractDrawerElement>;

    constructor(public _elm: ElementRef) {
    }

    ngAfterContentInit() {
        this.initialized = true;
        this.updateTypeForChildren();
        this._children.changes.subscribe(() => {
            this.updateTypeForChildren();
        });
    }

    private updateTypeForChildren() {
        if (this.initialized) {
            this._children.forEach(child => {
                child._drawerType = this.type;
            });
        }
    }

    _setType(drawerType: MdcDrawerType) {
        this.type = drawerType;
        this.updateTypeForChildren();
    }

    @HostBinding('class.mdc-permanent-drawer') get _isPermanent() {
        return this.type === 'permanent';
    }

    @HostBinding('class.mdc-persistent-drawer__drawer') get _isPersistent() {
        return this.type === 'persistent';
    }

    @HostBinding('class.mdc-temporary-drawer__drawer') get _isTemporary() {
        return this.type === 'temporary';
    }
}

/**
 * Wrap an <code>mdcDrawer</code> inside a <code>mdcDrawerContainer</code> to make it a
 * persistent or temporary drawer. Persistent and temporary drawers are slideable: they
 * can be opened or closed by the user, or by code.
 */
@Directive({
    selector: '[mdcDrawerContainer]'
})
export class MdcDrawerContainerDirective implements AfterContentInit, OnDestroy {
    private initialized = false;
    private openMem: boolean;
    private mdcAdapter: MdcSlidableDrawerAdapter;
    @ContentChildren(MdcDrawerDirective) _drawers: QueryList<MdcDrawerDirective>;
    /**
     * Event emitted when the drawer is opened or closed. The event value will be
     * <code>true</code> when the drawer is opened, and <code>false</code> when the
     * drawer is closed.
     */
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    private type: 'persistent' | 'temporary' = 'persistent';
    private foundation: {
        init(),
        destroy(),
        open(),
        close(),
        isOpen(): boolean
    };

    constructor(protected _elm: ElementRef, protected _rndr: Renderer2, protected _registry: MdcEventRegistry) {}

    ngAfterContentInit() {
        this.initialized = true;
        this.updateType();
        this.initDrawer();
        this._drawers.changes.subscribe(() => {
            this.updateType();
        });
    }

    ngOnDestroy() {
        this.destroyDrawer();
    }

    private updateType() {
        if (this.initialized)
            this.forDrawer((d) => {d._setType(this.type); });
    }

    private destroyDrawer() {
        if (this.foundation) {
            this.openMem = this.foundation.isOpen();
            this.foundation.destroy();
            this.foundation = null;
        }
    }

    private initDrawer() {
        if (this.initialized) {
            this.destroyDrawer();
            if (this.hasNecessaryDom()) {
                this.createAdapter();
                let newFoundation = this.type === 'temporary' ?
                    new MDCTemporaryDrawerFoundation(this.mdcAdapter) :
                    new MDCPersistentDrawerFoundation(this.mdcAdapter);
                // first init, then assign to this.foundation, so that
                // this.openMem is used to detect the open state, instead
                // of the new foundation (which would never be opened otherwise):
                newFoundation.init();
                this.open = this.openMem;
                this.foundation = newFoundation;
            } else
                console.error('mdcDrawerContainer can\'t be constructed because of missing DOM elements');
        }
    }

    private createAdapter() {
        let adapter: MdcPersistentDrawerAdapter | MdcTemporaryDrawerAdapter = {
            addClass: (className) => {
                if (!/^mdc-.*-drawer--open$/.test(className)) // *--open is tracked by HostBinding
                    this._rndr.addClass(this._elm.nativeElement, className);
            },
            removeClass: (className) => {
                if (!/^mdc-.*-drawer--open$/.test(className)) // *--open is tracked by HostBinding
                    this._rndr.removeClass(this._elm.nativeElement, className);
            },
            hasClass: (className) => {
                if (/^mdc-.*-drawer$/.test(className)) 
                    return true;
                else if (/^mdc-.*-drawer--open$/.test(className))
                    return this.open;
                else
                    return this._elm.nativeElement.classList.contains(className)
            },
            hasNecessaryDom: () => this.hasNecessaryDom(),
            registerInteractionHandler: (evt, handler) => this._registry.listen(this._rndr, util.remapEvent(evt), handler, this._elm, util.applyPassive()),
            deregisterInteractionHandler: (evt, handler) => this._registry.unlisten(util.remapEvent(evt), handler),
            registerDrawerInteractionHandler: (evt, handler) => this._registry.listen(this._rndr, util.remapEvent(evt), handler, this.drawer._elm),
            deregisterDrawerInteractionHandler: (evt, handler) => this._registry.unlisten(util.remapEvent(evt), handler),
            registerTransitionEndHandler: (handler) => this._registry.listen(this._rndr, 'transitionend', handler, this._elm),
            deregisterTransitionEndHandler: (handler) => this._registry.unlisten('transitionend', handler),
            registerDocumentKeydownHandler: (handler) => this._registry.listenElm(this._rndr, 'keydown', handler, document),
            deregisterDocumentKeydownHandler: (handler) => this._registry.unlisten('keydown', handler),
            setTranslateX: (value) => this.forDrawer((d) => {
                return d._elm.nativeElement.style.setProperty(util.getTransformPropertyName(),
                    value === null ? null : `translateX(${value}px)`);
            }),
            getFocusableElements: () => this.forDrawer((d) => {
                return d._elm.nativeElement.querySelectorAll(FOCUSABLE_ELEMENTS);
            }),
            saveElementTabState: (el) => util.saveElementTabState(el),
            restoreElementTabState: (el) => util.restoreElementTabState(el),
            makeElementUntabbable: (el: HTMLElement) => el.tabIndex = -1,
            notifyOpen: () => this.openChange.emit(true),
            notifyClose: () => this.openChange.emit(false),
            isRtl: () => getComputedStyle(this._elm.nativeElement).getPropertyValue('direction') === 'rtl',
            getDrawerWidth: () => this.forDrawer((d) => d._elm.nativeElement.offsetWidth, 0),
            isDrawer: (el: Element) => (this.drawer && this.drawer._elm.nativeElement === el),

            // for the temporary drawer:
            addBodyClass: (className: string) => {this._rndr.addClass(document.body, className); },
            removeBodyClass: (className: string) => {this._rndr.removeClass(document.body, className); },
            updateCssVariable: (value: string) => {
                if (util.supportsCssCustomProperties())
                    this._elm.nativeElement.style.setProperty(MDCTemporaryDrawerFoundation.strings.OPACITY_VAR_NAME, value);
            },
            eventTargetHasClass: (target: HTMLElement, className: string) => {
                if (target === this._elm.nativeElement && this.type === 'temporary' && className === 'mdc-temporary-drawer')
                    // make sure this returns true even if class HostBinding is not effectuated yet:
                    return true;
                return target.classList.contains(className);
            }
        };
        this.mdcAdapter = adapter;
    }

    private hasNecessaryDom() {
        return this.drawer != null;
    }

    private get drawer(): MdcDrawerDirective {
        if (this._drawers && this._drawers.length > 0)
                return this._drawers.first;
        return null;
    }

    private forDrawer<T>(func: (drawer: MdcDrawerDirective) => T, defaultVal: T = null) {
        let theDrawer = this.drawer;
        return theDrawer ? func(theDrawer) : defaultVal;
    }

    /**
     * Set the type of drawer. Either <code>persistent</code> or <code>temporary</code>.
     * The default (when no value given) is <code>persistent</code>. Please note that
     * a third type of drawer exists: the <code>permanent</code> drawer. But a permanent
     * drawer is created by not wrapping your <code>mdcDrawer</code> in a
     * <code>mdcDrawerContainer</code>.
     */
    @Input() get mdcDrawerContainer(): 'persistent' | 'temporary' | null {
        return this.type;
    }

    set mdcDrawerContainer(value: 'persistent' | 'temporary' | null) {
        if (value !== 'persistent' && value !== 'temporary')
            value = 'persistent';
        if (value !== this.type) {
            this.type = value;
            this.updateType();
            this.initDrawer();
        }
    }

    @HostBinding('class.mdc-persistent-drawer') get _isPersistent() {
        return this.type === 'persistent';
    }

    @HostBinding('class.mdc-temporary-drawer') get _isTemporary() {
        return this.type === 'temporary';
    }

    @HostBinding('class.mdc-persistent-drawer--open') get _isPersistentOpen() {
        return this.type === 'persistent' && this.open;
    }

    @HostBinding('class.mdc-temporary-drawer--open') get _isTemporaryOpen() {
        return this.type === 'temporary' && this.open;
    }

    /**
     * Input to open (assign value <code>true</code>) or close (assign value <code>false</code>)
     * the drawer.
     */
    @Input() get open() {
        return this.foundation ? this.foundation.isOpen() : this.openMem;
    }

    set open(value: any) {
        let newValue = asBoolean(value);
        if (newValue !== this.open) {
            this.openMem = newValue;
            if (this.foundation) {
                if (newValue)
                    this.foundation.open();
                else
                    this.foundation.close();
            } else
                this.openChange.emit(newValue);
        }
    }
}
