import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Votes from "./components/Votes";

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
            const loadedPosts = [];
            const subredditSnapshot = await getDocs(
                collection(db, "subreddits")
            );
            const subredditArr = [];
            subredditSnapshot.forEach(subreddit =>
                subredditArr.push(subreddit.id)
            );
            for (const subreddit of subredditArr) {
                const postsSnapshot = await getDocs(
                    collection(db, `subreddits/${subreddit}/posts`)
                );
                postsSnapshot.forEach(post => {
                    loadedPosts.push(post.data());
                });
            }
            return loadedPosts;
        }
        retrievePosts().then(retrievedPosts => {
            setPosts(retrievedPosts);
        });
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
            {posts.map((post, index) => (
                <div className="flex border border-black" key={index}>
                    <Votes votes={post.votes} />
                    <div>
                        <h4>{`r/${post.subreddit}`}</h4>
                        <h2>{post.title}</h2>
                        <div>
                            {post.type === "text" && <p>{post.body}</p>}
                            {(post.type === "image" ||
                                post.type === "video") && (
                                <img src={post.src} alt="User uploaded" />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default App;
