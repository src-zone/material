/** @docs-private */
export interface MdcFormfieldAdapter {
    registerInteractionHandler: (type: string, handler: EventListener) => void;
    deregisterInteractionHandler: (type: string, handler: EventListener) => void;
    activateInputRipple: () => void;
    deactivateInputRipple: () => void;
}
