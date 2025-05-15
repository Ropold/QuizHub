import type {DifficultyEnum} from "./DifficultyEnum.ts";
import type {CategoryEnum} from "./CategoryEnum.ts";

export type AnswerOption = {
    text: string;
    isCorrect: boolean;
};

export type QuestionModel = {
    id: string;
    title: string;
    difficultyEnum: DifficultyEnum;
    categoryEnum: CategoryEnum;
    questionText: string;
    options: AnswerOption[];
    answerExplanation: string;
    isActive: boolean;
    githubId: string;
    imageUrl: string;
};

export const DefaultQuestion: QuestionModel = {
    id: "",
    title: "Loading....",
    difficultyEnum: "EASY",
    categoryEnum: "ART",
    questionText: "QuestionText",
    options: [
        { text: "Option 1", isCorrect: false },
        { text: "Option 2", isCorrect: false },
        { text: "Option 3", isCorrect: true },
        { text: "Option 4", isCorrect: false },
    ],
    answerExplanation: "AnswerExplanation",
    isActive: true,
    githubId: "",
    imageUrl: "https://dummyimage.com/300x200/cccccc/000000&text=No+Image+Available",
};
