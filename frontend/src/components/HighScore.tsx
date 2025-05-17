import type {HighScoreModel} from "./model/HighScoreModel.ts";
import axios from "axios";
import {useEffect, useState} from "react";
import {getDifficultyEnumDisplayName} from "./model/DifficultyEnum.ts";
import "./styles/HighScore.css"
import {getCategoryNameForHighScore} from "./utils/getCategoryNameForHighScore.ts";

type HighScoreProps = {
    highScoreEasy: HighScoreModel[];
    getHighScoreEasy: () => void;
    highScoreMedium: HighScoreModel[];
    getHighScoreMedium: () => void;
    highScoreHard: HighScoreModel[];
    getHighScoreHard: () => void;
    highScoreKangaroo: HighScoreModel[];
    getHighScoreKangaroo: () => void;
}

const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(date).toLocaleDateString("de-DE", options);
};

export default function HighScore(props: Readonly<HighScoreProps>) {
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [githubUsernames, setGithubUsernames] = useState<Map<string, string>>(new Map());

    function fetchGithubUsernames(highScores: HighScoreModel[]) {
        const uniqueIds = new Set(
            highScores
                .filter(score => score.githubId !== "anonymousUser")
                .map(score => score.githubId)
        );

        const newUsernames = new Map(githubUsernames);

        uniqueIds.forEach(async (id) => {
            if (!newUsernames.has(id)) {
                axios.get(`https://api.github.com/user/${id}`)
                    .then((response) => {
                        newUsernames.set(id, response.data.login);
                        setGithubUsernames(new Map(newUsernames));
                    })
                    .catch((error) => {
                        console.error(`Error fetching GitHub user ${id}:`, error);
                    });
            }
        });
    }

    useEffect(() => {
        fetchGithubUsernames([...props.highScoreEasy, ...props.highScoreMedium, ...props.highScoreHard, ...props.highScoreKangaroo]);
    }, [props.highScoreEasy, props.highScoreMedium, props.highScoreHard, props.highScoreKangaroo]);

    useEffect(() => {
        props.getHighScoreEasy();
        props.getHighScoreMedium();
        props.getHighScoreHard();
        props.getHighScoreKangaroo();
    }, []);

    const handleTableSelect = (tableId: string) => {
        setSelectedTable(tableId);
    };

    const handleBack = () => {
        setSelectedTable(null);
    };

    const renderCompressedTable = (highScores: HighScoreModel[], cardType: string) => (
        <div className="high-score-table-compressed" onClick={() => handleTableSelect(cardType)}>
            <h3 className="high-score-table-compressed-h3">{cardType} High-Score</h3>
            <table>
                <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Time</th>
                </tr>
                </thead>
                <tbody>
                {highScores.map((highScore, index) => (
                    <tr key={highScore.id}>
                        <td>{index + 1}</td>
                        <td>{highScore.playerName}</td>
                        <td>{highScore.scoreTime}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    const renderDetailedTable = (highScores: HighScoreModel[], cardType: string, isSelected: boolean) => {
        if (!isSelected) return null;

        return (
            <div className="high-score-table">
                <h3 className="high-score-table-h3">{cardType} High-Score</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player-Name</th>
                        <th>Date</th>
                        <th>Difficulty</th>
                        <th>Category</th>
                        <th>Wrong Answers</th>
                        <th>Authentication</th>
                        <th>Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {highScores.map((highScore, index) => (
                        <tr key={highScore.id}>
                            <td>{index + 1}</td>
                            <td>{highScore.playerName}</td>
                            <td>{formatDate(highScore.date)}</td>
                            <td>{getDifficultyEnumDisplayName(highScore.difficultyEnum)}</td>
                            <td>{getCategoryNameForHighScore(highScore.categoryEnum)}</td>
                            <td>{highScore.wrongAnswerCount}</td>
                            <td>
                                {highScore.githubId === "anonymousUser"
                                    ? "Anonymous"
                                    : `Github-User (${githubUsernames.get(highScore.githubId) || "Loading..."})`}
                            </td>
                            <td>{highScore.scoreTime}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="high-score">
            <div className={selectedTable === null ? 'high-score-item-container-compressed' : 'high-score-item-container-detailed'}>
                {selectedTable === null ? (
                    <>
                        {renderCompressedTable(props.highScoreEasy, "Easy")}
                        {renderCompressedTable(props.highScoreMedium, "Medium")}
                        {renderCompressedTable(props.highScoreHard, "Hard")}
                        {renderCompressedTable(props.highScoreKangaroo, "Kangaroo")}
                    </>
                ) : (
                    <>
                        {renderDetailedTable(props.highScoreEasy, "Easy", selectedTable === "Easy")}
                        {renderDetailedTable(props.highScoreMedium, "Medium", selectedTable === "Medium")}
                        {renderDetailedTable(props.highScoreHard, "Hard", selectedTable === "Hard")}
                        {renderDetailedTable(props.highScoreKangaroo, "Kangaroo", selectedTable === "Kangaroo")}
                    </>
                )}
            </div>
            {selectedTable !== null && (
                <button onClick={handleBack} className="button-group-button">Back to Overview</button>
            )}
        </div>
    );
}