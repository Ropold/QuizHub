import type {QuestionModel} from "./model/QuestionModel.ts";
import {useEffect, useState} from "react";
import type {HighScoreModel} from "./model/HighScoreModel.ts";
import kangarooLogo from "../assets/categoryEnumImages/kangaroo.jpg";
import Preview from "./Preview.tsx";
import "./styles/Play.css"
import {type CategoryEnum} from "./model/CategoryEnum.ts";
import type {DifficultyEnum, NullableDifficultyEnum} from "./model/DifficultyEnum.ts";
import {categoryEnumImages} from "./utils/CategoryEnumImages.ts";
import headerLogo from "../assets/quiz-logo-header.jpg"
import {formatEnumDisplayName} from "./utils/formatEnumDisplayName.ts";
import Game from "./Game.tsx";
import axios from "axios";

type ListOfAllQuestionsProps = {
    user: string;
    activeQuestionsWithNoK: QuestionModel[];
    allActiveKangarooQuestions: QuestionModel[];
    highScoreEasy: HighScoreModel[];
    getHighScoreEasy: () => void;
    highScoreMedium: HighScoreModel[];
    getHighScoreMedium: () => void;
    highScoreHard: HighScoreModel[];
    getHighScoreHard: () => void;
    highScoreKangaroo: HighScoreModel[];
    getHighScoreKangaroo: () => void;
    highScoreRandom: HighScoreModel[];
    getHighScoreRandom: () => void;
}

type CategoryWithRandom = CategoryEnum | "RANDOM";

