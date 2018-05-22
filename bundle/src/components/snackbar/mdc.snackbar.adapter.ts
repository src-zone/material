/** @docs-private */
export interface MdcSnackbarAdapter {
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    setAriaHidden: () => void;
    unsetAriaHidden: () => void;
    setActionAriaHidden: () => void;
    unsetActionAriaHidden: () => void;
    setActionText: (actionText: string) => void;
    setMessageText: (message: string) => void;
    setFocus: () => void;
    visibilityIsHidden: () => boolean;
    registerCapturedBlurHandler: (handler: EventListener) => void;
    deregisterCapturedBlurHandler: (handler: EventListener) => void;
    registerVisibilityChangeHandler: (handler: EventListener) => void;
    deregisterVisibilityChangeHandler: (handler: EventListener) => void;
    registerCapturedInteractionHandler: (evtType: string, handler: EventListener) => void;
    deregisterCapturedInteractionHandler: (evtType: string, handler: EventListener) => void;
    registerActionClickHandler: (handler: EventListener) => void;
    deregisterActionClickHandler: (handler: EventListener) => void;
    registerTransitionEndHandler: (handler: EventListener) => void;
    deregisterTransitionEndHandler: (handler: EventListener) => void;
    notifyShow: () => void;
    notifyHide: () => void;
}
