
export type DifficultyEnum = "EASY" | "MEDIUM" | "HARD" | "KANGAROO";
export const ALL_DIFFICULTIES: DifficultyEnum[] = ["EASY", "MEDIUM", "HARD", "KANGAROO"];

export function getDifficultyEnumDisplayName(difficultyEnum: DifficultyEnum): string {
    const difficultyEnumDisplayNames: Record<DifficultyEnum, string> = {
        EASY: "Easy",
        MEDIUM: "Medium",
        HARD: "Hard",
        KANGAROO: "Kangaroo"
    }
    return difficultyEnumDisplayNames[difficultyEnum]
}

