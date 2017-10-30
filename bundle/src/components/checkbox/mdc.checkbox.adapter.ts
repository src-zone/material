/** @docs-private */
export interface MdcCheckboxAdapter {
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    registerAnimationEndHandler: (handler: EventListener) => void;
    deregisterAnimationEndHandler: (handler: EventListener) => void;
    registerChangeHandler: (handler: EventListener) => void;
    deregisterChangeHandler: (handler: EventListener) => void;
    getNativeControl: () => HTMLInputElement;
    forceLayout: () => void;
    isAttachedToDOM: () => boolean;
}
