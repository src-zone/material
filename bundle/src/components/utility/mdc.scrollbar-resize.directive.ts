import { Directive, Input, OnDestroy } from '@angular/core';
import { asBoolean } from '../../utils/value.utils';

let scrollbarResizeListenerId: string;
let scrollbarResizeDirectives = 0;

function initScrollbarResizeListener() {
    if (scrollbarResizeListenerId)
        return;
    // create an invisible iframe, covering the full width of the window:
    let iframe = document.createElement('iframe');
    iframe.id = scrollbarResizeListenerId = 'scrollbarResizeListener_' + Math.random().toString(36).substr(2, 10)
    iframe.style.cssText = 'position:absolute;margin:0;padding:0;border-width:0;overflow:hidden;height:0;width:100%;background-color:transparent;';
    // make the iframe contentWindow listen to resize events (they will be triggered when the container adds or removes a
    // vertical scrollbar, since it changes the width):
    iframe.onload = function() {
      iframe.contentWindow.addEventListener('resize', function() {
        try {
          var evt = document.createEvent('UIEvents');
          evt.initUIEvent('resize', true, false, window, 0);
          window.dispatchEvent(evt);
        } catch(e) {}
      });
    };
    // add to the page:
    document.body.appendChild(iframe);
}

function destroyScrollbarResizeListener() {
    if (scrollbarResizeListenerId != null) {
        let iframe = document.getElementById(scrollbarResizeListenerId);
        if (iframe)
            iframe.parentElement.removeChild(iframe);
        scrollbarResizeListenerId = null;
    }
}

// TODO: add viewport option to do this for other elements that may
//  get a scrollbar, and therefore influence their childrens layout.

/**
 * Utility directive to trigger window 'resize' events not only when the browser window
 * is resized, but also when the browser window gets a vertical scrollbar.
 * This solves problems with directives that base their layout or position on the
 * width of the document body. When a scrollbar is added, the body width changes, but the browser
 * doesn't fire a 'resize' (or other) event. As long as at least one <code>mdcScrollbarResize</code>
 * directive is active on the page, 'resize' events will also be fired when the body width changes
 * as a consequence of the addition or removal of a vertical toolbar.
 * The directive adds a hidden iframe to the page, that contains the trickery to make this happen.
 * See this <a href="https://gist.github.com/OrganicPanda/8222636">hacky-scrollbar-resize-listener.js
 * github gist</a> for the original idea.
 */
@Directive({
    selector: '[mdcScrollbarResize]'
})
export class MdcScrollbarResizeDirective implements OnDestroy {
    private _scrollbarResize = false;

    constructor() {
    }

    ngOnDestroy() {
        if (this._scrollbarResize) {
            this._scrollbarResize = false;
            --scrollbarResizeDirectives;
            if (scrollbarResizeDirectives <= 0)
                destroyScrollbarResizeListener();
        }
    }

    /**
     * Set to false to disable triggering resize events because of addition/deletion of a scrollbar.
     * The <code>mdcScrollbarResize</code> behavior is removed after <strong>all</strong>
     * <code>mdcScrollbarResize</code> directives on the page are removed or have the value false.
     */
    @Input() get mdcScrollbarResize() {
        return this._scrollbarResize;
    }

    set mdcScrollbarResize(val: any) {
        let newValue = asBoolean(val);
        if (newValue !== this._scrollbarResize) {
            this._scrollbarResize = newValue;
            if (newValue) {
                ++scrollbarResizeDirectives;
                initScrollbarResizeListener();
            } else {
                --scrollbarResizeDirectives;
                if (scrollbarResizeDirectives <= 0)
                    destroyScrollbarResizeListener();
            }
        }
    }
}
