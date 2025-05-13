import welcomePic from "../assets/quiz-logo.jpg"
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import "./styles/Welcome.css"

export default function Welcome(){

    const [showCredits, setShowCredits] = useState(false);
    const navigate = useNavigate();

    const toggleCredits = () => {
        setShowCredits(prev => !prev);
    };

    return (
        <div>
            <h2>Welcome to QuizHub</h2>
            <p>Click on the Picture or the Play button to start playing!</p>

            <div className="image-wrapper">
                <img
                    src={welcomePic}
                    alt="Welcome to Quiz Hub"
                    className="logo-welcome"
                    onClick={()=> navigate("/play")}
                />
                <div className="info-icon" onClick={toggleCredits} title="Bildnachweis">i</div>

                {showCredits && (
                    <div className="image-credit">
                        Picture: <a href="https://www.vecteezy.com/vector-art/9016535-question-and-answers-template-quiz-game-in-tv" target="_blank" rel="noopener noreferrer">
                        Quiz Logo</a> von <a href="https://www.vecteezy.com" target="_blank" rel="noopener noreferrer">Vecteezy</a>
                    </div>
                )}
            </div>
        </div>
    );
}