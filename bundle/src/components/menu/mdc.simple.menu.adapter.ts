/** @docs-private */
export interface MdcSimpleMenuAdapter {
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    hasClass: (className: string) => boolean,
    hasNecessaryDom: () => boolean,
    getAttributeForEventTarget: (target: Element, attrName: string) => string,
    eventTargetHasClass: (target: HTMLElement, className: string) => boolean;
    getInnerDimensions: () => {width: number, height: number},
    hasAnchor: () => boolean,
    getAnchorDimensions: () => {width: number, height: number, top: number, right: number, bottom: number, left: number},
    getWindowDimensions: () => {width: number, height: number},
    getNumberOfItems: () => number,
    registerInteractionHandler: (type: string, handler: EventListener) => void,
    deregisterInteractionHandler: (type: string, handler: EventListener) => void,
    registerBodyClickHandler: (handler: EventListener) => void,
    deregisterBodyClickHandler: (handler: EventListener) => void,
    getIndexForEventTarget: (target: EventTarget) => number,
    notifySelected: (evtData: {index: number}) => void,
    notifyCancel: () => void,
    saveFocus: () => void,
    restoreFocus: () => void,
    isFocused: () => boolean,
    focus: () => void,
    getFocusedItemIndex: () => number,
    focusItemAtIndex: (index: number) => void,
    isRtl: () => boolean,
    setTransformOrigin: (origin: string) => void,
    setPosition: (position: {top: string | undefined, right: string | undefined, bottom: string | undefined, left: string | undefined}) => void,
    setMaxHeight: (value: string) => void
}
