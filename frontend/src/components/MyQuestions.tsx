import type {QuestionModel} from "./model/QuestionModel.ts";
import {useState} from "react";
import axios from "axios";

type MyQuestionsProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (questionId: string) => void;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    allQuestions: QuestionModel[];
    getAllQuestions: () => void;
    setAllQuestions: React.Dispatch<React.SetStateAction<QuestionModel[]>>;
}

export default function MyQuestions(props: Readonly<MyQuestionsProps>) {
    const [editData, setEditData] = useState<QuestionModel | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [questionToDelete, setQuestionToDelete] =  useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);

    function handleEditToggle (questionId: string) {
        const questionToEdit = props.allQuestions.find((q) => q.id === questionId);
        if (questionToEdit) {
            setEditData(questionToEdit);
            props.setIsEditing(true);

            // Hier nehmen wir einfach an, dass immer ein Bild vorhanden ist, wenn imageUrl gesetzt ist
            fetch(questionToEdit.imageUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    const file = new File([blob], "current-image.jpg", { type: blob.type });
                    setImage(file);
                })
                .catch((error) => console.error("Error loading current image:", error));
        }
    }

    function handleToggleActiveStatus(questionId: string) {
        axios
            .put(`/api/users/${questionId}/toggle-active`)
            .then(() => {
                props.setAllQuestions((prevQuestion) =>
                    prevQuestion.map((q) =>
                        q.id === questionId ? { ...q, isActive: !q.isActive } : q
                    )
                );
            })
            .catch((error) => {
                console.error("Error during Toggle Offline/Active", error);
                alert("An Error while changing the status of Active/Offline.");
            });
    }

    function handleSaveEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!editData) {
            return;
        }

        const updatedQuestionData = {
            ...editData,
            imageUrl: image ? "temp-image" : editData.imageUrl, // Nur ersetzen, wenn ein neues Bild hochgeladen wurde
        };

        const data = new FormData();
        if (imageChanged && image) {
            data.append("image", image);
        }

        data.append("questionModelDto", new Blob([JSON.stringify(updatedQuestionData)], {type: "application/json"}));

        axios
            .put(`/api/quiz-hub/${editData.id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                props.setAllQuestions((prevQuestions) =>
                    prevQuestions.map((q) =>
                        q.id === editData.id ? {...q, ...response.data} : q
                    )
                );
                props.setIsEditing(false);
            })
            .catch((error) => {
                console.error("Error saving question edits:", error);
                alert("An unexpected error occurred. Please try again.");
            });
    }

    function onFileChange (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setImage(e.target.files[0]);
            setImageChanged(true);
        }
    }

    function handleDeleteClick(id: string) {
        setQuestionToDelete(id);
        setShowPopup(true);
    }

    function handleCancel(){
        setQuestionToDelete(null);
        setShowPopup(false);
    }

    function handleConfirmDelete() {
        if (questionToDelete) {
            axios
                .delete(`/api/quiz-hub/${questionToDelete}`)
                .then(() => {
                    props.setAllQuestions((prevQuestions) =>
                        prevQuestions.filter((q) => q.id !== questionToDelete)
                    );
                })
                .catch((error) => {
                    console.error("Error deleting question:", error);
                    alert("An unexpected error occurred. Please try again.");
                });
        }
        setQuestionToDelete(null);
        setShowPopup(false);
    }

    return (
        <div>
            <h2>My Question</h2>
            <p>Here you can find your questions.</p>
            <p>{props.user}</p>
        </div>
    )
}