/** @docs-private */
export interface MdcIconButtonToggleAdapter {
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    registerInteractionHandler: (type: string, handler: EventListener) => void;
    deregisterInteractionHandler: (type: string, handler: EventListener) => void;
    setText: (text: string) => void;
    // getTabIndex/setTabIndex: not used (foundation calls getTabIndex but does nothing with it)
    // also, since this is supposed to be a button element, the tabIndex doesn't need tinkering
    // with from the foundation, so left out:
    // getTabIndex: () => number;
    // setTabIndex: (tabIndex: number) => void;
    getAttr: (name: string) => string;
    setAttr: (name: string, value: string) => void;
    // removeAttr is never called by the foundation, left out:
    // removeAttr: (name: string) => void;
    notifyChange: (evtData: { isOn: boolean }) => void;
}