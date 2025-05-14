import {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {DifficultyEnum} from "./model/DifficultyEnum.ts";
import type {CategoryEnum} from "./model/CategoryEnum.ts";

type AddQuestionCardProps = {
    user: string;
}

export default function AddQuestionCard(props: Readonly<AddQuestionCardProps>) {
    const [title, setTitle] = useState<string>("");
    const [difficultyEnum, setDifficultyEnum] = useState<DifficultyEnum>("EASY");
    const [categoryEnum, setCategoryEnum] = useState<CategoryEnum>("ART");
    const [questionText, setQuestionText] = useState<string>("");
    const [options, setOptions] = useState<{ text: string; isCorrect: boolean }[]>([]);
    const [answerExplanation, setAnswerExplanation] = useState<string>("");

    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();



    return (
        <div>
            <h2>Add Question</h2>
            <p>Here you can add a new question.</p>
            <p>{props.user}</p>
        </div>
    )
}