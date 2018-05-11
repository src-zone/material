/** @docs-private */
export interface MdcSelectAdapter {
    addClass: (className: string) => void,
    removeClass: (className: string) => void,
    floatLabel: (value: boolean) => void,
    activateBottomLine: () => void,
    deactivateBottomLine: () => void,
    setDisabled: (disabled: boolean) => void,
    registerInteractionHandler: (type: string, handler: EventListener) => void,
    deregisterInteractionHandler: (type: string, handler: EventListener) => void,
    getSelectedIndex: () => number,
    setSelectedIndex: (index: number) => void,
    getValue: () => string,
    setValue: (value: string) => void
}
