import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, Renderer2 } from '@angular/core';
import { MDCLinearProgressFoundation, MDCLinearProgressAdapter } from '@material/linear-progress';
import { asBoolean } from '../../utils/value.utils';

const CLASS_INDETERMINATE = 'mdc-linear-progress--indeterminate';
const CLASS_REVERSED = 'mdc-linear-progress--reversed';

/**
 * Directive for creating a Material Design linear progress indicator.
 * The current implementation will add and manage all DOM child elements that
 * are required for the wrapped <code>mdc-linear-progress</code> component.
 * Future implementations will also support supplying (customized)
 * DOM children.
 */
@Directive({
    selector: '[mdcLinearProgress]'
})
export class MdcLinearProgressDirective implements AfterContentInit, OnDestroy {
    @HostBinding('class.mdc-linear-progress') _cls = true;
    @HostBinding('attr.role') _role: string = 'progressbar';
    @HostBinding('attr.aria-valuemin') _min = 0;
    @HostBinding('attr.aria-valuemax') _max = 1;
    @HostBinding('class.' + CLASS_INDETERMINATE) _indeterminate = false;
    @HostBinding('class.' + CLASS_REVERSED) _reverse = false;
    private _progress = 0;
    private _buffer = 1;
    private _closed = false;
    private _elmBuffer: HTMLElement | null = null;
    private _elmPrimaryBar: HTMLElement | null = null;
    /**
     * Label indicationg how the progress bar should be announced to the user.
     * Determines the ària-label` attribute value.
     */
    @HostBinding('attr.aria-label') @Input() label: string | null = null;

    private mdcAdapter: MDCLinearProgressAdapter = {
        addClass: (className: string) => {
            if (className !== CLASS_INDETERMINATE && className != CLASS_REVERSED)
                this._rndr.addClass(this._root.nativeElement, className);
        },
        getPrimaryBar: () => this._elmPrimaryBar,
        getBuffer: () => this._elmBuffer,
        hasClass: (className: string) => {
            if (className === CLASS_INDETERMINATE)
                return this._indeterminate;
            if (className === CLASS_REVERSED)
                return this._reverse;
            return this._root.nativeElement.classList.contains(className);
        },
        removeClass: (className: string) => {
            if (className !== CLASS_INDETERMINATE && className != CLASS_REVERSED)
                this._rndr.removeClass(this._root.nativeElement, className);
        },
        setStyle: (el, styleProperty, value) => {
            this._rndr.setStyle(el, styleProperty, value);
        },
        forceLayout: () => this._root.nativeElement.offsetWidth,
        removeAttribute: (name) => this._rndr.removeAttribute(this._root.nativeElement, name),
        setAttribute: (name, value) => this._rndr.setAttribute(this._root.nativeElement, name, value)
    };
    private foundation: MDCLinearProgressFoundation | null = null;

    constructor(private _rndr: Renderer2, private _root: ElementRef) {
    }

    ngAfterContentInit() {
        this.initElements();
        this.foundation = new MDCLinearProgressFoundation(this.mdcAdapter);
        this.foundation.init();
        this.foundation.setProgress(this._progress);
        this.foundation.setBuffer(this._buffer);
        if (this._closed)
            this.foundation.close();
    }

    ngOnDestroy() {
        this.foundation?.destroy();
        this._elmPrimaryBar = null;
        this._elmBuffer = null;
    }

    private initElements() {
        this.addElement(this._root.nativeElement, 'div', ['mdc-linear-progress__buffering-dots']);
        this._elmBuffer = this.addElement(this._root.nativeElement, 'div', ['mdc-linear-progress__buffer']);
        this._elmPrimaryBar = this.addElement(this._root.nativeElement, 'div', ['mdc-linear-progress__bar', 'mdc-linear-progress__primary-bar']);
        this.addElement(this._elmPrimaryBar!, 'span', ['mdc-linear-progress__bar-inner']);
        const secondaryBar = this.addElement(this._root.nativeElement, 'div', ['mdc-linear-progress__bar', 'mdc-linear-progress__secondary-bar']);
        this.addElement(secondaryBar, 'span', ['mdc-linear-progress__bar-inner']);
    }

    private addElement(parent: HTMLElement, element: string, classNames: string[]) {
        let child = this._rndr.createElement(element);
        classNames.forEach(name => {
            this._rndr.addClass(child, name);
        });
        this._rndr.appendChild(parent, child);
        return child;
    }

    /**
     * Puts the progress indicator in 'indeterminate' state, signaling
     * that the exact progress on a measured task is not known.
     */
    @Input()
    @HostBinding('class.' + CLASS_INDETERMINATE)
    get indeterminate() {
        return this._indeterminate;
    }
    
    set indeterminate(value: boolean) {
        let newValue = asBoolean(value);
        if (newValue !== this._indeterminate) {
            this._indeterminate = newValue;
            if (this.foundation) {
                this.foundation.setDeterminate(!this._indeterminate);
                if (!this._indeterminate) {
                    this.foundation.setProgress(this._progress);
                    this.foundation.setBuffer(this._buffer);
                }
            }
        }
    }

    static ngAcceptInputType_indeterminate: boolean | '';

    /**
     * Reverses the direction of the linear progress indicator.
     */
    @Input() @HostBinding('class.' + CLASS_REVERSED)
    get reversed() {
        return this._reverse;
    }

    set reversed(value: boolean) {
        this._reverse = asBoolean(value);
        this.foundation?.setReverse(this._reverse);
    }

    static ngAcceptInputType_reversed: boolean | '';

    /**
     * Set the progress, the value should be between [0, 1].
     */
    @Input()
    get progressValue() {
        return this._progress;
    }

    set progressValue(value: number) {
        this._progress = +value;
        this.foundation?.setProgress(this._progress);
    }

    static ngAcceptInputType_progressValue: number | string;

    /**
     * Set the buffer progress, the value should be between [0, 1].
     */
    @Input()
    get bufferValue() {
        return this._buffer;
    }

    set bufferValue(value: number) {
        this._buffer = +value;
        this.foundation?.setBuffer(this._buffer);
    }

    static ngAcceptInputType_bufferValue: number | string;

    /**
     * When set to true this closes (animates away) the progress bar,
     * when set to false this opens (animates into view) the progress bar.
     */
    @Input()
    get closed() {
        return this._closed;
    }

    set closed(value: boolean) {
        let newValue = asBoolean(value);
        if (newValue !== this._closed) {
            this._closed = newValue;
            if (newValue)
                this.foundation?.close();
            else
                this.foundation?.open();
        }
    }

    static ngAcceptInputType_closed: boolean | '';
}

export const LINEAR_PROGRESS_DIRECTIVES = [
    MdcLinearProgressDirective
];
