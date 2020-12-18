import { QueryList, Renderer2, ElementRef } from '@angular/core';

/** @docs-private */
export interface ElementProvider {
    readonly _elm: ElementRef;
}

/** @docs-private 
 * TODO: add private documentation
 * 
 * call afterContentInit in ngAfterContentInit of parent directive/component
 * call onDestroy in ngOnDestroy of parent directive/component
*/
export abstract class MdcStandIn<T extends ElementProvider> {
    private _initialized = false;
    private _standIn: ElementRef | null = null;
    private _actor: T | null = null;

    /**
     * @param elements The query-list for actor components, that require a standin ElementRef if the list is empty.
     *   This should be a member of the parent directive/component, and have a <code>@ContentChildren</code> annotation.
     */
    constructor(private elements: QueryList<T>, private _rndr: Renderer2) {
    }

    /**
     * Return the ElementRef of the currently active actor or standin. Can be null
     * only if the component is not yet initialized, or has already been destroyed.
     */
    get element() {
        return this._standIn ? this._standIn : this.elements.first._elm;
    }

    /**
     * This function is called when a stand-in ElementRef must be created (either because no
     * actor components are available, or the last one has been removed from the DOM)
     */
    abstract createStandIn(): ElementRef;

    /**
    * This function is called when a stand-in ElementRef must be destroyed, either because an
    * actual actor directive/component has just been added to the elements list, or the onDestroy method is called
    * when a standIn was active.
    */
    destroyStandIn(standIn: ElementRef) {
        if (standIn && standIn.nativeElement.parentElement)
            this._rndr.removeChild(standIn.nativeElement.parentElement, standIn.nativeElement);
    }

    /**
     * This function is called when a (new) actor becomes active, i.e. when the first element of the
     * elements list gets a new value.
     */
    createActor(newActor: T) {}

    /** 
     * This function is called when an active actor is to be destroyed, either because the elements list
     * becomes empty (createStandIn will be called after this), or the first element changes (createActor
     * will be called after this), or the onDestroy method is called when an actor was active.
     */
    destroyActor(actor: T) {}

    /**
     * This method must be called on the ngOnContentInit of the component/directive that uses the StandIn.
     */
    afterContentInit() {
        this.elements.changes.subscribe(() => {
            this.afterChanges();
        });
        this._initialized = true;
        this.afterChanges();
    }

    /**
     * This method must be called on the ngDestroy of the component/directive that uses the StandIn.
     */
    onDestroy() {
        this._initialized = false;
        if (this._standIn) {
            this.destroyStandIn(this._standIn);
            this._standIn = null;
        }
        if (this._actor) {
            this.destroyActor(this._actor);
            this._actor = null;
        }
    }

    private afterChanges() {
        if (this._initialized) {
            if (this._actor && this._actor !== this.elements.first) {
                this.destroyActor(this._actor);
                this._actor = null;
            }
            if (this._standIn && this.elements.length > 0) {
                this.destroyStandIn(this._standIn);
                this._standIn = null;
            }
            if (this.elements.length > 0 && this._actor == null) {
                this._actor = this.elements.first;
                this.createActor(this._actor);
            }
            if (this._standIn == null && this._actor == null)
                this._standIn = this.createStandIn();
        }
    }
}
