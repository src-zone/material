import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, Directive, ElementRef, HostBinding, HostListener,
  Input, OnDestroy, QueryList, Renderer2, ViewEncapsulation } from '@angular/core';
import { asBoolean } from '../../utils/value.utils';
import { MdcButtonDirective } from '../button/mdc.button.directive';

@Directive({
    selector: '[mdcCardPrimary]'
})
export class MdcCardPrimaryDirective {
    @HostBinding('class.mdc-card__primary') hasHostClass = true;

    constructor() {}
}

@Directive({
    selector: '[mdcCardTitle]',
})
export class MdcCardTitleDirective {
    @HostBinding('class.mdc-card__title') hasHostClass = true;
    private _large = false;
    
    constructor() {}

    @HostBinding('class.mdc-card__title--large') @Input()
    get mdcLarge() {
        return this._large;
    }

    set mdcLarge(val: any) {
        this._large = asBoolean(val);
    }
}

@Directive({
    selector: '[mdcCardSubtitle]',
})
export class MdcCardSubtitleDirective {
    @HostBinding('class.mdc-card__subtitle') hasHostClass = true;
    
    constructor() {}
}

@Directive({
    selector: '[mdcCardText]',
})
export class MdcCardTextDirective {
    @HostBinding('class.mdc-card__supporting-text') hasHostClass = true;

    constructor() {}
}

@Directive({
    selector: '[mdcCardMedia]',
})
export class MdcCardMediaDirective {
    @HostBinding('class.mdc-card__media') hasHostClass = true;
    
    constructor() {}
}

@Directive({
    selector: '[mdcCardActions]'
})
export class MdcCardActionsDirective implements AfterContentInit  {
    @HostBinding('class.mdc-card__actions') hasHostClass = true;
    @ContentChildren(MdcButtonDirective, {descendants: false}) _children: QueryList<MdcButtonDirective>;
    private _initialized = false;
    private _compact: boolean;
    private _vertical = false;

    constructor(private renderer: Renderer2) {}

    ngAfterContentInit() {
        this._initialized = true;
        this._initChildren();
        this._children.changes.subscribe(() => {
            this._initChildren();
        });
    }

    private _initChildren() {
        if (this._initialized)
            this._children.forEach(btn => {
                this.renderer.addClass(btn._elm.nativeElement, 'mdc-card__action');
                if (this._compact != null)
                    if (this._compact)
                        btn.mdcCompact = true;
                    else
                        btn.mdcCompact = false;
            });
    }

    @Input()
    get mdcCompact() {
        return this._compact;
    }

    set mdcCompact(val: any) {
        if (val == null)
            this._compact = val;
        else {
            val = asBoolean(val);
            if (this._compact !== val) {
                this._compact = val;
                this._initChildren();
            }
        }
    }

    @HostBinding('class.mdc-card__actions--vertical') @Input()
    get mdcVertical() {
        return this._vertical;
    }

    set mdcVertical(val: any) {
        this._vertical = asBoolean(val);
    }
}

@Directive({
    selector: '[mdcCardHorizontal]',
})
export class MdcCardHorizontalDirective {
    @HostBinding('class.mdc-card__horizontal-block') hasHostClass = true;
    
    constructor() {}
}

@Directive({
    selector: '[mdcCardMediaItem]',
})
export class MdcCardMediaItemDirective {
    @HostBinding('class.mdc-card__media-item') hasHostClass = true;
    private _size = 1;
    
    constructor() {}

    @HostBinding('class.mdc-card__media-item--1dot5x') get size1dot5() {
        return this._size === 1.5;
    }

    @HostBinding('class.mdc-card__media-item--2x') get size2() {
        return this._size === 2;
    }

    @HostBinding('class.mdc-card__media-item--3x') get size3() {
        return this._size === 3;
    }

    @Input()
    set mdcSize(val: any) {
        if (+val === 1.5)
            this._size = 1.5;
        else if (+val === 2)
            this._size = 2;
        else if (+val === 3)
            this._size = 3;
        else
            this._size = 1;
    }

    get mdcSize() {
        return this._size;
    }
}

@Directive({
    selector: '[mdcCard]'
})
export class MdcCardDirective {
    @HostBinding('class.mdc-card') hasHostClass = true;

    constructor() {}
}
