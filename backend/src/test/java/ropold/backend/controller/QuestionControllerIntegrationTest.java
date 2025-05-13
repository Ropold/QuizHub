package ropold.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ropold.backend.model.*;
import ropold.backend.repository.AppUserRepository;
import ropold.backend.repository.QuestionRepository;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class QuestionControllerIntegrationTest {

    @MockBean
    private Cloudinary cloudinary;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @BeforeEach
    void setUp() {
        questionRepository.deleteAll();
        appUserRepository.deleteAll();

        QuestionModel questionModel1 = new QuestionModel(
                "1",
                "Testfrage Mathe",
                DifficultyEnum.EASY,
                CategoryEnum.KANGAROO,
                "Was ist 2 + 2?",
                List.of(
                        new AnswerOption("3", false),
                        new AnswerOption("4", true),
                        new AnswerOption("5", false),
                        new AnswerOption("6", false)
                ),
                "2 + 2 ergibt 4, weil es eine einfache Addition ist.",
                true,
                "user",
                "https://example.com/image.jpg"
        );

        QuestionModel questionModel2 = new QuestionModel(
                "2",
                "Testfrage Geschichte",
                DifficultyEnum.HARD,
                CategoryEnum.HISTORY,
                "In welchem Jahr fiel die Berliner Mauer?",
                List.of(
                        new AnswerOption("1985", false),
                        new AnswerOption("1987", false),
                        new AnswerOption("1989", true),
                        new AnswerOption("1991", false)
                ),
                "Die Berliner Mauer fiel im Jahr 1989, was das Ende der Teilung Deutschlands einleitete.",
                false,
                "user",
                "https://example.com/image2.jpg"
        );

        questionRepository.saveAll(List.of(questionModel1, questionModel2));

        AppUser user = new AppUser(
                "user",
                "username",
                "Max Mustermann",
                "https://github.com/avatar",
                "https://github.com/mustermann",
                List.of("2")
        );
        appUserRepository.save(user);
    }

    @Test
    void getAllQuestions_shouldReturnAllQuestions() throws Exception {
        mockMvc.perform(get("/api/quiz-hub"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Testfrage Mathe"))
                .andExpect(jsonPath("$[1].title").value("Testfrage Geschichte"));
    }

    @Test
    void getActiveQuestions_shouldReturnActiveQuestions() throws Exception {
        mockMvc.perform(get("/api/quiz-hub/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Testfrage Mathe"));
    }

    @Test
    void getActiveKangarooQuestions_shouldReturnActiveKangarooQuestions() throws Exception {
        mockMvc.perform(get("/api/quiz-hub/active/kangaroo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Testfrage Mathe"));
    }

    @Test
    void getQuestionById_shouldReturnQuestion() throws Exception {
        mockMvc.perform(get("/api/quiz-hub/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Testfrage Mathe"));
    }

    @Test
    void postQuestion_shouldReturnCreatedQuestion() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")))
        );
        questionRepository.deleteAll();

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://www.test.de/"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/quiz-hub")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("questionModelDto", "", "application/json", """
                    {
                        "title": "Hauptstadt Europas",
                        "difficultyEnum": "MEDIUM",
                        "categoryEnum": "GEOGRAPHY",
                        "questionText": "Welche Stadt ist die Hauptstadt von Frankreich?",
                        "options": [
                            {"text": "Berlin", "isCorrect": false},
                            {"text": "Madrid", "isCorrect": false},
                            {"text": "Paris", "isCorrect": true},
                            {"text": "Rom", "isCorrect": false}
                        ],
                        "answerExplanation": "Paris ist die Hauptstadt von Frankreich.",
                        "isActive": true,
                        "githubId": "user",
                        "imageUrl": "https://example.com/france.jpg"
                    }
                    """.getBytes())))
                .andExpect(status().isCreated());

        // Validate question was saved
        List<QuestionModel> allQuestions = questionRepository.findAll();
        Assertions.assertEquals(1, allQuestions.size());

        QuestionModel savedQuestion = allQuestions.getFirst();
        org.assertj.core.api.Assertions.assertThat(savedQuestion)
                .usingRecursiveComparison()
                .ignoringFields("id", "imageUrl")
                .isEqualTo(new QuestionModel(
                        null,
                        "Hauptstadt Europas",
                        DifficultyEnum.MEDIUM,
                        CategoryEnum.GEOGRAPHY,
                        "Welche Stadt ist die Hauptstadt von Frankreich?",
                        List.of(
                                new AnswerOption("Berlin", false),
                                new AnswerOption("Madrid", false),
                                new AnswerOption("Paris", true),
                                new AnswerOption("Rom", false)
                        ),
                        "Paris ist die Hauptstadt von Frankreich.",
                        true,
                        "user",
                        null
                ));
    }

    @Test
    void postQuestionWithNoImage_shouldReturnCreatedQuestion() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")))
        );
        questionRepository.deleteAll();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/quiz-hub/no-image")
                        .contentType("application/json")
                        .content("""
                    {
                        "title": "Hauptstadt Europas",
                        "difficultyEnum": "MEDIUM",
                        "categoryEnum": "GEOGRAPHY",
                        "questionText": "Welche Stadt ist die Hauptstadt von Frankreich?",
                        "options": [
                            {"text": "Berlin", "isCorrect": false},
                            {"text": "Madrid", "isCorrect": false},
                            {"text": "Paris", "isCorrect": true},
                            {"text": "Rom", "isCorrect": false}
                        ],
                        "answerExplanation": "Paris ist die Hauptstadt von Frankreich.",
                        "isActive": true,
                        "githubId": "user"
                    }
                    """))
                .andExpect(status().isCreated());

        // Validate question was saved
        List<QuestionModel> allQuestions = questionRepository.findAll();
        Assertions.assertEquals(1, allQuestions.size());

        QuestionModel savedQuestion = allQuestions.getFirst();
        org.assertj.core.api.Assertions.assertThat(savedQuestion)
                .usingRecursiveComparison()
                .ignoringFields("id", "imageUrl")
                .isEqualTo(new QuestionModel(
                        null,
                        "Hauptstadt Europas",
                        DifficultyEnum.MEDIUM,
                        CategoryEnum.GEOGRAPHY,
                        "Welche Stadt ist die Hauptstadt von Frankreich?",
                        List.of(
                                new AnswerOption("Berlin", false),
                                new AnswerOption("Madrid", false),
                                new AnswerOption("Paris", true),
                                new AnswerOption("Rom", false)
                        ),
                        "Paris ist die Hauptstadt von Frankreich.",
                        true,
                        "user",
                        null
                ));
    }

    @Test
    void updateWithPut_shouldReturnUpdatedQuestion() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/quiz-hub/1")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("questionModelDto", "", "application/json", """
                        {
                            "title": "Aktualisierte Hauptstadtfrage",
                            "difficultyEnum": "MEDIUM",
                            "categoryEnum": "GEOGRAPHY",
                            "questionText": "Was ist die Hauptstadt von Italien?",
                            "options": [
                                {"text": "Paris", "isCorrect": false},
                                {"text": "Rom", "isCorrect": true},
                                {"text": "Madrid", "isCorrect": false},
                                {"text": "Berlin", "isCorrect": false}
                            ],
                            "answerExplanation": "Rom ist die Hauptstadt von Italien.",
                            "isActive": true,
                            "githubId": "user",
                            "imageUrl": "https://example.com/updated-image.jpg"
                        }
                    """.getBytes()))
                        .contentType("multipart/form-data")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Aktualisierte Hauptstadtfrage"))
                .andExpect(jsonPath("$.questionText").value("Was ist die Hauptstadt von Italien?"))
                .andExpect(jsonPath("$.answerExplanation").value("Rom ist die Hauptstadt von Italien."))
                .andExpect(jsonPath("$.imageUrl").value("https://example.com/updated-image.jpg"));

        QuestionModel updated = questionRepository.findById("1").orElseThrow();
        Assertions.assertEquals("Aktualisierte Hauptstadtfrage", updated.title());
    }

    @Test
    void deleteQuestion_shouldReturnNoContent() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/quiz-hub/1"))
                .andExpect(status().isNoContent());

        Assertions.assertFalse(questionRepository.existsById("1"));
    }

}
