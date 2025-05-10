package ropold.backend.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import ropold.backend.validation.ExactlyOneCorrectAnswer;

import java.util.List;

public record QuestionModelDto(
        @NotBlank
        @Size(min = 3, message = "Title must be at least 3 characters long")
        String title,

        @NotNull(message = "Difficulty is required")
        DifficultyEnum difficulty,

        @Size(min = 5, message = "Question Text must be at least 5 characters long")
        String questionText,

        @Size(min = 4, max = 4, message = "Exactly 4 answer options are required")
        @ExactlyOneCorrectAnswer (message = "Exactly one answer option must be marked as correct")
        @Valid
        List<AnswerOption> options,

        String answerExplanation,
        boolean isActive,
        String githubId,

        @NotBlank(message = "Image URL cannot be blank")
        String imageUrl
) {
}
