import { AfterContentInit, Directive, ElementRef, HostBinding, HostListener, Input,
    OnDestroy, Renderer2, forwardRef } from '@angular/core';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { AbstractMdcIcon } from './abstract.mdc.icon';
import { asBoolean } from '../../utils/value.utils';

@Directive({
    selector: '[mdcIcon]',
    providers: [{provide: AbstractMdcIcon, useExisting: forwardRef(() => MdcIconDirective) }]
})
export class MdcIconDirective extends AbstractMdcIcon implements AfterContentInit, OnDestroy {
    // We're reusing the icon-toggle classes. Not nice, but this directive is just there
    // until MCW has support for proper icon buttons anyway:
    @HostBinding('class.mdc-icon-toggle') _hostClass = true;
    private _disabled = false;

    constructor(_elm: ElementRef, renderer: Renderer2, registry: MdcEventRegistry) {
        super(_elm, renderer, registry);
    }

    ngAfterContentInit() {
        this.initRipple();
    }

    ngOnDestroy() {
        this.destroyRipple();
    }

    @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
        let code = e.keyCode || e.which;
        // pass enter & space keypresses onto the click event handlers:
        if (code === 32 || code === 13)
            this._elm.nativeElement.click();
    }

    /**
     * To disable the icon, set this input to true.
     */
    @Input()
    // Reusing icon-toggle styling, see remarks for _hostClass:
    @HostBinding('class.mdc-icon-toggle--disabled')
    get disabled() {
        return this._disabled;
    }

    set disabled(value: any) {
        this._disabled = asBoolean(value);
    }

    protected isRippleUnbounded() {
        return true;
    }
}
