import { AfterContentInit, ChangeDetectorRef, ContentChild, ContentChildren, EventEmitter, forwardRef, QueryList, Directive, ElementRef,
    HostBinding, HostListener, Input, OnChanges, OnDestroy, Optional, Output, Renderer2, Self } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgControl } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { MDCTabFoundation } from '@material/tabs';
import { MdcTabAdapter } from './mdc.tab.adapter';
import { AbstractMdcTabDirective } from './mdc.tab.directive';
import { RouterActiveDetector } from '../utility/router.active.detector';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

@Directive({
    selector: '[mdcTabRouter]',
    exportAs: 'mdcTabRouter',
    providers: [{provide: AbstractMdcTabDirective, useExisting: forwardRef(() => MdcTabRouterDirective) }]
})
export class MdcTabRouterDirective extends AbstractMdcTabDirective {
    @ContentChildren(RouterLink, {descendants: true}) _links: QueryList<RouterLink>;
    @ContentChildren(RouterLinkWithHref, {descendants: true}) _linksWithHrefs: QueryList<RouterLinkWithHref>;
    private routerActive: RouterActiveDetector;

    constructor(rndr: Renderer2, root: ElementRef, registry: MdcEventRegistry, private router: Router, private cdr: ChangeDetectorRef) {
        super(rndr, root, registry);
    }

    ngOnDestroy() {
        this.routerActive.destroy();
        this.routerActive = null;
        super.ngOnDestroy();
    }

    ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.routerActive = new RouterActiveDetector(this, this._links, this._linksWithHrefs, this.router, this.cdr);
        this.routerActive.init();
    }

    /** @docs-private */
    isRouterActive() {
        return this._active;
    }

    /** @docs-private */
    setRouterActive(active: boolean) {
        this._active = active;
        if (active)
            this._adapter.notifySelected();
    }
}
