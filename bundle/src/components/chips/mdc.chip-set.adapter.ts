/** @docs-private */
export interface MdcChipSetAdapter {
    hasClass: (className: string) => boolean,
    registerInteractionHandler: (evtType: string, handler: EventListener) => void,
    deregisterInteractionHandler: (evtType: string, handler: EventListener) => void,
    appendChip: (text: string, leadingIcon: Element, trailingIcon: Element) => Element,
    removeChip: (chip: any) => void
}
