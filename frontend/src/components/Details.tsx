import {DefaultQuestion, type QuestionModel} from "./model/QuestionModel.ts";
import {useEffect, useState} from "react";
import {DefaultUserDetails, type UserDetails} from "./model/UserDetailsModel.ts";
import {useParams} from "react-router-dom";
import axios from "axios";

type DetailsProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (questionId: string) => void;
}

export default function Details(props: Readonly<DetailsProps>) {
    const [questions, setQuestions] = useState<QuestionModel>(DefaultQuestion);
    const [githubUser, setGithubUser] = useState<UserDetails>(DefaultUserDetails);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;
        axios
            .get(`/api/quiz-hub/${id}`)
            .then((response) => setQuestions(response.data))
            .catch((error) => console.error("Error fetching Question details", error));
    }, [id]);

    const fetchGithubUsername = async () => {
        try {
            const response = await axios.get(`https://api.github.com/user/${questions.githubId}`);
            setGithubUser(response.data);
        } catch (error) {
            console.error("Error fetching Github-User", error);
        }
    };

    useEffect(() => {
        if (questions.githubId) {
            fetchGithubUsername();
        }
    }, [questions.githubId]);

    const isFavorite = props.favorites.includes(questions.id);

    return (
        <>
            <div className="details-container">
                <h2>{questions.title}</h2>
                <p><strong>Category:</strong> {questions.categoryEnum}</p>
                <p><strong>Difficulty:</strong> {questions.difficultyEnum}</p>
                <p><strong>Question:</strong> {questions.questionText}</p>
                <p><strong>Options:</strong></p>
                <div className="details-options">

                    <ul>
                        {questions.options.map((option, index) => (
                            <li key={index}>
                                {option.text}
                                {option.isCorrect && <span className="details-option-correct"> (correct)</span>}
                            </li>
                        ))}
                    </ul>
                </div>

                <p><strong>Explanation:</strong> {questions.answerExplanation || "No explanation available"}</p>

                {questions.imageUrl && (
                    <img
                        className="details-image"
                        src={questions.imageUrl}
                        alt={questions.title}
                    />
                )}

                {props.user !== "anonymousUser" && (
                    <div>
                        <button
                            className={`button-group-button margin-top-20 ${isFavorite ? "favorite-on" : "favorite-off"}`}
                            onClick={() => props.toggleFavorite(questions.id)}
                        >
                            ♥
                        </button>
                    </div>
                )}
            </div>
            <div>
                <h3>Added by User</h3>
                <p><strong>Github-User</strong> {githubUser.login} </p>
                <p><strong>GitHub Profile</strong> <a href={githubUser.html_url} target="_blank" rel="noopener noreferrer">Visit Profile</a></p>
                <img className="profile-container-img" src={githubUser.avatar_url} alt={`${githubUser.login}'s avatar`} />
            </div>
        </>
    )
}