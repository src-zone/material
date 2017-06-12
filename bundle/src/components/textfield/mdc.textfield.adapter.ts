export interface MdcTextfieldAdapter {
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    addClassToLabel: (className: string) => void;
    removeClassFromLabel: (className: string) => void;
    addClassToHelptext: (className: string) => void;
    removeClassFromHelptext: (className: string) => void;
    helptextHasClass: (className: string) => boolean;
    setHelptextAttr: (name: string, value: string) => void;
    removeHelptextAttr: (name: string) => void;
    registerInputFocusHandler: (handler: EventListener) => void;
    deregisterInputFocusHandler: (handler: EventListener) => void;
    registerInputBlurHandler: (handler: EventListener) => void;
    deregisterInputBlurHandler: (handler: EventListener) => void;
    registerInputInputHandler: (handler: EventListener) => void;
    deregisterInputInputHandler: (handler: EventListener) => void;
    registerInputKeydownHandler: (handler: EventListener) => void;
    deregisterInputKeydownHandler: (handler: EventListener) => void;
    getNativeInput: () => {value: string, disabled: boolean, badInput: boolean, checkValidity: () => boolean};
}