export default function Play(props: Readonly<ListOfAllQuestionsProps>) {
    const [showPreviewMode, setShowPreviewMode] = useState<boolean>(true);
    const [gameFinished, setGameFinished] = useState<boolean>(true);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [currentQuestions, setCurrentQuestion] = useState<QuestionModel[]>([])
    const [difficultyEnum, setDifficultyEnum] = useState<NullableDifficultyEnum>("");
    const [categoryEnum, setCategoryEnum] = useState<CategoryWithRandom>("RANDOM");
    const [wrongAnswerCount, setWrongAnswerCount] = useState<number>(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [resetSignal, setResetSignal] = useState<number>(0);

    const activeCategories = Array.from(
        new Set(props.activeQuestionsWithNoK.map((q) => q.categoryEnum))
    ).sort();

    const [showWinAnimation, setShowWinAnimation] = useState<boolean>(false);
    const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
    const [playerName, setPlayerName] = useState<string>("");
    const [time, setTime] = useState<number>(0);
    const [showNameInput, setShowNameInput] = useState<boolean>(false);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState("");

    useEffect(() => {
        if (!showPreviewMode && !gameFinished) {
            setTime(0);
            const id = window.setInterval(() => {
                setTime((prev) => prev + 0.1);
            }, 100);
            setIntervalId(id);
        } else if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [showPreviewMode, gameFinished]);


    function handleStartGame() {
        if (!difficultyEnum || !categoryEnum) {
            setPopupMessage("Please select both difficulty and category.");
            setShowPopup(true);
            return;
        }

        // Reset all relevant state
        setCurrentQuestionIndex(0);
        setWrongAnswerCount(0);
        setIsNewHighScore(false);
        setShowNameInput(false);
        setShowWinAnimation(false);
        setTime(0);
        setResetSignal(prev => prev + 1);

        // Select questions and start game
        selectQuestions(difficultyEnum, categoryEnum);
        setShowPreviewMode(false);
        setGameFinished(false);
        setShowNameInput(false);
    }


    function handleResetCurrentQuiz() {
        setCurrentQuestionIndex(0);
        setWrongAnswerCount(0);
        setIsNewHighScore(false);
        setShowNameInput(false);
        setShowWinAnimation(false);
        setGameFinished(false);
        setShowPreviewMode(false);
        setResetSignal(prev => prev + 1);
    }


    function handleHardResetGame() {
        setShowPreviewMode(true);
        setGameFinished(true);
        setTime(0);
        setIsNewHighScore(false);
        setCurrentQuestion([]);
        setWrongAnswerCount(0);
        setCurrentQuestionIndex(0);
        setDifficultyEnum("");
        setCategoryEnum("RANDOM");
    }

    function selectQuestions(difficulty: DifficultyEnum , category: CategoryEnum | "RANDOM") {
        let questions: QuestionModel[];

        if (difficulty === "KANGAROO") {
            questions = [...props.allActiveKangarooQuestions];
        } else {
            questions = [...props.activeQuestionsWithNoK];

            if (difficulty !== "RANDOM") {
                questions = questions.filter(q => q.difficultyEnum === difficulty);
            }

            if (category !== "RANDOM") {
                questions = questions.filter(q => q.categoryEnum === category);
            }
        }

        const shuffled = questions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);

        setCurrentQuestion(selected);

        setDifficultyEnum(difficulty);
        setCategoryEnum(category);
    }

    function postHighScore() {
        const highScoreData = {
            id: null,
            playerName: playerName,
            githubId: props.user,
            difficultyEnum: difficultyEnum,
            categoryEnum: categoryEnum,
            wrongAnswerCount: wrongAnswerCount,
            scoreTime: parseFloat(time.toFixed(1)),
            date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        }

        axios.post("/api/high-score", highScoreData)
            .then(() => {
                setShowNameInput(false);

                switch (difficultyEnum) {
                    case "EASY":
                        props.getHighScoreEasy();
                        break;
                    case "MEDIUM":
                        props.getHighScoreMedium();
                        break;
                    case "HARD":
                        props.getHighScoreHard();
                        break;
                    case "KANGAROO":
                        props.getHighScoreKangaroo();
                        break;
                    case "RANDOM":
                        props.getHighScoreRandom();
                        break;
                    default:
                        // Optional: bei RANDOM oder unbekannt ggf. alle laden oder nichts machen
                        break;
                }
            })
            .catch(console.error);

    }

    function handleSaveHighScore() {
        if (playerName.trim().length < 3) {
            setPopupMessage("Your name must be at least 3 characters long!");
            setShowPopup(true);
            return;
        }
        postHighScore();
    }

    function checkForHighScore() {
        switch (difficultyEnum) {
            case "EASY":
            case "MEDIUM":
            case "HARD":
            case "KANGAROO":
            case "RANDOM": {
                const highScores =
                    difficultyEnum === "EASY" ? props.highScoreEasy :
                        difficultyEnum === "MEDIUM" ? props.highScoreMedium :
                            difficultyEnum === "HARD" ? props.highScoreHard :
                                difficultyEnum === "KANGAROO" ? props.highScoreKangaroo :
                                    props.highScoreRandom;

                if (highScores.length < 10) {
                    setIsNewHighScore(true);
                    setShowNameInput(true);
                    return;
                }

                const lowestHighScore = highScores[highScores.length - 1];
                const isBetterScore =
                    wrongAnswerCount < lowestHighScore.wrongAnswerCount ||
                    (wrongAnswerCount === lowestHighScore.wrongAnswerCount && time < lowestHighScore.scoreTime);

                if (isBetterScore) {
                    setIsNewHighScore(true);
                    setShowNameInput(true);
                }
                break;
            }
            default:
                break;
        }
    }

    useEffect(() => {
        if (gameFinished && currentQuestionIndex === 9) {
            checkForHighScore();
        }
    }, [gameFinished]);

    const getWinClass = () => {
        if (wrongAnswerCount === 0) return "win-animation win-animation-perfect";
        if (wrongAnswerCount <= 2) return "win-animation win-animation-good";
        if (wrongAnswerCount <= 5) return "win-animation win-animation-ok";
        return "win-animation win-animation-bad";
    };

    return (
        <>
            <div className="space-between">
                <button className="button-group-button" id={gameFinished && difficultyEnum !== "" ? "start-button" : undefined} onClick={handleStartGame} disabled={!gameFinished || difficultyEnum === ""}>Start</button>
                <button className="button-group-button" disabled={gameFinished} onClick={handleResetCurrentQuiz}>Reset Current Quiz</button>
                <button className="button-group-button" onClick={handleHardResetGame}>Reset Hard</button>
            </div>

            {!showPreviewMode &&
                <div className="space-between">
                    <p>Question Index {currentQuestionIndex + 1}/10</p>
                    <p>Mistakes {wrongAnswerCount}/10</p>
                    {/*<p>⏱️ Time: {time.toFixed(1)} sec</p>*/}
                </div>
            }

            {isNewHighScore && showNameInput && (
                <form
                    className="high-score-input"
                    onSubmit={(e) => {
                        e.preventDefault(); // Verhindert das Neuladen der Seite
                        handleSaveHighScore();
                    }}
                >
                    <label htmlFor="playerName">
                        Congratulations! You secured a spot on the high score list. Enter your name:
                    </label>
                    <input
                        className="playerName"
                        type="text"
                        id="playerName"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                    />
                    <button
                        className="button-group-button"
                        id="button-border-animation"
                        type="submit"
                    >
                        Save Highscore
                    </button>
                </form>
            )}

            {showWinAnimation && (
                <div className={getWinClass()}>
                    <p>
                        🎉 You completed the quiz
                        {wrongAnswerCount === 0
                            ? " perfectly with no mistakes! Incredible job! 🌟"
                            : wrongAnswerCount <= 2
                                ? ` with only ${wrongAnswerCount} mistake${wrongAnswerCount === 1 ? "" : "s"}. Excellent result! 💪`
                                : wrongAnswerCount <= 5
                                    ? ` with ${wrongAnswerCount} mistakes. Solid effort – some tricky questions there! 🧠`
                                    : wrongAnswerCount < 10
                                        ? ` with ${wrongAnswerCount} mistakes. It was a tough quiz – better luck next time! 🤔`
                                        : " but missed every question. That was brutal – give it another shot! 🔄"}
                    </p>
                </div>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Hinweis</h3>
                        <p>{popupMessage}</p>
                        <div className="popup-actions">
                            <button onClick={() => setShowPopup(false)} className="popup-confirm">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPreviewMode &&
                <>
                    <div>
                        <h4>Choose a Difficulty:</h4>
                        <div className="space-between">
                            <div
                                className={`clickable-header ${difficultyEnum === "KANGAROO" ? "active-button-deck-difficulty" : ""}`}
                                onClick={()=> selectQuestions("KANGAROO", "KANGAROO")}>
                                <h2 className="header-title">Kangaroo</h2>
                                <img src={kangarooLogo} alt="Kangaroo Logo" className="logo-image" />
                            </div>

                            <button
                                className={`button-group-button ${difficultyEnum === "RANDOM" ? "active-button-deck-difficulty" : ""}`}
                                onClick={() => {setDifficultyEnum("RANDOM"); if (categoryEnum === "KANGAROO") setCategoryEnum("RANDOM");}}>
                                Random Difficulty
                            </button>

                            <button
                                className={`button-group-button ${difficultyEnum === "EASY" ? "active-button-deck-difficulty" : ""}`}
                                onClick={() => {setDifficultyEnum("EASY");if (categoryEnum === "KANGAROO") setCategoryEnum("RANDOM");}}
                                disabled={ categoryEnum !== "KANGAROO" && !props.activeQuestionsWithNoK.some((q) =>
                                        q.difficultyEnum === "EASY" && (categoryEnum === "RANDOM" || q.categoryEnum === categoryEnum))}>
                                Easy
                            </button>

                            <button
                                className={`button-group-button ${difficultyEnum === "MEDIUM" ? "active-button-deck-difficulty" : ""}`}
                                onClick={() => {setDifficultyEnum("MEDIUM");if (categoryEnum === "KANGAROO") setCategoryEnum("RANDOM");}}
                                disabled={categoryEnum !== "KANGAROO" && !props.activeQuestionsWithNoK.some((q) =>
                                            q.difficultyEnum === "MEDIUM" && (categoryEnum === "RANDOM" || q.categoryEnum === categoryEnum))}>
                                Medium
                            </button>

                            <button
                                className={`button-group-button ${difficultyEnum === "HARD" ? "active-button-deck-difficulty" : ""}`}
                                onClick={() => {setDifficultyEnum("HARD"); if (categoryEnum === "KANGAROO") setCategoryEnum("RANDOM");}}
                                disabled={categoryEnum !== "KANGAROO" && !props.activeQuestionsWithNoK.some((q) =>
                                            q.difficultyEnum === "HARD" && (categoryEnum === "RANDOM" || q.categoryEnum === categoryEnum))}>
                                Hard
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4>Choose a Category:</h4>
                        <label className="search-bar" id="category-play">
                            <select
                                value={difficultyEnum === "KANGAROO" ? "KANGAROO" : categoryEnum}
                                onChange={(e) => {
                                    const selectedCategory = e.target.value as CategoryWithRandom;
                                    setCategoryEnum(selectedCategory);

                                    if (
                                        difficultyEnum &&
                                        difficultyEnum !== "RANDOM" &&
                                        difficultyEnum !== "KANGAROO" &&
                                        !props.activeQuestionsWithNoK.some(q =>
                                            q.difficultyEnum === difficultyEnum &&
                                            (selectedCategory === "RANDOM" || q.categoryEnum === selectedCategory)
                                        )
                                    ) {
                                        setDifficultyEnum("RANDOM");
                                    }
                                }}
                                disabled={difficultyEnum === "KANGAROO"}
                            >
                                {difficultyEnum === "KANGAROO" ? (
                                    <option value="KANGAROO">🦘 Kangaroo</option>
                                ) : (
                                    <>
                                        <option value="RANDOM">🎲 Random Category</option>
                                        {activeCategories.map((category) => (
                                            <option key={category} value={category}>
                                                {formatEnumDisplayName(category)}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                            <img
                                src={
                                    categoryEnum !== "RANDOM"
                                        ? categoryEnumImages[categoryEnum as CategoryEnum]
                                        : headerLogo
                                }
                                alt={categoryEnum || "logo quiz hub"}
                                className="play-category-card-image"
                            />
                        </label>
                    </div>


                    <Preview/>
                </>}

            {!showPreviewMode && currentQuestions && currentQuestions.length > 0 && (
            <Game currentQuestions={currentQuestions} setGameFinished={setGameFinished} setWrongAnswerCount={setWrongAnswerCount} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} setShowWinAnimation={setShowWinAnimation} resetSignal={resetSignal}/>
            )}
        </>
    )
}