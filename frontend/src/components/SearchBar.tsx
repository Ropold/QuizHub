import {type DifficultyEnum, getDifficultyEnumDisplayName} from "./model/DifficultyEnum.ts";
import {type CategoryEnum, getCategoryEnumDisplayName} from "./model/CategoryEnum.ts";
import type {QuestionModel} from "./model/QuestionModel.ts";
import headerLogo from "../assets/quiz-logo-header.jpg"
import {categoryEnumImages} from "./utils/CategoryEnumImages.ts";


type SearchBarProps = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    selectedDifficultyEnum: DifficultyEnum | "";
    setSelectedDifficultyEnum: (value: DifficultyEnum | "") => void;
    selectedCategoryEnum: CategoryEnum | "";
    setSelectedCategoryEnum: (value: CategoryEnum | "") => void;
    activeQuestions: QuestionModel[];
};


export default function SearchBar(props: Readonly<SearchBarProps>) {
    const {
        searchQuery,
        setSearchQuery,
        selectedDifficultyEnum,
        setSelectedDifficultyEnum,
        selectedCategoryEnum,
        setSelectedCategoryEnum,
        activeQuestions
    } = props;

    const categoryTypes = Array.from(new Set(activeQuestions.map((question) => question.categoryEnum))).sort();

    const difficultyTypes = Array.from(new Set(activeQuestions.map((question) => question.difficultyEnum))).sort();

    const handleReset = () => {
        setSearchQuery("");
        setSelectedDifficultyEnum("");
        setSelectedCategoryEnum("");
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by title or other fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <label>
                <select
                    value={selectedDifficultyEnum}
                    onChange={(e) => setSelectedDifficultyEnum(e.target.value as DifficultyEnum | "")}
                >
                    <option value="">Filter by Category</option>
                    {difficultyTypes.map((type) => (
                        <option key={type} value={type}>
                            {getDifficultyEnumDisplayName(type)}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                <select
                    value={categoryTypes}
                    onChange={(e) => setSelectedCategoryEnum(e.target.value as CategoryEnum | "")}
                >
                    <option value="">Filter by Animal</option>
                    {categoryTypes.map((type) => (
                        <option key={type} value={type}>
                            {getCategoryEnumDisplayName(type)}
                        </option>
                    ))}
                </select>
            </label>
            <img
                src={
                    selectedCategoryEnum
                        ? categoryEnumImages[selectedCategoryEnum as CategoryEnum]
                        : headerLogo
                }
                alt={selectedCategoryEnum || "logo quiz hub"}
                className="quiz-image-searchbar"
            />
            <button
                onClick={handleReset}
                className={`${searchQuery || selectedCategoryEnum ? "button-group-button" : "button-grey"}`}
            >
                Reset Filters
            </button>
        </div>
    );
}