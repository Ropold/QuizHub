import {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {NullableDifficultyEnum} from "./model/DifficultyEnum.ts";
import type {NullableCategoryEnum} from "./model/CategoryEnum.ts";
import axios from "axios";
import type {QuestionData} from "./model/QuestionData.ts";

type AddQuestionCardProps = {
    user: string;
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

        const questionData = {
            title,
            difficultyEnum,
            categoryEnum,
            questionText,
            options,
            answerExplanation,
            isActive: true,
            githubId: props.user,
            imageUrl: imageUrl || null,
        };

        // Entscheide, welche URL und Daten du basierend auf dem Vorhandensein eines Bildes verwenden möchtest
        const endpoint = image ? "/api/quiz-hub" : "/api/quiz-hub/no-image";
        const formData = image ? prepareFormData(questionData) : questionData;

        submitQuestion(endpoint, formData);
    }


    function submitQuestion(endpoint: string, data: QuestionData | FormData) {
        axios
            .post(endpoint, data, {
                headers: {
                    "Content-Type": endpoint === "/api/quiz-hub" ? "multipart/form-data" : "application/json",
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

    function prepareFormData(questionData: QuestionData) {
        const data = new FormData();
        data.append("questionModelDto", JSON.stringify(questionData));
        if (image) {
            data.append("image", image);
        }
        return data;
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
        <div>
            <h2>Add Question</h2>
            <p>Here you can add a new question.</p>
            <p>{props.user}</p>
        </div>
    )
}