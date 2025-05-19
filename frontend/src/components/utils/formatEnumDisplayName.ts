export function formatEnumDisplayName(enumValue: string): string {
    if (!enumValue) return "";
    return enumValue.charAt(0).toUpperCase() + enumValue.slice(1).toLowerCase();
}
