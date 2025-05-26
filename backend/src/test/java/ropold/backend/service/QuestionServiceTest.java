package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import ropold.backend.model.AnswerOption;
import ropold.backend.model.CategoryEnum;
import ropold.backend.model.DifficultyEnum;
import ropold.backend.model.QuestionModel;
import ropold.backend.repository.QuestionRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

class QuestionServiceTest {

    IdService idService = mock(IdService.class);
    QuestionRepository questionRepository = mock(QuestionRepository.class);
    CloudinaryService cloudinaryService = mock(CloudinaryService.class);
    QuestionService questionService = new QuestionService(idService, questionRepository, cloudinaryService);

    List<QuestionModel> questionModels;

    @BeforeEach
    void setup(){
        QuestionModel questionModel1 = new QuestionModel(
                "1",
                "What is the capital of France?",
                DifficultyEnum.MEDIUM,
                CategoryEnum.GEOGRAPHY,
                "What is the capital of France?",
                List.of(
                        new AnswerOption("Paris", true),
                        new AnswerOption("London", false),
                        new AnswerOption("Berlin", false),
                        new AnswerOption("Madrid", false)
                ),
                "The capital of France is Paris.",
                true,
                "user",
                "https://example.com/question1.jpg"
        );

        QuestionModel questionModel2 = new QuestionModel(
                "2",
                "What is the capital of Germany?",
                DifficultyEnum.MEDIUM,
                CategoryEnum.KANGAROO,
                "What is the capital of Germany?",
                List.of(
                        new AnswerOption("Paris", false),
                        new AnswerOption("London", false),
                        new AnswerOption("Berlin", true),
                        new AnswerOption("Madrid", false)
                ),
                "The capital of Germany is Berlin.",
                true,
                "user",
                "https://example.com/question2.jpg"
        );


        questionModels = List.of(questionModel1, questionModel2);
        // Verhalten des Mocks definieren
        when(questionRepository.findAll()).thenReturn(questionModels);
    }

    @Test
    void testGetAllQuestions() {
        List<QuestionModel> result = questionService.getAllQuestions();
        assertEquals(questionModels, result);
    }

    @Test
    void testGetActiveQuestionsWithNoK() {
        List<QuestionModel> expected = questionModels.stream()
                .filter(QuestionModel::isActive)
                .filter(q -> q.categoryEnum() != CategoryEnum.KANGAROO)
                .toList();

        List<QuestionModel> result = questionService.getActiveQuestions();

        assertEquals(expected, result);
    }

    @Test
    void testGetActiveKangarooQuestions() {
        List<QuestionModel> result = questionService.getActiveKangarooQuestions();
        List<QuestionModel> expected = questionModels.stream()
                .filter(q -> q.categoryEnum() == CategoryEnum.KANGAROO && q.isActive())
                .toList();
        assertEquals(expected, result);
    }

    @Test
    void testGetActiveAllQuestions() {
        List<QuestionModel> result = questionService.getAllActiveQuestions();
        List<QuestionModel> expected = questionModels.stream()
                .filter(QuestionModel::isActive)
                .toList();
        assertEquals(expected, result);
    }

    @Test
    void testGetQuestionById() {
        QuestionModel expected = questionModels.getFirst();
        when(questionRepository.findById("1")).thenReturn(java.util.Optional.of(expected));
        QuestionModel result = questionService.getQuestionById("1");
        assertEquals(expected, result);
    }

    @Test
    void testGetQuestionsByIds() {
        List<String> questionIds = List.of("1", "2");
        when(questionRepository.findAllById(questionIds)).thenReturn(questionModels);
        List<QuestionModel> result = questionService.getQuestionsByIds(questionIds);
        assertEquals(questionModels, result);
    }

    @Test
    void testAddQuestion() {
        QuestionModel questionModel3 = new QuestionModel(
                "3",
                "What is the capital of Italy?",
                DifficultyEnum.MEDIUM,
                CategoryEnum.GEOGRAPHY,
                "What is the capital of Italy?",
                List.of(
                        new AnswerOption("Rome", true),
                        new AnswerOption("London", false),
                        new AnswerOption("Berlin", false),
                        new AnswerOption("Madrid", false)
                ),
                "The capital of Italy is Rome.",
                true,
                "user",
                "https://example.com/question3.jpg"
        );

        when(idService.generateRandomId()).thenReturn("3");
        when(questionRepository.save(questionModel3)).thenReturn(questionModel3);

        QuestionModel expected = questionService.addQuestion(questionModel3);

        assertEquals(questionModel3, expected);
        verify(idService, times(1)).generateRandomId();
        verify(questionRepository, times(1)).save(questionModel3);
    }

