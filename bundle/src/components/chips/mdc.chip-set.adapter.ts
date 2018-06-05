/** @docs-private */
export interface MdcChipSetAdapter {
    hasClass: (className: string) => boolean,
    registerInteractionHandler: (evtType: string, handler: EventListener) => void,
    deregisterInteractionHandler: (evtType: string, handler: EventListener) => void,
    removeChip: (chip: any) => void
}
