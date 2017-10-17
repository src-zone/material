import { AfterContentInit, ContentChild, ContentChildren, forwardRef, QueryList, Directive, ElementRef, HostBinding, HostListener,
  Input, OnDestroy, Optional, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MDCSnackbarFoundation  } from '@material/snackbar';
import { getCorrectEventName } from '@material/animation';
import { MdcSnackbarAdapter } from './mdc.snackbar.adapter';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { SnackbarMessage } from './snackbar.message';

@Directive({
    selector: '[mdcSnackbarText]'
})
export class MdcSnackbarTextDirective {
    @HostBinding('class.mdc-snackbar__text') _cls = true;

    constructor(public _elm: ElementRef) {
    }
}

@Directive({
    selector: '[mdcSnackbarAction]'
})
export class MdcSnackbarActionDirective {
    @HostBinding('class.mdc-snackbar__action-wrapper') _cls = true;

    constructor(public _elm: ElementRef) {
    }
}

@Directive({
    selector: '[mdcSnackbar]'
})
export class MdcSnackbarDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-snackbar') _hostClass = true;
    @ContentChild(MdcSnackbarTextDirective) text: MdcSnackbarTextDirective;
    @ContentChild(MdcSnackbarActionDirective) action: MdcSnackbarActionDirective;

    private mdcAdapter: MdcSnackbarAdapter = {
        addClass: (className: string) => {
            this.renderer.addClass(this.root.nativeElement, className);
        },
        removeClass: (className: string) => {
            this.renderer.removeClass(this.root.nativeElement, className);
        },
        setAriaHidden: () => {
            this.renderer.setAttribute(this.root.nativeElement, 'aria-hidden', 'true');
        },
        unsetAriaHidden: () => {
            this.renderer.removeAttribute(this.root.nativeElement, 'aria-hidden');
        },
        setActionAriaHidden: () => {
            if (this.action)
                this.renderer.setAttribute(this.action._elm.nativeElement, 'aria-hidden', 'true');
        },
        unsetActionAriaHidden: () => {
            if (this.action)
                this.renderer.removeAttribute(this.action._elm.nativeElement, 'aria-hidden');
        },
        setActionText: (actionText: string) => {
            if (this.action)
                this.action._elm.nativeElement.textContent = actionText;
        },
        setMessageText: (message: string) => {
            if (this.text)
                this.text._elm.nativeElement.textContent = message;
        },
        setFocus: () => {
            // TODO
        },
        visibilityIsHidden: () => false, // TODO
        registerCapturedBlurHandler: (handler: EventListener) => {
            // TODO
        },
        deregisterCapturedBlurHandler: (handler: EventListener) => void {
            // TODO
        },
        registerVisibilityChangeHandler: (handler: EventListener) => {
            // TODO
        },
        deregisterVisibilityChangeHandler: (handler: EventListener) => {
            // TODO
        },
        registerCapturedInteractionHandler: (evtType: string, handler: EventListener) => {
            // TODO
        },
        deregisterCapturedInteractionHandler: (evtType: string, handler: EventListener) =>  {
            // TODO
        },
        registerActionClickHandler: (handler: EventListener) => {
            if (this.action)
                this.registry.listen(this.renderer, 'click', handler, this.action._elm);
        },
        deregisterActionClickHandler: (handler: EventListener) => {
            this.registry.unlisten('click', handler);
        },
        registerTransitionEndHandler: (handler: EventListener) => {
            this.registry.listen(this.renderer, getCorrectEventName(window, 'transitionend'), handler, this.root);
        },
        deregisterTransitionEndHandler: (handler: EventListener) => {
            this.registry.unlisten(getCorrectEventName(window, 'transitionend'), handler);
        }
    };
    private foundation: { init: Function, destroy: Function, show: (message: SnackbarMessage) => void }
            = new MDCSnackbarFoundation(this.mdcAdapter);

    constructor(private renderer: Renderer2, private root: ElementRef, private registry: MdcEventRegistry) {
    }

    ngAfterContentInit() {
        this.foundation.init();
    }

    ngOnDestroy() {
        this.foundation.destroy();
    }

    show(message: SnackbarMessage) {
        this.foundation.show(message);
    }
}
