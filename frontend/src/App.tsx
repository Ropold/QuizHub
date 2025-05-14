import './App.css'
import Navbar from "./components/Navbar.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Welcome from "./components/Welcome.tsx";
import {Route, Routes} from "react-router-dom";
import Profile from "./components/Profile.tsx";
import {useEffect, useState} from "react";
import type {UserDetails} from "./components/model/UserDetailsModel.ts";
import axios from "axios";
import NotFound from "./components/NotFound.tsx";
import Footer from "./components/Footer.tsx";
import Play from "./components/Play.tsx";
import Kangaroo from "./components/Kangaroo.tsx";
import HighScore from "./components/HighScore.tsx";
import ListOfAllQuestions from "./components/ListOfAllQuestions.tsx";
import Details from "./components/Details.tsx";
import type {QuestionModel} from "./components/model/QuestionModel.ts";
import type {HighScoreModel} from "./components/model/HighScoreModel.ts";

export default function App() {
    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [activeQuestionsWithNoK, setActiveQuestionsWithNoK] = useState<QuestionModel[]>([]);
    const [allQuestions, setAllQuestions] = useState<QuestionModel[]>([]);
    const [allActiveKangarooQuestions, setAllActiveKangarooQuestions] = useState<QuestionModel[]>([]);
    const [allActiveQuestions, setAllActiveQuestions] = useState<QuestionModel[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [highScoreEasy, setHighScoreEasy] = useState<HighScoreModel[]>([]);
    const [highScoreMedium, setHighScoreMedium] = useState<HighScoreModel[]>([]);
    const [highScoreHard, setHighScoreHard] = useState<HighScoreModel[]>([]);
    const [highScoreKangaroo, setHighScoreKangaroo] = useState<HighScoreModel[]>([]);


    function getUser() {
        axios.get("/api/users/me")
            .then((response) => {
                setUser(response.data.toString());
            })
            .catch((error) => {
                console.error(error);
                setUser("anonymousUser");
            });
    }

    function getUserDetails() {
        axios.get("/api/users/me/details")
            .then((response) => {
                setUserDetails(response.data as UserDetails);
            })
            .catch((error) => {
                console.error(error);
                setUserDetails(null);
            });
    }

    function getAppUserFavorites(){
        axios.get<QuestionModel[]>(`/api/users/favorites`)
            .then((response) => {
                const favoriteIds = response.data.map((question) => question.id);
                setFavorites(favoriteIds);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function toggleFavorite(questionId: string) {
        const isFavorite = favorites.includes(questionId);

        if (isFavorite) {
            axios.delete(`/api/users/favorites/${questionId}`)
                .then(() => {
                    setFavorites((prevFavorites) =>
                        prevFavorites.filter((id) => id !== questionId)
                    );
                })
                .catch((error) => console.error(error));
        } else {
            axios.post(`/api/users/favorites/${questionId}`)
                .then(() => {
                    setFavorites((prevFavorites) => [...prevFavorites, questionId]);
                })
                .catch((error) => console.error(error));
        }
    }

    useEffect(() => {
        getUser();
        getActiveQuestionsWithNoK();
        getAllQuestions();
        getKangarooQuestions();
        getAllActiveQuestions();
    }, []);

    useEffect(() => {
        if(user !== "anonymousUser"){
            getUserDetails();
            getAppUserFavorites();
        }
    }, [user]);

    function handleNewQuestionSubmit(newQuestion: QuestionModel) {
        setActiveQuestionsWithNoK((prevQuestions) => [...prevQuestions, newQuestion]);
    }

    function getAllQuestions() {
        axios
            .get("/api/quiz-hub")
            .then((response) => {
                setAllQuestions(response.data);
            })
            .catch((error) => {
                console.error("Error fetching all animals: ", error);
            });
    }

    function getActiveQuestionsWithNoK() {
        axios
            .get("/api/quiz-hub/active")
            .then((response) => {
                setActiveQuestionsWithNoK(response.data);
            })
            .catch((error) => {
                console.error("Error fetching active animals: ", error);
            });
    }

    function getAllActiveQuestions(){
        axios
            .get("/api/quiz-hub/active-all")
            .then((response) => {
                setAllActiveQuestions(response.data);
            })
            .catch((error) => {
                console.error("Error fetching active animals: ", error);
            });
    }

    function getKangarooQuestions() {
        axios
            .get("/api/quiz-hub/active/kangaroo")
            .then((response) => {
                setAllActiveKangarooQuestions(response.data);
            })
            .catch((error) => {
                console.error("Error fetching active animals: ", error);
            });
    }

    function getHighScoreEasy() {
        axios
            .get("/api/high-score/EASY")
            .then((response) => {
                setHighScoreEasy(response.data);
            })
            .catch((error) => {
                console.error("Error fetching high score: ", error);
            });
    }

    function getHighScoreMedium() {
        axios
            .get("/api/high-score/MEDIUM")
            .then((response) => {
                setHighScoreMedium(response.data);
            })
            .catch((error) => {
                console.error("Error fetching high score: ", error);
            });
    }

    function getHighScoreHard() {
        axios
            .get("/api/high-score/HARD")
            .then((response) => {
                setHighScoreHard(response.data);
            })
            .catch((error) => {
                console.error("Error fetching high score: ", error);
            });
    }

    function getHighScoreKangaroo() {
        axios
            .get("/api/high-score/KANGAROO")
            .then((response) => {
                setHighScoreKangaroo(response.data);
            })
            .catch((error) => {
                console.error("Error fetching high score: ", error);
            });
    }

  return (
    <>
        <Navbar getUser={getUser} getUserDetails={getUserDetails} user={user}/>
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Welcome/>}/>
            <Route path="/play" element={<Play user={user} activeQuestionsWithNoK={activeQuestionsWithNoK}/>} />
            <Route path="/kangaroo" element={<Kangaroo user={user} allActiveKangarooQuestions={allActiveKangarooQuestions}/>} />
            <Route path="/list-of-all-questions" element={<ListOfAllQuestions user={user} currentPage={currentPage} setCurrentPage={setCurrentPage} allActiveQuestions={allActiveQuestions} getAllActiveQuestions={getAllActiveQuestions}/>} />
            <Route path="/list-of-all-questions/:id" element={<Details user={user} favorites={favorites} toggleFavorite={toggleFavorite}/>} />
            <Route path="/high-score" element={<HighScore highScoreEasy={highScoreEasy} getHighScoreEasy={getHighScoreEasy} highScoreMedium={highScoreMedium} getHighScoreMedium={getHighScoreMedium} highScoreHard={highScoreHard} getHighScoreHard={getHighScoreHard} highScoreKangaroo={highScoreKangaroo} getHighScoreKangaroo={getHighScoreKangaroo}/>} />

            <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/profile/*" element={<Profile user={user} userDetails={userDetails} handleNewQuestionSubmit={handleNewQuestionSubmit} allQuestions={allQuestions} getAllQuestions={getAllQuestions} setAllQuestions={setAllQuestions} favorites={favorites} toggleFavorite={toggleFavorite}/>} />
            </Route>

        </Routes>
        <Footer />
    </>
  )
}
