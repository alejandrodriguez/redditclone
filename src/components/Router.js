import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import SignUp from "./SignUp";
import SetUsername from "./SetUsername";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signup/setusername" element={<SetUsername />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
