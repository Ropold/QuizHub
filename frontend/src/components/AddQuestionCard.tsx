import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ALL_DIFFICULTIES, getDifficultyEnumDisplayName, type NullableDifficultyEnum} from "./model/DifficultyEnum.ts";
import {
    ALL_CATEGORIES,
    type CategoryEnum,
    getCategoryEnumDisplayName,
    type NullableCategoryEnum
} from "./model/CategoryEnum.ts";
import axios from "axios";
import type {QuestionData} from "./model/QuestionData.ts";
import type {QuestionModel} from "./model/QuestionModel.ts";
import headerLogo from "../assets/quiz-logo-header.jpg"
import {categoryEnumImages} from "./utils/CategoryEnumImages.ts";
import "./styles/AddQuestionCard.css"
import "./styles/Popup.css"

type AddQuestionCardProps = {
    user: string;
    handleNewQuestionSubmit: (newQuestion: QuestionModel) => void;
}

export default function AddQuestionCard(props: Readonly<AddQuestionCardProps>) {
    const [title, setTitle] = useState<string>("");
    const [difficultyEnum, setDifficultyEnum] = useState<NullableDifficultyEnum>("");
    const [categoryEnum, setCategoryEnum] = useState<NullableCategoryEnum>("");
    const [questionText, setQuestionText] = useState<string>("");
    const [options, setOptions] = useState<{ text: string; isCorrect: boolean }[]>([]);
    const [answerExplanation, setAnswerExplanation] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");

    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const questionData: QuestionData = {
            title,
            difficultyEnum,
            categoryEnum,
            questionText,
            options,
            answerExplanation,
            isActive: true,
            githubId: props.user,
            imageUrl: imageUrl
        };

        const data = new FormData();

        if (image) {
            data.append("image", image);
        }

        data.append("questionModelDto", new Blob([JSON.stringify(questionData)], { type: "application/json" }));

        axios
            .post("/api/quiz-hub", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                navigate(`/question/${response.data.id}`);
            })
            .catch((error) => {
                if (error.response && error.response.status === 400 && error.response.data) {
                    const errorMessages = error.response.data;
                    const errors: string[] = [];
                    Object.keys(errorMessages).forEach((field) => {
                        errors.push(`${field}: ${errorMessages[field]}`);
                    });

                    setErrorMessages(errors);
                    setShowPopup(true);
                } else {
                    alert("An unexpected error occurred. Please try again.");
                }
            });
    }


    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.files){
            const file = e.target.files[0];
            setImage(file);
            setImageUrl("temp-image")
        }
    }

    function handleClosePopup() {
        setShowPopup(false);
        setErrorMessages([]);
    }

    return (
        <div className="edit-form">
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input
                        className="input-small"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>

                <div className="question-category-row">

                    <label className="add-question-label">
                        Difficulty:
                        <select
                            className="input-small"
                            value={difficultyEnum}
                            onChange={(e) => setDifficultyEnum(e.target.value as NullableDifficultyEnum)}
                        >
                            <option value="">Please select difficulty</option>
                            {ALL_DIFFICULTIES.map((difficulty) => (
                                <option key={difficulty} value={difficulty}>
                                    {getDifficultyEnumDisplayName(difficulty)}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="add-question-label">
                        Category:
                        <select
                            className="input-small"
                            value={categoryEnum}
                            onChange={(e) => setCategoryEnum(e.target.value as NullableCategoryEnum)}
                        >
                            <option value="">Please select a category</option>
                            {ALL_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {getCategoryEnumDisplayName(category)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <img
                        src={
                            categoryEnum
                                ? categoryEnumImages[categoryEnum as CategoryEnum]
                                : headerLogo
                        }
                        alt={categoryEnum || "logo quiz hub"}
                        className="question-card-image-add"
                    />

                </div>

                <label>
                    Question Text:
                    <textarea
                        className="textarea-large"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                    />
                </label>

                <label className="add-question-label">
                    Options:
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="add-option-row">
                            <input
                                type="text"
                                className="add-input-small"
                                placeholder={`Option ${index + 1}`}
                                value={options[index]?.text || ""}
                                onChange={(e) => {
                                    const updated = [...options];
                                    updated[index] = {
                                        ...updated[index],
                                        text: e.target.value,
                                        isCorrect: updated[index]?.isCorrect || false,
                                    };
                                    setOptions(updated);
                                }}
                            />
                            <label className="add-correct-checkbox">
                                <input
                                    type="checkbox"
                                    checked={options[index]?.isCorrect || false}
                                    onChange={() => {
                                        const updated = options.map((opt, i) => ({
                                            text: opt?.text || "",
                                            isCorrect: i === index, // Nur dieser Index wird korrekt
                                        }));
                                        setOptions(updated);
                                    }}
                                />
                                Correct
                            </label>
                        </div>
                    ))}
                </label>


                <label>
                    Answer Explanation:
                    <textarea
                        className="textarea-large"
                        value={answerExplanation}
                        onChange={(e) => setAnswerExplanation(e.target.value)}
                    />
                </label>

                <label>
                    Image:
                    <input
                        type="file"
                        onChange={onFileChange}
                    />
                </label>

                {image && (
                    <img src={URL.createObjectURL(image)} className="question-card-image" alt="Preview" />
                )}

                <div className="space-between">
                    <button className="button-group-button" type="submit">Add Question Card</button>
                </div>
            </form>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Validation Errors</h3>
                        <ul>
                            {errorMessages.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                        <div className="popup-actions">
                            <button className="popup-cancel" onClick={handleClosePopup}>Close</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}