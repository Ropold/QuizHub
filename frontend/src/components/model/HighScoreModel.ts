import type {DifficultyEnum} from "./DifficultyEnum.ts";

export type HighScoreModel = {
    id: string;
    playerName: string;
    githubId: string;
    difficultyEnum: DifficultyEnum;
    categoryEnum: string;
    wrongAnswerCount: number;
    scoreTime: number;
    date: string;
}