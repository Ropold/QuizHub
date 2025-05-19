import {DefaultQuestion} from "./model/QuestionModel.ts";
import "./styles/Preview.css"

export default function Preview(){
    const question = DefaultQuestion;

    return (
        <>
            <h3>Preview Mode:</h3>
            <div className="preview-quiz-container">
                <h3 className="preview-quiz-title">{question.title}</h3>
                <p className="preview-quiz-question">{question.questionText}</p>
                <div className="preview-quiz-options">
                    {question.options.map((opt, idx) => (
                        <button key={idx} className="preview-quiz-option-button">
                            {opt.text}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}