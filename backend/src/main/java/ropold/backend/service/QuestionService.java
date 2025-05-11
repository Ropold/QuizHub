package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.QuestionModel;
import ropold.backend.repository.QuestionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final IdService idService;
    private final QuestionRepository questionRepository;
    private final CloudinaryService cloudinaryService;


    public List<QuestionModel> getAllQuestions() {
    }

    public List<QuestionModel> getActiveQuestions() {
    }

    public QuestionModel getQuestionById(String id) {
    }

    public QuestionModel addQuestion(QuestionModel questionModel) {
    }

    public QuestionModel updateQuestion(QuestionModel questionModel) {
    }

    public void deleteQuestion(String id) {
    }

    public List<QuestionModel> getQuestionsByIds(List<String> favoritePieceImageIds) {
    }

    public List<QuestionModel> getQuestionsForGithubUser(String githubId) {
    }
}
