import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { SpecificEventListener } from '@material/base';

type UnlistenerMap = WeakMap<EventListener | SpecificEventListener<any>, Function>;
const unlisteners: Map<string, UnlistenerMap> = new Map<string, UnlistenerMap>();

@Injectable({
    providedIn: 'root'
})
export class MdcEventRegistry {
    constructor() {}

    listen(renderer: Renderer2, type: string, listener: EventListener | SpecificEventListener<any>, ref: ElementRef, options?: any) {
        this.listenElm(renderer, type, listener, ref.nativeElement, options);
    }

    listenElm(renderer: Renderer2, type: string, listener: EventListener | SpecificEventListener<any>, el: Element | Window | Document, options?: any) {
        el.addEventListener(type, listener, options);
        const unlistener = function() {
            el.removeEventListener(type, listener, options);
        };
        this.registerUnlisten(type, listener, unlistener);
    }

    private registerUnlisten(type: string, listener: EventListener | SpecificEventListener<any>, unlistener: Function) {
        if (!unlisteners.has(type))
            unlisteners.set(type, new WeakMap<EventListener, Function>());
        unlisteners.get(type)!.set(listener, unlistener);
    }

    unlisten(type: string, listener: EventListener | SpecificEventListener<any>) {
        if (!unlisteners.has(type))
            return;
        const unlistenerMap = unlisteners.get(type);
        if (!unlistenerMap!.has(listener))
            return;
        unlistenerMap!.get(listener)!();
        unlistenerMap!.delete(listener);
    }
}