    @Test
    void testUpdateQuestion() {
        QuestionModel updatedQuestionModel = new QuestionModel(
                "1",
                "What is the capital of France?",
                DifficultyEnum.MEDIUM,
                CategoryEnum.GEOGRAPHY,
                "What is the capital of France?",
                List.of(
                        new AnswerOption("Paris", true),
                        new AnswerOption("London", false),
                        new AnswerOption("Berlin", false),
                        new AnswerOption("Madrid", false)
                ),
                "The capital of France is Paris.",
                true,
                "user",
                "https://example.com/question1.jpg"
        );

        when(questionRepository.findById("1")).thenReturn(Optional.of(updatedQuestionModel));
        when(questionRepository.save(updatedQuestionModel)).thenReturn(updatedQuestionModel);

        QuestionModel result = questionService.updateQuestion(updatedQuestionModel);

        assertEquals(updatedQuestionModel, result);

        // verify(questionRepository, times(1)).existsById("1");  // <-- Entfernen!
        verify(questionRepository, times(1)).save(updatedQuestionModel);
    }


    @Test
    void testDeleteQuestion() {
        QuestionModel questionModel = questionModels.getFirst();
        when(questionRepository.findById("1")).thenReturn(java.util.Optional.of(questionModel));
        questionService.deleteQuestion("1");
        verify(questionRepository, times(1)).deleteById("1");
        verify(cloudinaryService, times(1)).deleteImage(questionModel.imageUrl());
    }

    @Test
    void testGetQuestionsForGithubUser() {
        String githubId = "user";
        List<QuestionModel> expectedQuestions = questionModels.stream()
                .filter(questionModel -> questionModel.githubId().equals(githubId))
                .toList();

        when(questionRepository.findAll()).thenReturn(questionModels);

        List<QuestionModel> result = questionService.getQuestionsForGithubUser(githubId);

        assertEquals(expectedQuestions, result);
        verify(questionRepository, times(1)).findAll();
    }


    @Test
    void testToggleQuestionActive() {
        QuestionModel questionModel = questionModels.getFirst();
        when(questionRepository.findById("1")).thenReturn(Optional.of(questionModel));

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

        when(questionRepository.findById("1")).thenReturn(Optional.of(questionModel));
        when(questionRepository.save(any(QuestionModel.class))).thenReturn(updatedQuestionModel);

        QuestionModel expected = questionService.toggleQuestionActive("1");

        //then
        assertEquals(updatedQuestionModel, expected);
        verify(questionRepository, times(1)).findById("1");
        verify(questionRepository, times(1)).save(updatedQuestionModel);
    }

    @Test
    void testAddQuestions() {
        QuestionModel input1 = new QuestionModel(
                null,
                "Title 1",
                DifficultyEnum.EASY,
                CategoryEnum.ART,
                "Question text 1",
                List.of(
                        new AnswerOption("A1", true),
                        new AnswerOption("A2", false),
                        new AnswerOption("A3", false),
                        new AnswerOption("A4", false)
                ),
                "Explanation 1",
                true,
                "user1",
                "http://image1.jpg"
        );

        QuestionModel input2 = new QuestionModel(
                null,
                "Title 2",
                DifficultyEnum.HARD,
                CategoryEnum.ART,
                "Question text 2",
                List.of(
                        new AnswerOption("B1", false),
                        new AnswerOption("B2", true),
                        new AnswerOption("B3", false),
                        new AnswerOption("B4", false)
                ),
                "Explanation 2",
                true,
                "user2",
                "http://image2.jpg"
        );

        List<QuestionModel> inputQuestions = List.of(input1, input2);

        when(idService.generateRandomId()).thenReturn("id1", "id2");
        when(questionRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        ArgumentCaptor<List<QuestionModel>> captor = ArgumentCaptor.forClass(List.class);

        List<QuestionModel> result = questionService.addQuestions(inputQuestions);

        verify(idService, times(2)).generateRandomId();
        verify(questionRepository).saveAll(captor.capture());

        List<QuestionModel> savedQuestions = captor.getValue();

        assertEquals(2, savedQuestions.size());
        assertEquals("id1", savedQuestions.get(0).id());
        assertEquals("id2", savedQuestions.get(1).id());
        assertEquals(savedQuestions, result);
    }


}
