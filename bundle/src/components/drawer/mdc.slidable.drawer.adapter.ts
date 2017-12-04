/** @docs-private */
export interface MdcSlidableDrawerAdapter {
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    hasClass: (className: string) => boolean;
    hasNecessaryDom: () => boolean;
    registerInteractionHandler: (evt: string, handler: EventListener) => void;
    deregisterInteractionHandler: (evt: string, handler: EventListener) => void;
    registerDrawerInteractionHandler: (evt: string, handler: EventListener) => void;
    deregisterDrawerInteractionHandler: (evt: string, handler: EventListener) => void;
    registerTransitionEndHandler: (handler: EventListener) => void;
    deregisterTransitionEndHandler: (handler: EventListener) => void;
    registerDocumentKeydownHandler: (handler: EventListener) => void;
    deregisterDocumentKeydownHandler: (handler: EventListener) => void;
    setTranslateX: (value: number) => void;
    getFocusableElements: () => NodeListOf<Element>;
    saveElementTabState: (el: Element) => void;
    restoreElementTabState: (el: Element) => void;
    makeElementUntabbable: (el: Element) => void;
    notifyOpen: () => void;
    notifyClose: () => void;
    isRtl: () => boolean;
    getDrawerWidth: () => number;
    // allthough in the MDC code this is not listed as member for the slidable/temporary
    // drawer, the code still calls it, and the implementation returns false for temporary
    // drawer:
    isDrawer: (el: Element) => boolean;
}
