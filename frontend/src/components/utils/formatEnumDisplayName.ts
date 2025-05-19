export function formatEnumDisplayName(value: string): string {
    switch (value) {
        case "KANGAROO": return "🦘 Kangaroo";
        case "ART": return "🎨 Art";
        case "GENERAL_KNOWLEDGE": return "📚 General Knowledge";
        case "GEOGRAPHY": return "🗺️ Geography";
        case "HISTORY": return "🏺 History";
        case "LITERATURE": return "📖 Literature";
        case "MATHEMATICS": return "➗ Mathematics";
        case "MOVIES_AND_TV": return "🎬 Movies and TV";
        case "MUSIC": return "🎵 Music";
        case "POLITICS": return "🏛️ Politics";
        case "SCIENCE": return "🔬 Science";
        case "SPORTS": return "🏅 Sports";

        case "EASY": return "🟢 Easy";
        case "MEDIUM": return "🟡 Medium";
        case "HARD": return "🔴 Hard";

        case "RANDOM": return "🎲 Random Choice";

        default: return value;
    }
}
