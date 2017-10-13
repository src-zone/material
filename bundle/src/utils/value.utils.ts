export function asBoolean(value: any) {
    return value != null && `${value}` !== 'false';
}

export function asBooleanOrNull(value: any) {
    if (value == null)
        return value;
    return `${value}` !== 'false';
}
