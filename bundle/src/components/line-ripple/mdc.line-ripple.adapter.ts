import { MDCLineRippleFoundation } from '@material/line-ripple';

/** @docs-private */
export interface MdcLineRippleAdapter {
    addClass: (className: string) => void,
    removeClass: (className: string) => void,
    hasClass: (className) => boolean,
    setAttr: (name: string, value: string) => void,
    registerEventHandler: (evtType: string, handler: EventListener) => void,
    deregisterEventHandler: (evtType: string, handler: EventListener) => void
}