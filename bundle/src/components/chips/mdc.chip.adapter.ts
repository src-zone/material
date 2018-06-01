/** @docs-private */
export interface MdcChipAdapter {
    addClass: (className: string) => void,
    removeClass: (className: string) => void,
    hasClass: (className: string) => boolean,
    addClassToLeadingIcon: (className: string) => void,
    removeClassFromLeadingIcon: (className: string) => void,
    eventTargetHasClass: (target: EventTarget, className: string) => boolean,
    registerEventHandler: (evtType: string, handler: EventListener) => void,
    deregisterEventHandler: (evtType: string, handler: EventListener) => void,
    registerTrailingIconInteractionHandler: (evtType: string, handler: EventListener) => void,
    deregisterTrailingIconInteractionHandler: (evtType: string, handler: EventListener) => void,
    notifyInteraction: () => void,
    notifyTrailingIconInteraction: () => void,
    notifyRemoval: () => void,
    getComputedStyleValue: (propertyName: string) => string,
    setStyleProperty: (propertyName: string, value: string) => void
}
