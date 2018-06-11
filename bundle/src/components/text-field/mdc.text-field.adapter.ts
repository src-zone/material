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
    getAttr: (attr: string) => string,
    setAttr: (name: string, value: string) => void,
    removeAttr: (name: string) => void,
    setContent: (content: string) => void,
    registerInteractionHandler: (evtType: string, handler: EventListener) => void,
    deregisterInteractionHandler: (evtType: string, handler: EventListener) => void,
    notifyIconAction: () => void
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
    registerValidationAttributeChangeHandler: (handler: (arg: Array<string>) => void) => MutationObserver,
    deregisterValidationAttributeChangeHandler: (observer: MutationObserver) => void,
    getNativeInput: () => {value: string, disabled: boolean, validity: {badInput: boolean, valid: boolean}},
    isFocused: () => boolean,
    isRtl: () => boolean,
    activateLineRipple: () => void,
    deactivateLineRipple: () => void,
    setLineRippleTransformOrigin: (normalizedX: number) => void
    shakeLabel: (shouldShake: boolean) => void,
    floatLabel: (shouldFloat: boolean) => void,
    hasLabel: () => boolean,
    getLabelWidth: () => number,
    hasOutline: () => boolean,
    notchOutline: (labelWidth: number, isRtl: boolean) => void,
    closeOutline: () => void
}
