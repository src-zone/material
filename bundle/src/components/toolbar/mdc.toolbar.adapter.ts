/** @docs-private */
export interface MdcToolbarAdapter {
    hasClass: (className: string) => boolean;
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    registerScrollHandler: (handler: EventListener) => void;
    deregisterScrollHandler: (handler: EventListener) => void;
    registerResizeHandler: (handler: EventListener) => void;
    deregisterResizeHandler: (handler: EventListener) => void;
    getViewportWidth: () => number;
    getViewportScrollY: () => number;
    getOffsetHeight: () => number;
    getFirstRowElementOffsetHeight: () => number;
    notifyChange: (evtData: {flexibleExpansionRatio: number}) => void;
    setStyle: (property: string, value: number) => void;
    setStyleForTitleElement: (property: string, value: number) => void;
    setStyleForFlexibleRowElement: (property: string, value: number) => void;
    setStyleForFixedAdjustElement: (property: string, value: number) => void;
}
