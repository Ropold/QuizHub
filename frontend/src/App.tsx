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

export default function App() {
    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);


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

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if(user !== "anonymousUser"){
            getUserDetails();
        }
    }, [user]);

  return (
    <>
        <Navbar getUser={getUser} getUserDetails={getUserDetails} user={user}/>
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Welcome/>}/>
            <Route path="/play" element={<Play />} />
            <Route path="/kangaroo" element={<Kangaroo/>} />
            <Route path="/list-of-all-questions" element={<ListOfAllQuestions />} />
            <Route path="/list-of-all-questions/:id" element={<Details />} />
            <Route path="/high-score" element={<HighScore />} />

            <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/profile/*" element={<Profile user={user} userDetails={userDetails}/>} />
            </Route>

        </Routes>
        <Footer />
    </>
  )
}
