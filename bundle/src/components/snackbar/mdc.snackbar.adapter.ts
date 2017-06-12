export interface MdcSnackbarAdapter {
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    setAriaHidden: () => void;
    unsetAriaHidden: () => void;
    setMessageText: (message: string) => void;
    setActionText: (actionText: string) => void;
    setActionAriaHidden: () => void;
    unsetActionAriaHidden: () => void;
    registerActionClickHandler: (handler: EventListener) => void;
    deregisterActionClickHandler: (handler: EventListener) => void;
    registerTransitionEndHandler: (handler: EventListener) => void;
    deregisterTransitionEndHandler: (handler: EventListener) => void;
}
