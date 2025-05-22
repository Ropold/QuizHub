import { DefaultQuestion } from "./model/QuestionModel.ts";

export default function Preview() {
    const question = DefaultQuestion;

    return (
        <div className="border">
            <h2>Preview:</h2>
            <h3 className="game-question">{question.questionText}</h3>

            <div className="game-options">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        className={`game-option
              ${option.isCorrect ? "selected correct" : ""}
            `}
                        disabled
                    >
                        {option.text}
                    </button>
                ))}
            </div>

            <div className="game-solution">
                <h4>✅ Correct!</h4>
                <p>
                    <strong>Explanation:</strong> {question.answerExplanation}
                </p>
            </div>
        </div>
    );
}