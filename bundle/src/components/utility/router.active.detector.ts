import { Optional, QueryList } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router, RouterLink, RouterLinkWithHref } from '@angular/router';

/**
 * @docs-private
 */
export class RouterActiveDetector {
    private onDestroy$: Subject<any> = new Subject();

    constructor(
            private component: {isRouterActive: () => boolean, setRouterActive: (a: boolean) => void},
            private links: QueryList<RouterLink>,
            private linksWithHrefs: QueryList<RouterLinkWithHref>,
            private router: Router,
            @Optional() private link?: RouterLink,
            @Optional() private linkWithHref?: RouterLinkWithHref) {
        router.events.pipe(takeUntil(this.onDestroy$)).subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.update();
            }
        });
    }

    /** @internal */
    init(): void {
        this.links.changes.subscribe(_ => this.update());
        this.linksWithHrefs.changes.subscribe(_ => this.update());
        this.update();
    }

    /** @internal */
    destroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    /** @internal */
    public update(): void {
        if (!this.links || !this.linksWithHrefs || !this.router.navigated) return;
        Promise.resolve().then(() => {
            const hasActiveLinks = this.hasActiveLinks();
            const active = this.component.isRouterActive();
            if (active !== hasActiveLinks) {
                this.component.setRouterActive(hasActiveLinks);
            }
        });
    }

    private hasActiveLinks(): boolean {
        return (this.link && this.isLinkActive(this.router)(this.link)) ||
            (this.linkWithHref && this.isLinkActive(this.router)(this.linkWithHref)) ||
            this.links.some(this.isLinkActive(this.router)) ||
            this.linksWithHrefs.some(this.isLinkActive(this.router));
    }

    private isLinkActive(router: Router): (link: (RouterLink | RouterLinkWithHref)) => boolean {
        return (link: RouterLink | RouterLinkWithHref) => router.isActive(link.urlTree, false);
    }
}
