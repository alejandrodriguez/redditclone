// TODO add messages on DOM for form verification

import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

function SetUsername(props) {
    const navigate = useNavigate();

    // Assign value to email variable if applicable
    const { state } = useLocation();
    let email = null;
    if (state !== null) {
        email = state.email;
    }

    useEffect(() => {
        // Redirect if user is signed in and already has username
        if (auth.currentUser && auth.currentUser.displayName) {
            navigate("/");
        }
        // Redirect if user is not signed in and email has not been collected
        else if (!auth.currentUser && !email) {
            navigate("/signup");
        }
    }, [navigate, email]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function submitForm(e) {
        e.preventDefault();
        // Verify form is filled out correctly
        if (
            username.length < 3 ||
            username.length > 20 ||
            (email && password.length < 8) ||
            (email && password.length > 20)
        ) {
            return;
        }
        // Create user if user is signing up with email and password
        if (email) {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        // Add username to user in Firebase
        await updateProfile(auth.currentUser, { displayName: username });
        navigate("/");
    }

    return (
        <div className="min-h-screen bg-white relative flex flex-col">
            <div className="border-b-1 border-gray-300 p-6">
                <h2 className="font-bold">Choose your username</h2>
                <p>
                    Your username is how other community members will see you.
                    This name will be used to credit you for things you share on
                    Reddit. What should we call you?
                </p>
            </div>
            <form className="flex-1 flex flex-col">
                <div className="flex-1 p-6">
                    <input
                        type="text"
                        className="block border-gray-400 border-1 rounded focus:border-gray-500 invalid:border-red-500 outline-none px-4 py-2 w-[350px] mb-10"
                        placeholder="CHOOSE A USERNAME"
                        minLength={3}
                        maxLength={20}
                        onChange={e => setUsername(e.target.value)}
                    />
                    {/* Display password field if applicable */}
                    {email && (
                        <input
                            type="password"
                            className="block border-gray-400 border-1 rounded focus:border-gray-500 invalid:border-red-500 outline-none px-4 py-2 w-[350px]"
                            placeholder="PASSWORD"
                            minLength={8}
                            maxLength={20}
                            onChange={e => setPassword(e.target.value)}
                        />
                    )}
                </div>
                <div className="flex justify-end items-center border-t-1 border-gray-300 p-4">
                    <button
                        type="submit"
                        className="block uppercase text-center py-2 px-4 bg-blue-600 border-1 border-blue-600 text-white font-bold rounded hover:bg-blue-500 hover:border-blue-500"
                        onClick={submitForm}
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SetUsername;
