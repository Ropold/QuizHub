package ropold.backend.controller;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import ropold.backend.model.AnswerOption;
import ropold.backend.model.AppUser;
import ropold.backend.model.DifficultyEnum;
import ropold.backend.model.QuestionModel;
import ropold.backend.repository.AppUserRepository;
import ropold.backend.repository.QuestionRepository;

import java.util.List;

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
    void getQuestionById_shouldReturnQuestion() throws Exception {
        mockMvc.perform(get("/api/quiz-hub/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Testfrage Mathe"));
    }


}
