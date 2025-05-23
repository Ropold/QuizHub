export type CategoryEnum =
    "KANGAROO" |
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

export type NullableCategoryEnum = CategoryEnum | "";

export const ALL_CATEGORIES: CategoryEnum[] = [
    "KANGAROO",
    "ART",
    "GENERAL_KNOWLEDGE",
    "GEOGRAPHY",
    "HISTORY",
    "LITERATURE",
    "MATHEMATICS",
    "MOVIES_AND_TV",
    "MUSIC",
    "POLITICS",
    "SCIENCE",
    "SPORTS"
];

export function getCategoryEnumDisplayName(categoryEnum: NullableCategoryEnum): string {
    const categoryEnumDisplayNames: Record<CategoryEnum, string> = {
        KANGAROO: "Kangaroo",
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
    };

    if (categoryEnum === "") return "Please select a category";
    return categoryEnumDisplayNames[categoryEnum];
}
