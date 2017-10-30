/** @docs-private */
export interface MdcTabAdapter {
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    registerInteractionHandler: (evt: string, handler: EventListener) => void;
    deregisterInteractionHandler: (evt: string, handler: EventListener) => void;
    getOffsetWidth: () => number;
    getOffsetLeft: () => number;
    notifySelected: () => void;
}
