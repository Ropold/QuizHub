package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.exception.QuestionNotFoundException;
import ropold.backend.model.CategoryEnum;
import ropold.backend.model.QuestionModel;
import ropold.backend.repository.QuestionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final IdService idService;
    private final QuestionRepository questionRepository;
    private final CloudinaryService cloudinaryService;

    public List<QuestionModel> getAllQuestions() {return questionRepository.findAll();}

    public List<QuestionModel> getActiveQuestions() {
        return questionRepository.findAll().stream()
                .filter(QuestionModel::isActive)
                .filter(question -> question.categoryEnum() != CategoryEnum.KANGAROO)
                .toList();
    }

    public List<QuestionModel> getActiveKangarooQuestions() {
        return questionRepository.findAll().stream()
                .filter(questionModel -> questionModel.categoryEnum() == CategoryEnum.KANGAROO)
                .filter(QuestionModel::isActive)
                .toList();
    }

    public List<QuestionModel> getAllActiveQuestions() {
        return questionRepository.findAll().stream()
                .filter(QuestionModel::isActive)
                .toList();
    }

    public QuestionModel getQuestionById(String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new QuestionNotFoundException("Question not found"));
    }

    public List<QuestionModel> getQuestionsByIds(List<String> favoriteQuestionIds) {
        return questionRepository.findAllById(favoriteQuestionIds);
    }

    public QuestionModel addQuestion(QuestionModel questionModel) {
        QuestionModel newQuestionModel = new QuestionModel(
                idService.generateRandomId(),
                questionModel.title(),
                questionModel.difficultyEnum(),
                questionModel.categoryEnum(),
                questionModel.questionText(),
                questionModel.options(),
                questionModel.answerExplanation(),
                questionModel.isActive(),
                questionModel.githubId(),
                questionModel.imageUrl()
        );
        return questionRepository.save(newQuestionModel);
    }

    public QuestionModel updateQuestion(QuestionModel questionModel) {
        QuestionModel existingQuestion = getQuestionById(questionModel.id());

        boolean oldHadImage = existingQuestion.imageUrl() != null && !existingQuestion.imageUrl().isBlank();
        boolean nowNoImage = questionModel.imageUrl() == null || questionModel.imageUrl().isBlank();
        boolean imageWasReplaced = oldHadImage && !existingQuestion.imageUrl().equals(questionModel.imageUrl());

        if (oldHadImage && (nowNoImage || imageWasReplaced)) {
            cloudinaryService.deleteImage(existingQuestion.imageUrl());
        }

        return questionRepository.save(questionModel);
    }

    public void deleteQuestion(String id) {
        QuestionModel questionModel = questionRepository.findById(id)
                .orElseThrow(() -> new QuestionNotFoundException("No Question found with id: " + id));

        if (questionModel.imageUrl() != null) {
            cloudinaryService.deleteImage(questionModel.imageUrl());
        }
        questionRepository.deleteById(id);
    }

    //nicht getestet im questionServiceTest
    public List<QuestionModel> getQuestionsForGithubUser(String githubId) {
        return questionRepository.findAll().stream()
                .filter(questionModel -> questionModel.githubId().equals(githubId))
                .toList();
    }

    public QuestionModel toggleQuestionActive(String id) {
        QuestionModel questionModel = questionRepository.findById(id)
                .orElseThrow(() -> new QuestionNotFoundException("No Question found with id: " + id));

        QuestionModel updatedQuestionModel = new QuestionModel(
                questionModel.id(),
                questionModel.title(),
                questionModel.difficultyEnum(),
                questionModel.categoryEnum(),
                questionModel.questionText(),
                questionModel.options(),
                questionModel.answerExplanation(),
                !questionModel.isActive(),
                questionModel.githubId(),
                questionModel.imageUrl()
        );
        return questionRepository.save(updatedQuestionModel);
    }

    public List<QuestionModel> addQuestions(List<QuestionModel> questions) {
        List<QuestionModel> questionsWithIds = questions.stream()
                .map(q -> new QuestionModel(
                        idService.generateRandomId(),
                        q.title(),
                        q.difficultyEnum(),
                        q.categoryEnum(),
                        q.questionText(),
                        q.options(),
                        q.answerExplanation(),
                        q.isActive(),
                        q.githubId(),
                        q.imageUrl()
                ))
                .toList();

        return questionRepository.saveAll(questionsWithIds);
    }
}
