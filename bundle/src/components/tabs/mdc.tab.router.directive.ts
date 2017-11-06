import { AfterContentInit, ChangeDetectorRef, ContentChild, ContentChildren, EventEmitter, forwardRef, QueryList, Directive, ElementRef,
    HostBinding, HostListener, Input, OnChanges, OnDestroy, Optional, Output, Renderer2, Self } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { NgControl } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { MDCTabFoundation } from '@material/tabs';
import { MdcTabAdapter } from './mdc.tab.adapter';
import { AbstractMdcTabDirective } from './mdc.tab.directive';
import { asBoolean } from '../../utils/value.utils';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

@Directive({
    selector: '[mdcTabRouter]',
    exportAs: 'mdcTabRouter',
    providers: [{provide: AbstractMdcTabDirective, useExisting: forwardRef(() => MdcTabRouterDirective) }]
})
export class MdcTabRouterDirective extends AbstractMdcTabDirective {
    private onDestroy$: Subject<any> = new Subject();
    @ContentChildren(RouterLink, {descendants: true}) _links: QueryList<RouterLink>;
    @ContentChildren(RouterLinkWithHref, {descendants: true}) _linksWithHrefs: QueryList<RouterLinkWithHref>;

    constructor(rndr: Renderer2, root: ElementRef, registry: MdcEventRegistry, private router: Router, private cdr: ChangeDetectorRef) {
        super(rndr, root, registry);
        router.events.pipe(takeUntil(this.onDestroy$)).subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.update();
            }
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        super.ngOnDestroy();
    }

    ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this._links.changes.subscribe(_ => this.update());
        this._linksWithHrefs.changes.subscribe(_ => this.update());
        this.update();
    }

    ngAfterViewInit() {
        this.update();
    }

    public get isActive() {
        return this._active;
    }

    private update(): void {
        if (!this._links || !this._linksWithHrefs || !this.router.navigated) return;
        const hasActiveLinks = this.hasActiveLinks();
        const active = this._active;
        if (active !== hasActiveLinks) {
            this._active = hasActiveLinks;
            if (this._active) {
                this._adapter.notifySelected();
            }
        }
    }

    private hasActiveLinks(): boolean {
        return this._links.some(this.isLinkActive(this.router)) || this._linksWithHrefs.some(this.isLinkActive(this.router));
    }

    private isLinkActive(router: Router): (link: (RouterLink | RouterLinkWithHref)) => boolean {
        return (link: RouterLink | RouterLinkWithHref) => router.isActive(link.urlTree, false);
    }
}
