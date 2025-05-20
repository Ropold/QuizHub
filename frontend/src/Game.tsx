import type {QuestionModel} from "./components/model/QuestionModel.ts";

type GameProps = {
    currentQuestions: QuestionModel[];
    setGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
    setWrongAnswerCount: React.Dispatch<React.SetStateAction<number>>;
    setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function Game(props: Readonly<GameProps>) {
    return (
        <>
            <h3>Game</h3>
            <p>Welcome to the game!</p>
        </>
    );
}