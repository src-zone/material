/** @docs-private */
export interface MdcNotchedOutlineAdapter {
    getWidth: () => number;
    getHeight: () => number;
    addClass: (className: string) => void,
    removeClass: (className: string) => void,
    setOutlinePathAttr: (value: string) => void,
    getIdleOutlineStyleValue: (propertyName: string) => string
}
