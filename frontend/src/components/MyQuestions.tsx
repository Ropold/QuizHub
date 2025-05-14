import type {QuestionModel} from "./model/QuestionModel.ts";

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

    return (
        <div>
            <h2>My Question</h2>
            <p>Here you can find your questions.</p>
            <p>{props.user}</p>
        </div>
    )
}