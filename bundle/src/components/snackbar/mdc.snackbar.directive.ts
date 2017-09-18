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
    @HostBinding('class.mdc-snackbar__text') hasHostClass = true;

    constructor(public elementRef: ElementRef) {
    }
}

@Directive({
    selector: '[mdcSnackbarAction]'
})
export class MdcSnackbarActionDirective {
    @HostBinding('class.mdc-snackbar__action-wrapper') hasHostClass = true;

    constructor(public elementRef: ElementRef) {
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
        setMessageText: (message: string) => {
            if (this.text)
                this.text.elementRef.nativeElement.textContent = message;
        },
        setActionText: (actionText: string) => {
            if (this.action)
                this.action.elementRef.nativeElement.textContent = actionText;
        },
        setActionAriaHidden: () => {
            if (this.action)
                this.renderer.setAttribute(this.action.elementRef.nativeElement, 'aria-hidden', 'true');
        },
        unsetActionAriaHidden: () => {
            if (this.action)
                this.renderer.removeAttribute(this.action.elementRef.nativeElement, 'aria-hidden');
        },
        registerActionClickHandler: (handler: EventListener) => {
            if (this.action)
                this.registry.listen(this.renderer, 'click', handler, this.action.elementRef);
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
