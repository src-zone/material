import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnDestroy, Renderer2 } from '@angular/core';
import { MDCLinearProgressFoundation, strings } from '@material/linear-progress';
import { MdcLinearProgressAdapter } from './mdc.linear-progress.adapter';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

const CLASS_INDETERMINATE = 'mdc-linear-progress--indeterminate';
const CLASS_REVERSED = 'mdc-linear-progress--reversed';

interface MdcLinearProgressFoundationInterface {
    init();
    destroy();
    setDeterminate(isDeterminate: boolean);
    setProgress(value: number);
    setBuffer(value: number);
    setReverse(isReversed: boolean);
    open();
    close();
}

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
    private _initialized = false;
    @HostBinding('class.' + CLASS_INDETERMINATE) _indeterminate = false;
    @HostBinding('class.' + CLASS_REVERSED) _reverse = false;
    private _progress = 0;
    private _buffer = 1;
    private _closed = false;
    private _elmBuffer: HTMLElement;
    private _elmPrimaryBar: HTMLElement;

    private mdcAdapter: MdcLinearProgressAdapter = {
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
        setStyle: (el: Element, styleProperty: string, value: number) => {
            this._rndr.setStyle(el, styleProperty, value);
        }
    };
    private foundation: MdcLinearProgressFoundationInterface = new MDCLinearProgressFoundation(this.mdcAdapter);

    constructor(private _rndr: Renderer2, private _root: ElementRef, private _registry: MdcEventRegistry) {
    }

    ngAfterContentInit() {
        this.initElements();
        this.foundation.init();
        this._initialized = true;
        this.foundation.setProgress(this._progress);
        this.foundation.setBuffer(this._buffer);
        if (this._closed)
            this.foundation.close();
    }

    ngOnDestroy() {
        this.foundation.destroy();
    }

    private initElements() {
        const elmBufferingDots = this.addElement(this._root.nativeElement, 'div', ['mdc-linear-progress__buffering-dots']);
        this._elmBuffer = this.addElement(this._root.nativeElement, 'div', ['mdc-linear-progress__buffer']);
        this._elmPrimaryBar = this.addElement(this._root.nativeElement, 'div', ['mdc-linear-progress__bar', 'mdc-linear-progress__primary-bar']);
        this.addElement(this._elmPrimaryBar, 'span', ['mdc-linear-progress__bar-inner']);
        const secondaryBar = this.addElement(this._root.nativeElement, 'div', ['mdc-linear-progress__bar', 'mdc-linear-progress__secondary-bar']);
        this.addElement(this._elmPrimaryBar, 'span', ['mdc-linear-progress__bar-inner']);
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
    @Input() @HostBinding('class.' + CLASS_INDETERMINATE)
    get isIndeterminate() {
        return this._indeterminate;
    }
    
    set isIndeterminate(value: any) {
        let newValue = asBoolean(value);
        if (newValue !== this._indeterminate) {
            this._indeterminate = newValue;
            if (this._initialized) {
                this.foundation.setDeterminate(!this._indeterminate);
                if (!this._indeterminate) {
                    this.foundation.setProgress(this._progress);
                    this.foundation.setBuffer(this._buffer);
                }
            }
        }
    }

    /**
     * Reverses the direction of the linear progress indicator.
     */
    @Input() @HostBinding('class.' + CLASS_REVERSED)
    get isReversed() {
        return this._reverse;
    }

    set isReversed(value: any) {
        this._reverse = asBoolean(value);
        if (this._initialized)        
            this.foundation.setReverse(this._reverse);
    }

    /**
     * Set the progress, the value should be between [0, 1].
     */
    @Input()
    get progressValue() {
        return this._progress;
    }

    set progressValue(value: number | string) {
        this._progress = +value;
        if (this._initialized)        
            this.foundation.setProgress(this._progress);
    }

    /**
     * Set the buffer progress, the value should be between [0, 1].
     */
    @Input()
    get bufferValue() {
        return this._buffer;
    }

    set bufferValue(value: number | string) {
        this._buffer = +value;
        if (this._initialized)        
            this.foundation.setBuffer(this._buffer);
    }

    /**
     * When set to true this closes (animates away) the progress bar,
     * when set to false this opens (animates into view) the progress bar.
     */
    @Input()
    get isClosed() {
        return this._closed;
    }

    set isClosed(value: any) {
        let newValue = asBoolean(value);
        if (newValue !== this._closed) {
            this._closed = newValue;
            if (this._initialized) {
                if (newValue)
                    this.foundation.close();
                else
                    this.foundation.open();
            }
        }
    }
}
