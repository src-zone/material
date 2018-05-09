import { MdcSlidableDrawerAdapter } from './mdc.slidable.drawer.adapter';

/** @docs-private */
export interface MdcTemporaryDrawerAdapter extends MdcSlidableDrawerAdapter {
    addBodyClass: (className: string) => void;
    removeBodyClass: (className: string) => void;
    updateCssVariable: (value: string) => void;
    eventTargetHasClass: (target: HTMLElement, className: string) => boolean;
}
