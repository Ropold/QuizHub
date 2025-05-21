import type {QuestionModel} from "./model/QuestionModel.ts";
import {useEffect, useState} from "react";
import type {HighScoreModel} from "./model/HighScoreModel.ts";
import kangarooLogo from "../assets/categoryEnumImages/kangaroo.jpg";
import Preview from "./Preview.tsx";
import "./styles/Play.css"
import {type CategoryEnum} from "./model/CategoryEnum.ts";
import type {DifficultyEnum} from "./model/DifficultyEnum.ts";
import {categoryEnumImages} from "./utils/CategoryEnumImages.ts";
import headerLogo from "../assets/quiz-logo-header.jpg"
import {formatEnumDisplayName} from "./utils/formatEnumDisplayName.ts";
import Game from "./Game.tsx";

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
}

type DifficultyWithRandom = DifficultyEnum | "RANDOM";
type CategoryWithRandom = CategoryEnum | "RANDOM";

export default function Play(props: Readonly<ListOfAllQuestionsProps>) {
    const [showPreviewMode, setShowPreviewMode] = useState<boolean>(true);
    const [gameFinished, setGameFinished] = useState<boolean>(true);
    const [time, setTime] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [hasStartedOnce, setHasStartedOnce] = useState(false);
    const [currentQuestions, setCurrentQuestion] = useState<QuestionModel[]>([])
    const [difficultyEnum, setDifficultyEnum] = useState<DifficultyWithRandom>("RANDOM");
    const [categoryEnum, setCategoryEnum] = useState<CategoryWithRandom>("RANDOM");
    const [wrongAnswerCount, setWrongAnswerCount] = useState<number>(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const activeCategories = Array.from(
        new Set(props.activeQuestionsWithNoK.map((q) => q.categoryEnum))
    ).sort();

    const [showWinAnimation, setShowWinAnimation] = useState<boolean>(false);
    const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
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


    function handleStartGame(){
        if (!difficultyEnum || !categoryEnum) {
            setPopupMessage("Please select both difficulty and category.");
            setShowPopup(true);
            return;
        }

        selectQuestions(difficultyEnum, categoryEnum);
        setShowPreviewMode(false);
        setGameFinished(false);
        setShowNameInput(false);
    }

    function handleResetCurrentQuiz(){
        setCurrentQuestionIndex(0);
        setWrongAnswerCount(0);
        setGameFinished(false);
        setShowPreviewMode(false);
    }

    function handleHardResetGame() {
        setShowPreviewMode(true);
        setGameFinished(true);
        setTime(0);
        setIsNewHighScore(false);
        setCurrentQuestion([]);
        setWrongAnswerCount(0);
        setCurrentQuestionIndex(0);
    }

    function selectQuestions(difficulty: DifficultyEnum | "RANDOM", category: CategoryEnum | "RANDOM") {
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


    return (
        <>
            <div className="space-between">
                <button className="button-group-button" id={gameFinished ? "start-button" : undefined} onClick={handleStartGame} disabled={!gameFinished}>Start</button>
                <button className="button-group-button" disabled={gameFinished} onClick={handleResetCurrentQuiz}>Reset Current Quiz</button>
                <button className="button-group-button" onClick={handleHardResetGame}>Reset Hard</button>
            </div>
            <div className="space-between">
                {!gameFinished &&
                    <>
                        <p>Question Index {currentQuestionIndex}/10</p>
                        <p>Mistakes {wrongAnswerCount}/10</p>
                        {/*<p>⏱️ Time: {time.toFixed(1)} sec</p>*/}
                    </>
                }
            </div>

            {showPreviewMode &&
                <>
                    <div>
                        <h4>Choose a difficulty:</h4>
                        <div className="space-between">
                            <div
                                className={`clickable-header ${difficultyEnum === "KANGAROO" ? "active-button-deck-difficulty" : ""}`}
                                onClick={()=> selectQuestions("KANGAROO", "KANGAROO")}
                            >
                                <h2 className="header-title">Kangaroo</h2>
                                <img src={kangarooLogo} alt="Kangaroo Logo" className="logo-image" />
                            </div>
                            <button className={`button-group-button ${difficultyEnum === "RANDOM" ? "active-button-deck-difficulty" : ""}`} onClick={() => {setDifficultyEnum("RANDOM"); if (categoryEnum === "KANGAROO") setCategoryEnum("RANDOM")}}>Random Difficulty</button>
                            <button className={`button-group-button ${difficultyEnum === "EASY" ? "active-button-deck-difficulty" : ""}`} onClick={() => {setDifficultyEnum("EASY"); if (categoryEnum === "KANGAROO") setCategoryEnum("RANDOM")}}>Easy</button>
                            <button className={`button-group-button ${difficultyEnum === "MEDIUM" ? "active-button-deck-difficulty" : ""}`} onClick={() => {setDifficultyEnum("MEDIUM"); if (categoryEnum === "KANGAROO") setCategoryEnum("RANDOM")}}>Medium</button>
                            <button className={`button-group-button ${difficultyEnum === "HARD" ? "active-button-deck-difficulty" : ""}`} onClick={() => {setDifficultyEnum("HARD"); if (categoryEnum === "KANGAROO") setCategoryEnum("RANDOM")}}>Hard</button>
                        </div>
                    </div>

                    <div>
                        <h4>Choose a Category</h4>
                        <label className="search-bar" id="category-play">
                            <select
                                value={difficultyEnum === "KANGAROO" ? "KANGAROO" : categoryEnum}
                                onChange={(e) => setCategoryEnum(e.target.value as CategoryWithRandom)}
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
            <Game currentQuestions={currentQuestions} setGameFinished={setGameFinished} setWrongAnswerCount={setWrongAnswerCount} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex}/>
            )}
        </>
    )
}