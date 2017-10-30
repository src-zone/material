import { ElementRef, Injectable, Optional, Renderer2, SkipSelf } from '@angular/core';

type UnlistenerMap = WeakMap<EventListener, Function>;
const unlisteners: Map<string, UnlistenerMap> = new Map<string, UnlistenerMap>();

@Injectable()
export class MdcEventRegistry {
    constructor() {}

    listen(renderer: Renderer2, type: string, listener: EventListener, ref: ElementRef, options?: any) {
        this.listenElm(renderer, type, listener, ref.nativeElement, options);
    }

    listenElm(renderer: Renderer2, type: string, listener: EventListener, el: Element | Window, options?: any) {
        el.addEventListener(type, listener, options);
        const unlistener = function() {
            el.removeEventListener(type, listener, options);
        };
        this.registerUnlisten(type, listener, unlistener);
    }

    registerUnlisten(type: string, listener: EventListener, unlistener: Function) {
        if (!unlisteners.has(type))
            unlisteners.set(type, new WeakMap<EventListener, Function>());
        unlisteners.get(type).set(listener, unlistener);
    }

    unlisten(type: string, listener: EventListener) {
        if (!unlisteners.has(type))
            return;
        const unlistenerMap = unlisteners.get(type);
        if (!unlistenerMap.has(listener))
            return;
        unlistenerMap.get(listener)();
        unlistenerMap.delete(listener);
    }
}

/** @docs-private */
export function MDC_EVENT_REGISTRY_PROVIDER_FACTORY(parent: MdcEventRegistry) {
    return parent || new MdcEventRegistry();
}

/** @docs-private */
export const MDC_EVENT_REGISTRY_PROVIDER = {
    provide: MdcEventRegistry,
    deps: [[new Optional(), new SkipSelf(), MdcEventRegistry]],
    useFactory: MDC_EVENT_REGISTRY_PROVIDER_FACTORY
};
