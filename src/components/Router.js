import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import SetUsername from "./SetUsername";
import CreatePost from "./CreatePost";
import CreateCommunity from "./CreateCommunity";
import Comments from "./Comments";

function Router() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signup/setusername" element={<SetUsername />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/" element={<App />} />
                <Route path="/r/:subreddit" element={<App />} />
                <Route path="/createpost" element={<CreatePost />} />
                <Route path="/createcommunity" element={<CreateCommunity />} />
                <Route
                    path="/r/:subreddit/comments/:postid"
                    element={<Comments />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
