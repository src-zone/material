/** @docs-private */
export interface MdcRippleAdapter {
    browserSupportsCssVars: () => boolean;
    isUnbounded: () => boolean;
    isSurfaceActive: () => boolean;
    isSurfaceDisabled: () => boolean;
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    containsEventTarget: (target: EventTarget) => boolean;
    registerInteractionHandler: (type: string, handler: EventListener) => void;
    deregisterInteractionHandler: (type: string, handler: EventListener) => void;
    registerDocumentInteractionHandler: (type: string, handler: EventListener) => void;
    deregisterDocumentInteractionHandler: (type: string, handler: EventListener) => void;
    registerResizeHandler: (handler: EventListener) => void;
    deregisterResizeHandler: (handler: EventListener) => void;
    updateCssVariable: (name: string, value: number | string) => void;
    computeBoundingRect: () => ClientRect;
    getWindowPageOffset: () => {x: number, y: number};
}
