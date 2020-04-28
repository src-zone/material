import { ElementRef, Renderer2, HostListener } from '@angular/core';
import { MDCRippleFoundation, MDCRippleAdapter, util } from '@material/ripple';
import { applyPassive } from '@material/dom/events';
import { matches } from '@material/dom/ponyfill';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { SpecificEventListener } from '@material/base/types';

/** @docs-private */
export abstract class AbstractMdcRipple {
    private mdcRippleAdapter: MDCRippleAdapter = {
        browserSupportsCssVars: () => util.supportsCssVariables(window),
        isUnbounded: () => this._unbounded,
        isSurfaceActive: () => this.isRippleSurfaceActive(),
        isSurfaceDisabled: () => this.isRippleSurfaceDisabled(),
        addClass: (className: string) => this.addClassToRipple(className),
        removeClass: (className: string) => this.removeClassFromRipple(className),
        containsEventTarget: (target: EventTarget | null) => this._rippleElm.nativeElement.contains(target),
        registerInteractionHandler: (type: string, handler: EventListener) => {
            if (this.getRippleInteractionElement())
                this._registry.listenElm(this._renderer, type, handler, this.getRippleInteractionElement().nativeElement, applyPassive());
        },
        deregisterInteractionHandler: (type: string, handler: EventListener) => {
            this._registry.unlisten(type, handler);
        },
        registerDocumentInteractionHandler: (type: string, handler: EventListener) => this._registry.listenElm(this._renderer, type, handler, document, applyPassive()),
        deregisterDocumentInteractionHandler: (type: string, handler: EventListener) => this._registry.unlisten(type, handler),
        registerResizeHandler: (handler:  SpecificEventListener<'resize'>) => {
            this._registry.listenElm(this._renderer, 'resize', handler, window);
        },
        deregisterResizeHandler: (handler: SpecificEventListener<'resize'>) => {
            this._registry.unlisten('resize', handler);
        },
        updateCssVariable: (name: string, value: string) => { this._rippleElm.nativeElement.style.setProperty(name, value); },
        computeBoundingRect: () => this.computeRippleBoundingRect(),
        getWindowPageOffset: () => ({x: window.pageXOffset, y: window.pageYOffset})
    }

    protected _rippleFoundation: MDCRippleFoundation;
    private _unbounded = false;
    private _rippleSurface: HTMLElement | null = null;

    constructor(protected _rippleElm: ElementRef, protected _renderer: Renderer2, protected _registry: MdcEventRegistry) {}

    protected initRipple(unbounded = false) {
        if (this._rippleFoundation)
            throw new Error('initRipple() is called multiple times');
        this._unbounded = unbounded;
        this._rippleFoundation = new MDCRippleFoundation(this.mdcRippleAdapter);
        this._rippleFoundation.init();
    }

    protected destroyRipple() {
        if (this._rippleFoundation) {
            this._rippleFoundation.destroy();
            this._rippleFoundation = null;
        }
    }

    protected reinitRipple() {
        if (this._rippleFoundation) {
            this.destroyRipple();
            this.initRipple(this._unbounded);
        }
    }

    protected isRippleInitialized() {
        return this._rippleFoundation != null;
    }

    protected addRippleSurface(clazz, firstElement = false) {
        this.destroyRippleSurface();
        this._rippleSurface = this._renderer.createElement('div');
        this._renderer.addClass(this._rippleSurface, clazz);
        if (firstElement && this._rippleElm.nativeElement.children.length > 0) {
            const firstChild = this._rippleElm.nativeElement.children.item(0);
            this._renderer.insertBefore(this._rippleElm.nativeElement, this._rippleSurface, firstChild);
        } else
            this._renderer.appendChild(this._rippleElm.nativeElement, this._rippleSurface);
        return this._rippleSurface;
    }

    protected destroyRippleSurface() {
        if (this._rippleSurface) {
            this._renderer.removeChild(this._rippleElm.nativeElement, this._rippleSurface);
            this._rippleSurface = null;
        }
    }

    activateRipple() {
        if (this._rippleFoundation)
            this._rippleFoundation.activate();
    }

    deactivateRipple() {
        if (this._rippleFoundation)
            this._rippleFoundation.deactivate();
    }

    layout() {
        if (this._rippleFoundation)
            this._rippleFoundation.layout();
    }

    protected getRippleInteractionElement() {
        return this._rippleElm;
    }

    protected isRippleUnbounded(): boolean {
        return this._unbounded;
    }

    protected setRippleUnbounded(value: boolean) {
        if (!!value !== this._unbounded) {
            this._unbounded = !!value;
            // despite what the documentation seems to indicate, you can't
            // just change the unbounded property of an already initialized
            // ripple. The initialization registers different handlers, and won't
            // change those registrations when you change the unbounded property.
            // Hence we destroy and re-init the whole thing:
            this.reinitRipple();
        }
    }

    protected isRippleSurfaceActive() {
        let interactionElm = this.getRippleInteractionElement();
        return !!interactionElm && this.isActiveElement(interactionElm.nativeElement);
    }

    protected isActiveElement(element: HTMLElement) {
        return element == null ? false : matches(element, ':active');
    }

    protected isRippleSurfaceDisabled() {
        let interactionElm = this.getRippleInteractionElement();
        return !!interactionElm && !!interactionElm.nativeElement.attributes.getNamedItem('disabled');
    }

    protected addClassToRipple(name: string) {
        this._renderer.addClass(this._rippleElm.nativeElement, name);
    }

    protected removeClassFromRipple(name: string) {
        this._renderer.removeClass(this._rippleElm.nativeElement, name);
    }

    protected computeRippleBoundingRect() {
        return this._rippleElm.nativeElement.getBoundingClientRect();
    }

    @HostListener('focusin') onFocus() {
        if (this._rippleFoundation)
            this._rippleFoundation.handleFocus();
    }

    @HostListener('focusout') onBlur() {
        if (this._rippleFoundation)
            this._rippleFoundation.handleBlur();
    }
}
