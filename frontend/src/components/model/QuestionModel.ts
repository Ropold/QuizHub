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
    imageUrl: string | null;
};

export const DefaultQuestion: QuestionModel = {
    id: "",
    title: "Capital of France",
    difficultyEnum: "EASY",
    categoryEnum: "GEOGRAPHY",
    questionText: "What is the capital of France?",
    options: [
        { text: "Berlin", isCorrect: false },
        { text: "Madrid", isCorrect: false },
        { text: "Paris", isCorrect: true },
        { text: "Rome", isCorrect: false },
    ],
    answerExplanation: "Paris is the capital city of France, known for its art, gastronomy, and culture.",
    isActive: true,
    githubId: "154427648",
    imageUrl: null,
};
