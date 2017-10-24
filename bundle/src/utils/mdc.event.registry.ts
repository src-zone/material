import { ElementRef, Injectable, Renderer2 } from '@angular/core';

type UnlistenerMap = WeakMap<EventListener, Function>;

@Injectable()
export class MdcEventRegistry {
    private unlisteners: Map<string, UnlistenerMap> = new Map<string, UnlistenerMap>();

    constructor() {}

    listen(renderer: Renderer2, type: string, listener: EventListener, ref: ElementRef, options?: any) {
        this.listenElm(renderer, type, listener, ref.nativeElement, options);
    }

    listenElm(renderer: Renderer2, type: string, listener: EventListener, el: Element | Window, options?: any) {
        if (!this.unlisteners.has(type))
            this.unlisteners.set(type, new WeakMap<EventListener, Function>());
        el.addEventListener(type, listener, options);
        const unlistener = function() {
            el.removeEventListener(type, listener, options);
        };
        this.unlisteners.get(type).set(listener, unlistener);
    }

    unlisten(type: string, listener: EventListener) {
        if (!this.unlisteners.has(type))
            return;
        const unlisteners = this.unlisteners.get(type);
        if (!unlisteners.has(listener))
            return;
        unlisteners.get(listener)();
        unlisteners.delete(listener);
    }
}
