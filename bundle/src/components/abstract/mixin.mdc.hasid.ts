import { Directive, HostBinding, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';

let nextId = 1;

/** @docs-private */
@Directive()
export class HasId {
    private _id: string | null = null;
    private cachedId: string | null = null;
    private _idChange: Subject<string> = new Subject<string>();
    // TODO: member assignments above are never executed...

    /** @internal */
    initId() {
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        this._idChange = new Subject();
    }

    /**
     * Mirrors the <code>id</code> attribute. If no id is assigned, this directive will
     * assign a unique id by itself.
     */
    @HostBinding()
    @Input() get id() {
        return this._id;
    }

    set id(value: string | null) {
        this._id = value || this._newId();
        if (this._idChange)
            this._idChange.next();
    }

    /** @internal */
    _newId(): string {
        this.cachedId = this.cachedId || `mdc-u-id-${nextId++}`;
        return this.cachedId;
    }

    /**
     * @internal
     * 
     * Subscribe to this observable to be informed of id changes.
     */
    idChange(): Observable<string> {
        return this._idChange.asObservable();
    }
}
