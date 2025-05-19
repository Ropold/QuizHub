package ropold.backend.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.DifficultyEnum;
import ropold.backend.model.HighScoreModel;
import ropold.backend.repository.HighScoreRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HighScoreService {

    private final HighScoreRepository highScoreRepository;
    private final IdService idService;

    public List<HighScoreModel> getHighScoresByDifficulty(String difficultyEnum) {
        return highScoreRepository.findByDifficultyEnumOrderByWrongAnswerCountAscScoreTimeAsc(difficultyEnum);
    }

    public HighScoreModel addHighScore(@Valid HighScoreModel highScoreModel) {
        HighScoreModel newHighScoreModel = new HighScoreModel(
                idService.generateRandomId(),
                highScoreModel.playerName(),
                highScoreModel.githubId(),
                highScoreModel.difficultyEnum(),
                highScoreModel.categoryEnum(),
                highScoreModel.wrongAnswerCount(),
                highScoreModel.scoreTime(),
                highScoreModel.date()
        );

        // Hole alle bisherigen Scores für diesen Schwierigkeitsgrad, sortiert
        List<HighScoreModel> existingScores = highScoreRepository
                .findByDifficultyEnumOrderByWrongAnswerCountAscScoreTimeAsc(newHighScoreModel.difficultyEnum());

        // Wenn noch weniger als 10 vorhanden → einfach speichern
        if (existingScores.size() < 10) {
            return highScoreRepository.save(newHighScoreModel);
        }

        // Prüfe, ob der neue Score besser ist als der schlechteste existierende
        HighScoreModel worstScore = existingScores.get(9); // Platz 10

        boolean isWorse =
                newHighScoreModel.wrongAnswerCount() > worstScore.wrongAnswerCount() ||
                        (newHighScoreModel.wrongAnswerCount() == worstScore.wrongAnswerCount()
                                && newHighScoreModel.scoreTime() >= worstScore.scoreTime());

        if (isWorse) {
            // Neuer Score ist schlechter oder gleich → nicht speichern
            return null;
        }

        // Neuer Score ist besser → ersetze den schlechtesten
        highScoreRepository.deleteById(worstScore.id());
        return highScoreRepository.save(newHighScoreModel);
    }


    public void deleteHighScore(String id) {
        highScoreRepository.deleteById(id);
    }
}
