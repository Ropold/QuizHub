package ropold.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ropold.backend.model.AnswerOption;

import java.util.List;

public class ExactlyOneCorrectAnswerValidator implements ConstraintValidator<ExactlyOneCorrectAnswer, List<AnswerOption>> {

    @Override
    public boolean isValid(List<AnswerOption> options, ConstraintValidatorContext context) {
        if (options == null || options.size() != 4) {
            return false;
        }

        // Zähle, wie viele Antworten korrekt sind (isCorrect == true)
        long correctCount = options.stream()
                .filter(AnswerOption::isCorrect)
                .count();

        // Es muss genau eine sein – nicht null, nicht zwei, nicht vier
        return correctCount == 1;
    }
}

