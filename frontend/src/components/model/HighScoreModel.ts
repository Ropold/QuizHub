
export type HighScoreModel = {
    id: string;
    playerName: string;
    githubId: string;
    difficultyEnum: string;
    categoryEnum: string;
    wrongAnswerCount: number;
    scoreTime: number;
    date: string;
}