export type DifficultyEnum = "EASY" | "MEDIUM" | "HARD" | "KANGAROO";
export type NullableDifficultyEnum = DifficultyEnum | "";

export const ALL_DIFFICULTIES: DifficultyEnum[] = ["EASY", "MEDIUM", "HARD", "KANGAROO"];

export function getDifficultyEnumDisplayName(difficultyEnum: NullableDifficultyEnum): string {
    const difficultyEnumDisplayNames: Record<DifficultyEnum, string> = {
        EASY: "Easy",
        MEDIUM: "Medium",
        HARD: "Hard",
        KANGAROO: "Kangaroo"
    };

    if (difficultyEnum === "") return "Please select a difficulty";
    return difficultyEnumDisplayNames[difficultyEnum];
}
