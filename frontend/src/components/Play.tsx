import type {QuestionModel} from "./model/QuestionModel.ts";
import {useEffect, useState} from "react";
import type {HighScoreModel} from "./model/HighScoreModel.ts";
import kangarooLogo from "../assets/categoryEnumImages/kangaroo.jpg";
import Preview from "./Preview.tsx";
import "./styles/Play.css"
import type {CategoryEnum} from "./model/CategoryEnum.ts";
import type {DifficultyEnum} from "./model/DifficultyEnum.ts";

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
export default function Play(props: Readonly<ListOfAllQuestionsProps>) {
    const [showPreviewMode, setShowPreviewMode] = useState<boolean>(true);
    const [gameFinished, setGameFinished] = useState<boolean>(true);
    const [time, setTime] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [hasStartedOnce, setHasStartedOnce] = useState(false);
    const [currentQuestions, setCurrentQuestion] = useState<QuestionModel[]>([])
    const [difficultyEnum, setDifficultyEnum] = useState<DifficultyEnum>();
    const [categoryEnum, setCategoryEnum] = useState<CategoryEnum>();
    const [wrongAnswerCount, setWrongAnswerCount] = useState<number>(0);


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

    useEffect(() => {
        if (difficultyEnum === "KANGAROO"){
            setCategoryEnum("KANGAROO");
        }
    }, [difficultyEnum]);

    function handleStartGame(){
        setShowPreviewMode(false);
        setGameFinished(false);
        setShowNameInput(false);
    }
    function handleResetCurrentQuiz(){

    }

    function handleHardResetGame() {
        setShowPreviewMode(true);
        setGameFinished(true);
        setHasStartedOnce(false);
        setTime(0);
        setIsNewHighScore(false);
        setCurrentQuestion([]);
        setWrongAnswerCount(0);
    }

    function selectQuestions(difficulty: DifficultyEnum | "RANDOM", category: CategoryEnum | "RANDOM") {
        let questions: QuestionModel[];

        // Sonderfall: Kangaroo
        if (difficulty === "KANGAROO") {
            questions = [...props.allActiveKangarooQuestions];
        } else {
            // Sonst alle Nicht-Kangaroo-Fragen
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

        // Speichere für UI-Auswahl
        setDifficultyEnum(difficulty === "RANDOM" ? undefined : difficulty);
        setCategoryEnum(category === "RANDOM" ? undefined : category);
    }




    return (
        <>
            <div className="space-between">
                <button className="button-group-button" id={gameFinished ? "start-button" : undefined} onClick={handleStartGame} disabled={!gameFinished}>Start</button>
                <button className="button-group-button" disabled={gameFinished} onClick={handleResetCurrentQuiz}>Reset Current Quiz</button>
                <button className="button-group-button" onClick={handleHardResetGame}>Reset Hard</button>
                <p>Mistakes {wrongAnswerCount}/10</p>
                <p>⏱️ Time: {time.toFixed(1)} sec</p>
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
                            <button className={`button-group-button ${difficultyEnum === "EASY" ? "active-button-deck-difficulty" : ""}`} onClick={() => selectQuestions("EASY","RANDOM")}>Easy</button>
                            <button className={`button-group-button ${difficultyEnum === "MEDIUM" ? "active-button-deck-difficulty" : ""}`} onClick={() => selectQuestions("MEDIUM","RANDOM")}>Medium</button>
                            <button className={`button-group-button ${difficultyEnum === "HARD" ? "active-button-deck-difficulty" : ""}`} onClick={() => selectQuestions("HARD","RANDOM")}>Hard</button>
                            <button className={`button-group-button ${difficultyEnum === "RANDOM" ? "active-button-deck-difficulty" : ""}`} onClick={() => selectQuestions("RANDOM", "RANDOM")}>Random no K</button>
                        </div>
                    </div>

                    <div>
                        <h4>Choose a Category</h4>
                        <button className={`button-group-button ${categoryEnum === "RANDOM" ? "active-button-deck-difficulty" : ""}`}>Random Category</button>
                    </div>
                    <Preview/>
                </>}

        </>
    )
}