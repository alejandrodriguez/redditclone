import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import SetUsername from "./SetUsername";
import CreatePost from "./CreatePost";
import Navbar from "./Navbar";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signup/setusername" element={<SetUsername />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/createpost" element={<CreatePost />} />
                <Route path="/r/:subreddit" element={<Navbar />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
