
type ListOfAllQuestionsProps = {
    user: string;
    currentPage: number;
    setCurrentPage: (pageNumber: number) => void;
}

export default function ListOfAllQuestions(props: Readonly<ListOfAllQuestionsProps>) {

    return (
        <div>
            <h2>List of all Questions</h2>
            <p>{props.user}</p>
            <p>Here you can find all questions.</p>
        </div>
    )
}