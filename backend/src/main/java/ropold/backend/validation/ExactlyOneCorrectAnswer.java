package ropold.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ExactlyOneCorrectAnswerValidator.class)
@Target({ ElementType.FIELD })  // Gilt für Felder, z. B. List<AnswerOption>
@Retention(RetentionPolicy.RUNTIME)
public @interface ExactlyOneCorrectAnswer {

    // Fehlermeldung, wenn Validierung fehlschlägt
    String message() default "Exactly one answer must be marked as correct";

    // Boilerplate für Jakarta Validation
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
