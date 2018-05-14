import { asBoolean, asBooleanOrNull } from './value.utils';

describe('Value Utils', () => {
    it('asBoolean should return correct values', (() => {
        expect(asBoolean(null)).toBe(false);
        expect(asBoolean(undefined)).toBe(false);
        expect(asBoolean(false)).toBe(false);
        expect(asBoolean('false')).toBe(false);

        expect(asBoolean(true)).toBe(true);
        expect(asBoolean(0)).toBe(true);
        expect(asBoolean('0')).toBe(true);
        expect(asBoolean(1)).toBe(true);
        expect(asBoolean('')).toBe(true);
        expect(asBoolean({})).toBe(true);
    }));

    it('asBooleanOrNull should return correct values', (() => {
        expect(asBooleanOrNull(null)).toBeNull();
        expect(asBooleanOrNull(undefined)).toBeUndefined();

        expect(asBooleanOrNull(false)).toBe(false);
        expect(asBooleanOrNull('false')).toBe(false);

        expect(asBooleanOrNull(true)).toBe(true);
        expect(asBooleanOrNull(0)).toBe(true);
        expect(asBooleanOrNull('0')).toBe(true);
        expect(asBooleanOrNull(1)).toBe(true);
        expect(asBooleanOrNull('')).toBe(true);
        expect(asBooleanOrNull({})).toBe(true);
    }));
});
