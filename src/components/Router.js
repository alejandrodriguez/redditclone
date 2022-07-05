import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import SetUsername from "./SetUsername";
import CreatePost from "./CreatePost";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup/setusername" element={<SetUsername />} />
                <Route path="/createpost" element={<CreatePost />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
