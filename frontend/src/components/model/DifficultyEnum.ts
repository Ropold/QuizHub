export type DifficultyEnum = "KANGAROO" | "RANDOM" | "EASY" | "MEDIUM" | "HARD";
export type NullableDifficultyEnum = DifficultyEnum | "";

export const ALL_DIFFICULTIES: DifficultyEnum[] = ["KANGAROO", "RANDOM", "EASY", "MEDIUM", "HARD"];

export function getDifficultyEnumDisplayName(difficultyEnum: NullableDifficultyEnum): string {
    const difficultyEnumDisplayNames: Record<DifficultyEnum, string> = {
        KANGAROO: "Kangaroo",
        RANDOM: "Random",
        EASY: "Easy",
        MEDIUM: "Medium",
        HARD: "Hard",
    };

    if (difficultyEnum === "") return "Please select a difficulty";
    return difficultyEnumDisplayNames[difficultyEnum];
}
