import React, { useEffect } from "react";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log(auth.currentUser);
        // Redirect to sign up page if no user logged in
        if (!auth.currentUser) {
            navigate("/signup");
        }
        // Redirect to set username page if user logged in without reddit username
        else if (auth.currentUser && !auth.currentUser.displayName) {
            navigate("/signup/setusername");
        }
    }, [navigate]);

    return (
        <div className="App">
            <h1>
                Hello {auth.currentUser && `u/${auth.currentUser.displayName}`}
            </h1>
            <button
                onClick={async () => {
                    await signOut(auth);
                    navigate("/login");
                }}
            >
                Sign Out
            </button>
        </div>
    );
}

export default App;
