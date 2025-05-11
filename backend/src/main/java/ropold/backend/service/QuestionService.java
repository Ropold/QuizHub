package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.exception.QuestionNotFoundException;
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
    }

    public QuestionModel updateQuestion(QuestionModel questionModel) {
    }

    public void deleteQuestion(String id) {
    }


    public List<QuestionModel> getQuestionsForGithubUser(String githubId) {
    }

    public QuestionModel toggleAnimalActive(String id) {
    }
}
