import type {QuestionModel} from "./model/QuestionModel.ts";

type ListOfAllQuestionsProps = {
    user: string;
    activeQuestionsWithNoK: QuestionModel[];
}
export default function Play(props: Readonly<ListOfAllQuestionsProps>) {
    return (
        <div>
            <h2>Play</h2>
            <p>{props.user}</p>
        </div>
    )
}