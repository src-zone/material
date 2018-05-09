import { MDCTextFieldBottomLineFoundation } from '@material/textfield/bottom-line';
import { MDCTextFieldHelperTextFoundation } from '@material/textfield/helper-text';

/** @docs-private */
export interface MdcTextFieldHelperTextAdapter {
    addClass: (className: string) => void,
    removeClass: (className: string) => void,
    hasClass: (className: string) => void,
    setAttr: (name: string, value: string) => void,
    removeAttr: (name: string) => void,
    setContent: (content: string) => void
}

/** @docs-private */
export interface MdcTextFieldBottomLineAdapter {
    addClass: (className: string) => void,
    removeClass: (className: string) => void,
    setAttr: (name: string, value: string) => void,
    registerEventHandler: (evtType: string, handler: EventListener) => void,
    deregisterEventHandler: (evtType: string, handler: EventListener) => void,
    notifyAnimationEnd: () => void
}

/** @docs-private */
export interface MdcTextFieldAdapter {
    addClass: (className: string) => void,
    removeClass: (className: string) => void,
    addClassToLabel: (className: string) => void,
    removeClassFromLabel: (className: string) => void,
    setIconAttr: (name: string, value: string) => void,
    eventTargetHasClass: (target: HTMLElement, className: string) => void,
    registerTextFieldInteractionHandler: (evtType: string, handler: EventListener) => void,
    deregisterTextFieldInteractionHandler: (evtType: string, handler: EventListener) => void,
    notifyIconAction: () => void,
    registerInputInteractionHandler: (evtType: string, handler: EventListener) => void,
    deregisterInputInteractionHandler: (evtType: string, handler: EventListener) => void,
    registerBottomLineEventHandler: (evtType: string, handler: EventListener) => void,
    deregisterBottomLineEventHandler: (evtType: string, handler: EventListener) => void,
    getNativeInput: () => {value: string, disabled: boolean, badInput: boolean, checkValidity: () => boolean}
}
