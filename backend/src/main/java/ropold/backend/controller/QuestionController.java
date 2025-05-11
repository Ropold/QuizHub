package ropold.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ropold.backend.model.QuestionModel;
import ropold.backend.model.QuestionModelDto;
import ropold.backend.service.CloudinaryService;
import ropold.backend.service.QuestionService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/quiz-hub")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public List<QuestionModel> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @GetMapping("/active")
    public List<QuestionModel> getActiveQuestions() {
        return questionService.getActiveQuestions();
    }

    @GetMapping("/{id}")
    public QuestionModel getQuestionById(@PathVariable String id) {
        QuestionModel questionModel = questionService.getQuestionById(id);
        if (questionModel == null) {
            throw new QuestionNotFoundException("No Question found with id: " + id);
        }
        return questionModel;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public QuestionModel addQuestion(
            @RequestPart("questionModelDto") @Valid QuestionModelDto questionModelDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        String authenticatedUserId = authentication.getName();
        if (!authenticatedUserId.equals(questionModelDto.githubId())) {
            throw new AccessDeniedException("You do not have permission to add this Question.");
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }

        return questionService.addQuestion(
                new QuestionModel(
                        null,
                        questionModelDto.title(),
                        questionModelDto.difficulty(),
                        questionModelDto.questionText(),
                        questionModelDto.options(),
                        questionModelDto.answerExplanation(),
                        questionModelDto.isActive(),
                        questionModelDto.githubId(),
                        imageUrl
                )
        );

}
