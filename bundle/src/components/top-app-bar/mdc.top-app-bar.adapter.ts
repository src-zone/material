/** @docs-private */
export interface MdcTopAppBarAdapter {
    hasClass: (className: string) => boolean;
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    registerNavigationIconInteractionHandler: (type: string, handler: EventListener) => void;
    deregisterNavigationIconInteractionHandler: (type: string, handler: EventListener) => void;
    notifyNavigationIconClicked: () => void;
    registerScrollHandler: (handler: EventListener) => void;
    deregisterScrollHandler: (handler: EventListener) => void;
    getViewportScrollY: () => number;
    getTotalActionItems: () => number;
}
