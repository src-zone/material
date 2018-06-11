import { AfterContentInit, Directive, ElementRef, HostBinding, OnDestroy, Renderer2 } from '@angular/core';
import { MDCNotchedOutlineFoundation } from '@material/notched-outline';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';
import { MdcNotchedOutlineAdapter } from './mdc.notched-outline.adapter';
import { AbstractMdcRipple } from '../ripple/abstract.mdc.ripple';

/** @docs-private */
export class NotchedOutlineSupport {
    private _initialized = false;
    private path: SVGPathElement;
    private _outline: HTMLElement;
    private _outlineIdle: HTMLElement;
    private _adapter: MdcNotchedOutlineAdapter = {
        getWidth: () => this._outline.offsetWidth,
        getHeight: () => this._outline.offsetHeight,
        addClass: (className: string) => this._rndr.addClass(this._outline, className),
        removeClass: (className: string) => this._rndr.removeClass(this._outline, className),
        setOutlinePathAttr: (value: string) => this._rndr.setAttribute(this.path, 'd', value), //, 'svg'),
        getIdleOutlineStyleValue: (propertyName: string) => window.getComputedStyle(this._outlineIdle).getPropertyValue(propertyName)
    }
    private _foundation: {
        init(): void,
        destroy(): void,
        notch(notchWidth: number, isRtl: boolean): void,
        closeNotch(): void,
        updateSvgPath(notchWidth: number, isRtl: boolean): void
    };

    constructor(private _elm: ElementRef, private _rndr: Renderer2) {
    }

    get foundation() {
        return this._foundation;
    }

    init() {
        if (this._foundation == null) {
            let path = this._rndr.createElement('path', 'svg');
            this._rndr.addClass(path, 'mdc-notched-outline__path');
            let svg = this._rndr.createElement('svg', 'svg');        
            this._rndr.appendChild(svg, path);
            this._rndr.appendChild(this._elm.nativeElement, svg);
            let outline = this._rndr.createElement('div');
            this._rndr.addClass(outline, 'mdc-notched-outline');
            this._rndr.appendChild(outline, svg);

            let outlineIdle = this._rndr.createElement('div');
            this._rndr.addClass(outlineIdle, 'mdc-notched-outline__idle');

            this._rndr.appendChild(this._elm.nativeElement, outline);
            this._rndr.appendChild(this._elm.nativeElement, outlineIdle);
            
            this._outline = outline;
            this._outlineIdle = outlineIdle;
            this.path = path;
            this._foundation = new MDCNotchedOutlineFoundation(this._adapter);
            this._foundation.init();
        }
    }

    destroy() {
        if (this._foundation != null) {
            try {
                this._foundation.destroy();
                this._rndr.removeChild(this._elm.nativeElement, this._outlineIdle);
                this._rndr.removeChild(this._elm.nativeElement, this._outline);
            } finally {
                this._outline = null;
                this._outlineIdle = null;
                this.path = null;
                this._foundation = null;
            }
        }
    }
}
