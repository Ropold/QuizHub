
export function getCategoryNameForHighScore(categoryEnum: string): string {
    if (!categoryEnum) return '';
    return categoryEnum.charAt(0) + categoryEnum.slice(1).toLowerCase();
}
