import type {QuestionModel} from "./model/QuestionModel.ts";

type ListOfAllQuestionsProps = {
    user: string;
    allActiveKangarooQuestions: QuestionModel[];
}

export default function Kangaroo(props: Readonly<ListOfAllQuestionsProps>) {
    return (
        <div>
            <h2>Kangaroo</h2>
            <p>{props.user}</p>
        </div>
    )
}