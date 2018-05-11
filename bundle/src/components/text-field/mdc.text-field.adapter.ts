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
export interface MdcTextFieldIconAdapter {
    setAttr: (name: string, value: string) => void,
    registerInteractionHandler: (evtType: string, handler: EventListener) => void,
    deregisterInteractionHandler: (evtType: string, handler: EventListener) => void,
    notifyIconAction: () => void
}

/** @docs-private */
export interface MdcTextFieldLabelAdapter {
    addClass: (className: string) => void,
    removeClass: (className: string) => void,
    getWidth: () => number
}

/** @docs-private */
export interface MdcTextFieldAdapter {
    addClass: (className: string) => void,
    removeClass: (className: string) => void,
    hasClass: (className: string) => boolean,
    registerTextFieldInteractionHandler: (evtType: string, handler: EventListener) => void,
    deregisterTextFieldInteractionHandler: (evtType: string, handler: EventListener) => void,
    registerInputInteractionHandler: (evtType: string, handler: EventListener) => void,
    deregisterInputInteractionHandler: (evtType: string, handler: EventListener) => void,
    registerBottomLineEventHandler: (evtType: string, handler: EventListener) => void,
    deregisterBottomLineEventHandler: (evtType: string, handler: EventListener) => void,
    getNativeInput: () => {value: string, disabled: boolean, validity: {badInput: boolean, valid: boolean}},
    isFocused: () => boolean,
    activateLineRipple: () => void,
    deactivateLineRipple: () => void,
    setLineRippleTransformOrigin: (normalizedX: number) => void
    shakeLabel: (shouldShake: boolean) => void,
}
