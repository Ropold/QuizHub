import type {QuestionModel} from "./model/QuestionModel.ts";
import {useState} from "react";
import type {HighScoreModel} from "./model/HighScoreModel.ts";
import kangarooLogo from "../assets/categoryEnumImages/kangaroo.jpg";
import Preview from "./Preview.tsx";
import "./styles/Play.css"

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

    const [showWinAnimation, setShowWinAnimation] = useState<boolean>(false);
    const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
    const [showNameInput, setShowNameInput] = useState<boolean>(false);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState("");

    function handleStartGame(){

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
    }

    function selectRandomQuestions(){
        const shuffled: QuestionModel[]= [...props.activeQuestionsWithNoK].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setCurrentQuestion(selected);
    }

    function selectKangarooQuestions() {
        const shuffled = [...props.allActiveKangarooQuestions].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setCurrentQuestion(selected);
    }

    function selectQuestionsByDifficulty(difficulty: "EASY" | "MEDIUM" | "HARD") {
        const filtered = props.activeQuestionsWithNoK.filter(
            (q) => q.difficultyEnum === difficulty
        );
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setCurrentQuestion(selected);
    }


    return (
        <>
            <div className="space-between">
                <button className="button-group-button" id={gameFinished ? "start-button" : undefined} onClick={handleStartGame} disabled={!gameFinished}>Start</button>
                <button className="button-group-button" disabled={gameFinished} onClick={handleResetCurrentQuiz}>Reset Current Quiz</button>
                <button className="button-group-button" onClick={handleHardResetGame}>Reset Hard</button>
                <div>⏱️ Time: {time.toFixed(1)} sec</div>
            </div>

            {showPreviewMode &&
                <>
                    <div className="border">
                        <div className="space-between">
                            <div
                                className="clickable-header"
                                id="button-kangaroo"
                                onClick={selectKangarooQuestions}
                            >
                                <h2 className="header-title">Kangaroo</h2>
                                <img src={kangarooLogo} alt="Kangaroo Logo" className="logo-image" />
                            </div>
                            <button className="button-group-button" onClick={() => selectQuestionsByDifficulty("EASY")}>Easy</button>
                            <button className="button-group-button" onClick={() => selectQuestionsByDifficulty("MEDIUM")}>Medium</button>
                            <button className="button-group-button" onClick={() => selectQuestionsByDifficulty("HARD")}>Hard</button>
                            <button className="button-group-button" onClick={selectRandomQuestions}>Random no K</button>
                        </div>
                    </div>
                    <Preview/>
                </>}
        </>
    )
}