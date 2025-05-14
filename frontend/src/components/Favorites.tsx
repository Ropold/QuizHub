import {useEffect, useState} from "react";
import type {QuestionModel} from "./model/QuestionModel.ts";
import axios from "axios";
import "./styles/Details.css"

type FavoritesProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (questionId: string) => void;
}

export default function Favorites(props: Readonly<FavoritesProps>) {
    const [favoritesQuestions, setFavoritesQuestions] = useState<QuestionModel[]>([]);

    useEffect(() => {
        axios
            .get(`/api/users/favorites`)
            .then((response) => {
                setFavoritesQuestions(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [props.user, props.favorites]);

    return (
        <div>
            <h2>Favorites</h2>
            <p>Here you can find your favorite questions.</p>
            <p>{props.user}</p>
        </div>
    )
}