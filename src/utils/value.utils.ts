export function asBoolean(value: any) {
    return value != null && `${value}` !== 'false';
}
