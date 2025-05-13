
export type DifficultyEnum = "EASY" | "MEDIUM" | "HARD";
export const ALL_DIFFICULTIES: DifficultyEnum[] = ["EASY", "MEDIUM", "HARD"];

export function getDifficultyEnumDisplayName(difficultyEnum: DifficultyEnum): string {
    const difficultyEnumDisplayNames: Record<DifficultyEnum, string> = {
        EASY: "Easy",
        MEDIUM: "Medium",
        HARD: "Hard",
    }
    return difficultyEnumDisplayNames[difficultyEnum]
}

