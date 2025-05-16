package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.model.DifficultyEnum;
import ropold.backend.model.HighScoreModel;
import ropold.backend.repository.HighScoreRepository;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

class HighScoreServiceTest {

    IdService idService = mock(IdService.class);
    HighScoreRepository highScoreRepository = mock(HighScoreRepository.class);
    HighScoreService highScoreService = new HighScoreService(highScoreRepository, idService);

    HighScoreModel highScoreModel1 = new HighScoreModel(
            "1",
            "player1",
            "123456",
            DifficultyEnum.EASY,
            "Kangaroo",
            0,
            10.2,
            LocalDateTime.of(2025, 3, 5, 12, 0, 0)
    );

    HighScoreModel highScoreModel2 = new HighScoreModel(
            "2",
            "player1",
            "123456",
            DifficultyEnum.MEDIUM,
            "Kangaroo",
            0,
            14.5,
            LocalDateTime.of(2025, 3, 5, 11, 55, 0)
    );

    List<HighScoreModel> highScores = List.of(highScoreModel1, highScoreModel2);

    @BeforeEach
    void setup() {
        highScoreRepository.deleteAll();
        highScoreRepository.saveAll(highScores);
    }

    @Test
    void getHighScoresByDifficulty_shouldReturnHighScores() {
        // Given
        when(highScoreRepository.findByDifficultyEnumOrderByWrongAnswerCountAscScoreTimeAsc(DifficultyEnum.EASY)).thenReturn(List.of(highScoreModel1));

        List<HighScoreModel> expected = highScoreService.getHighScoresByDifficulty(DifficultyEnum.EASY);

        assertEquals(expected, List.of(highScoreModel1));
    }

    @Test
    void deleteHighScores() {
        highScoreService.deleteHighScore("1");
        verify(highScoreRepository, times(1)).deleteById("1");
    }

    @Test
    void addHighScore_whenOnlyTwoHighScoreAreInRepo() {
        HighScoreModel highScore1 = new HighScoreModel("1", "Player1", "12345", DifficultyEnum.EASY,"Kangaroo", 0,10.0, LocalDateTime.now());
        HighScoreModel highScore2 = new HighScoreModel("2", "Player2", "54321", DifficultyEnum.EASY,"Kangaroo",0,15.0, LocalDateTime.now());

        when(highScoreRepository.findByDifficultyEnumOrderByWrongAnswerCountAscScoreTimeAsc(DifficultyEnum.EASY))
                .thenReturn(List.of(highScore1, highScore2));

        HighScoreModel newHighScore = new HighScoreModel("3", "Player3", "67890", DifficultyEnum.EASY, "Kangaroo",0,12.0, LocalDateTime.now());

        when(highScoreRepository.save(any(HighScoreModel.class))).thenReturn(newHighScore);

        HighScoreModel result = highScoreService.addHighScore(newHighScore);

        assertNotNull(result);
        assertEquals("3", result.id());
        assertEquals("Player3", result.playerName());
        assertEquals(12.0, result.scoreTime(), 0.1);
    }

    @Test
    void addHighScore_shouldDeleteWorstHighScore_whenNewHighScoreIsBetterThanWorst() {
        // Arrange
        LocalDateTime fixedDate = LocalDateTime.of(2025, 3, 5, 12, 0, 0);

        List<HighScoreModel> existingScores = List.of(
                new HighScoreModel("1", "player1", "123456", DifficultyEnum.EASY,"Kangaroo",0,10.2, fixedDate),
                new HighScoreModel("2", "player1", "123456", DifficultyEnum.EASY,"Kangaroo",0,10.5, fixedDate),
                new HighScoreModel("3", "player1", "123456", DifficultyEnum.EASY,"Kangaroo",0,10.7, fixedDate),
                new HighScoreModel("4", "player1", "123456", DifficultyEnum.EASY,"Kangaroo",0,11.0, fixedDate),
                new HighScoreModel("5", "player1", "123456", DifficultyEnum.EASY,"Kangaroo",0,11.2, fixedDate),
                new HighScoreModel("6", "player1", "123456", DifficultyEnum.EASY,"Kangaroo",0,11.5, fixedDate),
                new HighScoreModel("7", "player1", "123456", DifficultyEnum.EASY,"Kangaroo",0,11.7, fixedDate),
                new HighScoreModel("8", "player1", "123456", DifficultyEnum.EASY,"Kangaroo",0,12.0, fixedDate),
                new HighScoreModel("9", "player1", "123456", DifficultyEnum.EASY,"Kangaroo",0,12.2, fixedDate),
                new HighScoreModel("10", "player1", "123456", DifficultyEnum.EASY,"Kangaroo",0,12.5, fixedDate)
        );

        when(highScoreRepository.findByDifficultyEnumOrderByWrongAnswerCountAscScoreTimeAsc(DifficultyEnum.EASY))
                .thenReturn(existingScores);

        HighScoreModel newHighScore = new HighScoreModel(
                null,
                "player1",
                "123456",
                DifficultyEnum.EASY,
                "Kangaroo",
                0,
                11.2,
                fixedDate
        );

        when(highScoreRepository.save(any(HighScoreModel.class)))
                .thenAnswer(invocation -> invocation.getArgument(0)); // simulate save returns input

        // Act
        HighScoreModel result = highScoreService.addHighScore(newHighScore);

        // Assert
        assertNotNull(result);

        verify(highScoreRepository).deleteById("10"); // schlechtester Score (12.5)
        verify(highScoreRepository).save(argThat(saved ->
                saved.id() == null &&
                        saved.playerName().equals("player1") &&
                        saved.githubId().equals("123456") &&
                        saved.difficultyEnum() == DifficultyEnum.EASY &&
                        saved.scoreTime() == 11.2 &&
                        saved.date().equals(fixedDate)
        ));
    }

}
