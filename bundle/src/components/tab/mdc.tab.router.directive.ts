import { ContentChildren, forwardRef, QueryList, Directive, ElementRef, Optional, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { AbstractMdcTabDirective } from './mdc.tab.directive';
import { RouterActiveDetector } from '../utility/router.active.detector';
import { MdcEventRegistry } from '../../utils/mdc.event.registry';

/**
 * Directive for a tab that triggers a route change. This directive must be used as a child of
 * `mdcTabBar`. For a tab that doesn't use the angular routing module, drop the `routerLink`
 * attribute.
 * 
 * Selector `mdcTabRouter` is provided for backward compatibility and will be deprecated in the future.
 * Use the selector `mdcTab` in combination with a `routerLink` attribute instead.
 */
@Directive({
    selector: '[mdcTab][routerLink],[mdcTabRouter]',
    exportAs: 'mdcTab',
    providers: [{provide: AbstractMdcTabDirective, useExisting: forwardRef(() => MdcTabRouterDirective) }]
})
export class MdcTabRouterDirective extends AbstractMdcTabDirective {
    /** @internal */
    @ContentChildren(RouterLink, {descendants: true}) _links?: QueryList<RouterLink>;
    /** @internal */
    @ContentChildren(RouterLinkWithHref, {descendants: true}) _linksWithHrefs?: QueryList<RouterLinkWithHref>;
    private routerActive: RouterActiveDetector | null = null;

    constructor(rndr: Renderer2, root: ElementRef, registry: MdcEventRegistry, private router: Router,
        @Optional() private link?: RouterLink, @Optional() private linkWithHref?: RouterLinkWithHref) {
        super(rndr, root, registry);
    }

    ngOnDestroy() {
        this.routerActive?.destroy();
        this.routerActive = null;
        super.ngOnDestroy();
    }

    ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.routerActive = new RouterActiveDetector(this, this._links!, this._linksWithHrefs!, this.router,
            this.link, this.linkWithHref);
        this.routerActive.init();
    }

    ngOnChanges(): void {
        this.routerActive?.update();
    }

    /** @internal */
    isRouterActive() {
        return this.isActive();
    }

    /** @internal */
    setRouterActive(activate: boolean) {
        this.triggerActivation(activate);
    }
}

export const TAB_ROUTER_DIRECTIVES = [MdcTabRouterDirective];
