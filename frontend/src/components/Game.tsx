import type {QuestionModel} from "./model/QuestionModel.ts";
import {useState} from "react";
import "./styles/Game.css"

type GameProps = {
    currentQuestions: QuestionModel[];
    setGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
    setWrongAnswerCount: React.Dispatch<React.SetStateAction<number>>;
    currentQuestionIndex: number;
    setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function Game(props: Readonly<GameProps>) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // wir speichern index als string
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [showSolution, setShowSolution] = useState<boolean>(false);

    const currentQuestion = props.currentQuestions[props.currentQuestionIndex];

    function handleAnswerClick(answerIndex: string) {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(answerIndex);

        const selectedOption = currentQuestion.options[parseInt(answerIndex)];
        setIsAnswerCorrect(selectedOption.isCorrect);
        setShowSolution(true);

        if (!selectedOption.isCorrect) {
            props.setWrongAnswerCount((prev) => prev + 1);
        }
    }

    function handleNextQuestion() {
        if (props.currentQuestionIndex + 1 >= props.currentQuestions.length) {
            props.setGameFinished(true);
        } else {
            props.setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setIsAnswerCorrect(null);
            setShowSolution(false);
        }
    }

    return (
        <div>
            <h3 className="game-question">{currentQuestion.questionText}</h3>
            <div className="game-options">
                {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx.toString();
                    const isCorrect = option.isCorrect;
                    const showAsCorrect = showSolution && isCorrect;
                    const showAsWrong = showSolution && isSelected && !isCorrect;

                    return (
                        <button
                            key={idx}
                            className={`game-option
                                ${isSelected ? "selected" : ""}
                                ${showAsCorrect ? "correct" : ""}
                                ${showAsWrong ? "wrong" : ""}
                            `}
                            onClick={() => handleAnswerClick(idx.toString())}
                            disabled={selectedAnswer !== null}
                        >
                            {option.text}
                        </button>
                    );
                })}
            </div>

            {showSolution && (
                <div className="game-solution">
                    <h4>{isAnswerCorrect ? "✅ Correct!" : "❌ Wrong!"}</h4>
                    <p><strong>Explanation:</strong> {currentQuestion.answerExplanation}</p>
                    <button className="button-group-button margin-top-20" onClick={handleNextQuestion}>Next Question</button>
                </div>
            )}
        </div>
    );
}
