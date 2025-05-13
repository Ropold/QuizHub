package ropold.backend.model;

import java.util.List;

public record QuestionModel(
        String id,
        String title,
        DifficultyEnum difficultyEnum,
        CategoryEnum categoryEnum,
        String questionText,
        List<AnswerOption> options,
        String answerExplanation,
        boolean isActive,
        String githubId,
        String imageUrl
) {
}
