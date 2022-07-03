import React, { useEffect } from "react";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import CreatePost from "./components/CreatePost";
import SignUp from "./components/SignUp";
import Votes from "./components/Votes";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to sign up page if no user logged in
        if (!auth.currentUser) {
            navigate("/signup");
        }
        // Redirect to set username page if user logged in without reddit username
        else if (
            auth.currentUser &&
            !auth.currentUser.displayName.includes("u/")
        ) {
            navigate("/signup/setusername");
        }
    }, [navigate]);

    return <div className="App">Hello {auth.currentUser.displayName}</div>;
}

export default App;
