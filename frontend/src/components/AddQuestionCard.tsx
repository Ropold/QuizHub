
type AddQuestionCardProps = {
    user: string;
}

export default function AddQuestionCard(props: Readonly<AddQuestionCardProps>) {

    return (
        <div>
            <h2>Add Question</h2>
            <p>Here you can add a new question.</p>
            <p>{props.user}</p>
        </div>
    )
}