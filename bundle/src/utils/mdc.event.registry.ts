import { ElementRef, Injectable, Renderer2 } from '@angular/core';

type UnlistenerMap = WeakMap<EventListener, Function>;

@Injectable()
export class MdcEventRegistry {
    private unlisteners: Map<string, UnlistenerMap> = new Map<string, UnlistenerMap>();

    constructor() {}

    listen(renderer: Renderer2, type: string, listener: EventListener, ref: ElementRef) {
        if (!this.unlisteners.has(type))
            this.unlisteners.set(type, new WeakMap<EventListener, Function>());
        const unlistener = renderer.listen(ref.nativeElement, type, listener);
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
