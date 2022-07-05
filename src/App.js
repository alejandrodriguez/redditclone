import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to sign up page if no user logged in
        if (!auth.currentUser) {
            navigate("/signup");
        }
        // Redirect to set username page if user logged in without reddit username
        else if (auth.currentUser && !auth.currentUser.displayName) {
            navigate("/signup/setusername");
        }
    }, [navigate]);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function retrievePosts() {
            const postArr = [];
            const querySnapshot = await getDocs(collection(db, "subreddits"));
            querySnapshot.forEach(async subreddit => {
                const postsSnapshot = await getDocs(
                    collection(db, `subreddits/${subreddit.id}/posts`)
                );
                postsSnapshot.forEach(post => {
                    postArr.push(post.data());
                });
            });
            setPosts(postArr);
        }
        retrievePosts();
    }, []);

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
