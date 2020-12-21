import { AfterContentInit, Directive, ElementRef, HostBinding, OnDestroy, Renderer2, ContentChildren, QueryList } from '@angular/core';
import { MDCNotchedOutlineFoundation, MDCNotchedOutlineAdapter } from '@material/notched-outline';
  
/**
 * This directive styles the notch of an `mdcNotchedOutline`. It should wrap the (floating)
 * label of an input like `mdcTextField` or `mdcSelect`.
 */
@Directive({
    selector: '[mdcNotchedOutlineNotch]'
})
export class MdcNotchedOutlineNotchDirective {
    /** @internal */
    @HostBinding('class.mdc-notched-outline__notch') readonly _cls = true;

    constructor(public _elm: ElementRef) {
    }
}

/**
 * The notched outline is a border around all sides of either an `mdcTextField` or an
 * `mdcSelect`. It should only be used for the outlined variant of these inputs.
 * This directive should wrap an `mdcNotchedOutlineNotch`, which in turn wraps the
 * actual label.
 */
@Directive({
    selector: '[mdcNotchedOutline]'
})
export class MdcNotchedOutlineDirective implements AfterContentInit, OnDestroy {
    /** @internal */
    @HostBinding('class.mdc-notched-outline') readonly _cls = true;
    /** @internal */
    @ContentChildren(MdcNotchedOutlineNotchDirective) _notches?: QueryList<MdcNotchedOutlineNotchDirective>;
    private notchWidth: number | null = null;
    private mdcAdapter: MDCNotchedOutlineAdapter = {
        addClass: (name) => this.rndr.addClass(this.root.nativeElement, name),
        removeClass: (name) => this.rndr.removeClass(this.root.nativeElement, name),
        setNotchWidthProperty: (width) => this.rndr.setStyle(this.notch!._elm.nativeElement, 'width', `${width}px`),
        removeNotchWidthProperty: () => this.rndr.removeStyle(this.notch!._elm.nativeElement, 'width')
    };
    private foundation: MDCNotchedOutlineFoundation | null = null;

    constructor(private rndr: Renderer2, private root: ElementRef) {
        this.addSurround('mdc-notched-outline__leading')
    }

    ngAfterContentInit() {
        this.addSurround('mdc-notched-outline__trailing');
        if (this.notch)
            this.initFoundation();
        this._notches!.changes.subscribe(() => {
            this.destroyFoundation();
            if (this._notches!.length > 0)
                this.initFoundation();
        });
    }

    ngOnDestroy() {
        this.destroyFoundation();
    }

    private initFoundation() {
        this.foundation = new MDCNotchedOutlineFoundation(this.mdcAdapter);
        this.foundation.init();
        if (this.notchWidth)
            this.foundation.notch(this.notchWidth);
        else
            this.foundation.closeNotch();
    }

    private destroyFoundation() {
        if (this.foundation) {
            this.foundation.destroy();
            this.foundation = null;
        }
    }

    private addSurround(clazz: string) {
        let surround = this.rndr.createElement('span');
        this.rndr.addClass(surround,clazz);
        this.rndr.appendChild(this.root.nativeElement, surround);
    }

    private get notch() {
        return this._notches?.first;
    }

    /**
     * Opens the notched outline.
     * 
     * @param width The width of the notch.
     */
    open(width: number) {
        // TODO we actually want to compare the size here as well as the open/closed state (by dropping !! on both sides)
        // but this reduces the width of the label when the input has a non-empty value. Needs investigation.
        if (!!this.notchWidth !== !!width) {
            this.notchWidth = width;
            if (this.foundation)
                this.foundation.notch(width);
        }
    }

    /**
     * Closes the notched outline.
     */
    close() {
        if (this.notchWidth != null) {
            this.notchWidth = null;
            if (this.foundation)
                this.foundation.closeNotch();
        }
    }
}

export const NOTCHED_OUTLINE_DIRECTIVES = [
    MdcNotchedOutlineNotchDirective,
    MdcNotchedOutlineDirective
];
