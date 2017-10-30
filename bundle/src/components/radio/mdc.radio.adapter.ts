/** @docs-private */
export interface MdcRadioAdapter {
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    getNativeControl: () => HTMLInputElement;
}
