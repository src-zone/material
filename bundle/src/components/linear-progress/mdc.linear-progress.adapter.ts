/** @docs-private */
export interface MdcLinearProgressAdapter {
    addClass: (className: string) => void;
    getPrimaryBar: () => Element;
    getBuffer: () => Element;
    hasClass: (className: string) => boolean;
    removeClass: (className: string) => void;
    setStyle: (el: Element, styleProperty: string, value: number) => void;
}