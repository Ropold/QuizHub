package ropold.backend.controller;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ropold.backend.model.AnswerOption;
import ropold.backend.model.AppUser;
import ropold.backend.model.DifficultyEnum;
import ropold.backend.model.QuestionModel;
import ropold.backend.repository.AppUserRepository;
import ropold.backend.repository.QuestionRepository;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AppUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @BeforeEach
    void setUp() {
        appUserRepository.deleteAll();
        questionRepository.deleteAll();

        AppUser user = new AppUser(
                "user",
                "username",
                "Max Mustermann",
                "https://github.com/avatar",
                "https://github.com/mustermann",
                List.of("2")
        );
        appUserRepository.save(user);

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
    }

    @Test
    void testGetMe_withLoggedInUser_expectUsername() throws Exception {
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getName()).thenReturn("user");

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("user"));
    }

    @Test
    void testGetMe_withoutLogin_expectAnonymousUsername() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("anonymousUser"));
    }

    @Test
    void testGetUserDetails_withLoggedInUser_expectUserDetails() throws Exception {
        // Erstellen eines Mock OAuth2User
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getAttributes()).thenReturn(Map.of(
                "login", "username",
                "name", "max mustermann",
                "avatar_url", "https://github.com/avatar",
                "html_url", "https://github.com/mustermann"
        ));

        // Simuliere den OAuth2User in der SecurityContext
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(get("/api/users/me/details"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                {
                    "login": "username",
                    "name": "max mustermann",
                    "avatar_url": "https://github.com/avatar",
                    "html_url": "https://github.com/mustermann"
                }
            """));
    }

    @Test
    void testGetUserDetails_withoutLogin_expectErrorMessage() throws Exception {
        mockMvc.perform(get("/api/users/me/details"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                {
                    "message": "User not authenticated"
                }
            """));
    }

    @Test
    void TestGetUserFavorites_ShouldReturnUserFavorites() throws Exception {
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/users/me/my-questions/user")
                                .with(oidcLogin().idToken(i -> i.claim("sub", "user")))
                )
                .andExpect(status().isOk())
                .andExpect(content().json("""
            [
                {
                    "id": "1",
                    "title": "Testfrage Mathe",
                    "difficultyEnum": "EASY",
                    "questionText": "Was ist 2 + 2?",
                    "options": [
                        {"text": "3", "isCorrect": false},
                        {"text": "4", "isCorrect": true},
                        {"text": "5", "isCorrect": false},
                        {"text": "6", "isCorrect": false}
                    ],
                    "answerExplanation": "2 + 2 ergibt 4, weil es eine einfache Addition ist.",
                    "isActive": true,
                    "githubId": "user",
                    "imageUrl": "https://example.com/image.jpg"
                },
                {
                    "id": "2",
                    "title": "Testfrage Geschichte",
                    "difficultyEnum": "HARD",
                    "questionText": "In welchem Jahr fiel die Berliner Mauer?",
                    "options": [
                        {"text": "1985", "isCorrect": false},
                        {"text": "1987", "isCorrect": false},
                        {"text": "1989", "isCorrect": true},
                        {"text": "1991", "isCorrect": false}
                    ],
                    "answerExplanation": "Die Berliner Mauer fiel im Jahr 1989, was das Ende der Teilung Deutschlands einleitete.",
                    "isActive": false,
                    "githubId": "user",
                    "imageUrl": "https://example.com/image2.jpg"
                }
            ]
        """));
    }

    @Test
    @WithMockUser(username = "user")
    void getUserFavorites_shouldReturnUserFavorites() throws Exception {
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/users/favorites")
                                .with(oidcLogin().idToken(i -> i.claim("sub", "user")))
                )
                .andExpect(status().isOk())
                .andExpect(content().json("""
            [
                {
                    "id": "2",
                    "title": "Testfrage Geschichte",
                    "difficultyEnum": "HARD",
                    "questionText": "In welchem Jahr fiel die Berliner Mauer?",
                    "options": [
                        {"text": "1985", "isCorrect": false},
                        {"text": "1987", "isCorrect": false},
                        {"text": "1989", "isCorrect": true},
                        {"text": "1991", "isCorrect": false}
                    ],
                    "answerExplanation": "Die Berliner Mauer fiel im Jahr 1989, was das Ende der Teilung Deutschlands einleitete.",
                    "isActive": false,
                    "githubId": "user",
                    "imageUrl": "https://example.com/image2.jpg"
                }
            ]
        """));
    }

    @Test
    void addQuestionToFavorites_shouldAddQuestionAndReturnFavorites() throws Exception {
        AppUser userBefore = appUserRepository.findById("user").orElseThrow();
        Assertions.assertFalse(userBefore.favoriteQuestions().contains("1"));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/users/favorites/1")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user"))))
                .andExpect(status().isCreated());

        AppUser updatedUser = appUserRepository.findById("user").orElseThrow();
        Assertions.assertTrue(updatedUser.favoriteQuestions().contains("1"));
    }

    @Test
    void removeQuestionFromFavorites_shouldRemoveQuestionAndReturnFavorites() throws Exception {
        AppUser userBefore = appUserRepository.findById("user").orElseThrow();
        Assertions.assertTrue(userBefore.favoriteQuestions().contains("2"));

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/users/favorites/2")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user")))
                )
                .andExpect(status().isNoContent()); // .isOk = 200, .isNoContent = 204

        AppUser updatedUser = appUserRepository.findById("user").orElseThrow();
        Assertions.assertFalse(updatedUser.favoriteQuestions().contains("2"));
    }

    @Test
    void ToggleActiveStatus_shouldToggleActiveStatus() throws Exception {
        QuestionModel memoryBefore = questionRepository.findById("1").orElseThrow();
        Assertions.assertTrue(memoryBefore.isActive());

        mockMvc.perform(MockMvcRequestBuilders.put("/api/users/1/toggle-active")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user")))
                )
                .andExpect(status().isOk());

        QuestionModel updatedMemory = questionRepository.findById("1").orElseThrow();
        Assertions.assertFalse(updatedMemory.isActive());
    }

}
