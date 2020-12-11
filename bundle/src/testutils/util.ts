/**
 * Like spyOnAllFunctions, but that function has a bug in the current Jasmine, leading to exception
 * when trying it on a foundation class.
 */
export function spyOnAll(object: any) {
    let pointer = object;
    while (pointer) {
        for (const prop in pointer) {
            if (object[prop] && object[prop].and)
                // already spied on:
                continue;
            if (Object.prototype.hasOwnProperty.call(pointer, prop) && pointer[prop] instanceof Function) {
                const descriptor = Object.getOwnPropertyDescriptor(pointer, prop);
                if ((descriptor!.writable || descriptor!.set) && descriptor!.configurable) {
                    spyOn(object, prop).and.callThrough();
                }
            }
        }
        pointer = Object.getPrototypeOf(pointer);
    }
    return object;
}
