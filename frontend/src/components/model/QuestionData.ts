import type {NullableDifficultyEnum} from "./DifficultyEnum.ts";
import type {NullableCategoryEnum} from "./CategoryEnum.ts";

export type QuestionData = {
    title: string;
    difficultyEnum: NullableDifficultyEnum;
    categoryEnum: NullableCategoryEnum;
    questionText: string;
    options: { text: string; isCorrect: boolean }[];
    answerExplanation: string;
    isActive: boolean;
    githubId: string;
    imageUrl: string | null;
};