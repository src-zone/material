import { MDCTextFieldHelperTextFoundation } from '@material/textfield/helper-text';

/** @docs-private */
export interface MdcFloatingLabelAdapter {
    addClass: (className: string) => void,
    removeClass: (className: string) => void,
    getWidth: () => number,
    registerInteractionHandler: (evtType: string, handler: EventListener) => void,
    deregisterInteractionHandler: (evtType: string, handler: EventListener) => void,
}
