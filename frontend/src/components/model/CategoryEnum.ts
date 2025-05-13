
export type CategoryEnum =
    "ART" |
    "GENERAL_KNOWLEDGE" |
    "GEOGRAPHY" |
    "HISTORY" |
    "LITERATURE" |
    "MATHEMATICS" |
    "MOVIES_AND_TV" |
    "MUSIC" |
    "POLITICS" |
    "SCIENCE" |
    "SPORTS";


export const ALL_CATEGORIES: CategoryEnum[] = ["ART", "GENERAL_KNOWLEDGE", "GEOGRAPHY", "HISTORY", "LITERATURE", "MATHEMATICS", "MOVIES_AND_TV", "MUSIC", "POLITICS", "SCIENCE", "SPORTS"];

export function getCategoryEnumDisplayName(categoryEnum: CategoryEnum): string {
    const categoryEnumDisplayNames: Record<CategoryEnum, string> = {
        ART: "Art",
        GENERAL_KNOWLEDGE: "General Knowledge",
        GEOGRAPHY: "Geography",
        HISTORY: "History",
        LITERATURE: "Literature",
        MATHEMATICS: "Mathematics",
        MOVIES_AND_TV: "Movies and TV",
        MUSIC: "Music",
        POLITICS: "Politics",
        SCIENCE: "Science",
        SPORTS: "Sports"
    }
    return categoryEnumDisplayNames[categoryEnum]
}