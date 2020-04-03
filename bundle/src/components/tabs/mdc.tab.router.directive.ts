import { ContentChildren, forwardRef, QueryList, Directive, ElementRef, Optional, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { AbstractMdcTabDirective } from './mdc.tab.directive';
import { RouterActiveDetector } from '../utility/router.active.detector';
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

    constructor(rndr: Renderer2, root: ElementRef, registry: MdcEventRegistry, private router: Router,
        @Optional() private link?: RouterLink, @Optional() private linkWithHref?: RouterLinkWithHref) {
        super(rndr, root, registry);
    }

    ngOnDestroy() {
        this.routerActive.destroy();
        this.routerActive = null;
        super.ngOnDestroy();
    }

    ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.routerActive = new RouterActiveDetector(this, this._links, this._linksWithHrefs, this.router,
            this.link, this.linkWithHref);
        this.routerActive.init();
    }

    ngOnChanges(): void {
        if (this.routerActive)
            this.routerActive.update();
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
