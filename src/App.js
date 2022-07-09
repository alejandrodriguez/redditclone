import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import {
    getDocs,
    query,
    collection,
    orderBy,
    collectionGroup
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Post from "./components/Post";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (!user) {
                navigate("/signup");
            } else if (user && !user.displayName) {
                navigate("/signup/setusername");
            }
            return unsubscribe;
        });
    }, [navigate]);

    const [posts, setPosts] = useState([]);

    const params = useParams();

    useEffect(() => {
        async function retrievePosts() {
            const loadedPosts = [];
            let q;
            if (params.subreddit) {
                q = query(
                    collection(db, `subreddits/${params.subreddit}/posts`),
                    orderBy("pinned", "desc"),
                    orderBy("timeCreated", "desc")
                );
            } else {
                q = query(
                    collectionGroup(db, "posts"),
                    orderBy("pinned", "desc"),
                    orderBy("timeCreated", "desc")
                );
            }
            const postsSnapshot = await getDocs(q);
            postsSnapshot.forEach(post => {
                loadedPosts.push({
                    ...post.data(),
                    id: post.id,
                    voteData: { upvoted: false, downvoted: false }
                });
            });
            // Retrieve data on which posts have been voted on by user
            const votedPostsData = [];
            const votedSnapshot = await getDocs(
                collection(
                    db,
                    "users",
                    auth.currentUser.displayName,
                    "votedPosts"
                )
            );
            votedSnapshot.forEach(post => {
                votedPostsData.push({
                    ...post.data(),
                    id: post.id
                });
            });
            // Add voted data to loadedPosts
            loadedPosts.forEach(lPost => {
                const votedData = votedPostsData.find(
                    vPost => lPost.id === vPost.id
                );
                if (votedData) {
                    lPost.voteData.upvoted = votedData.upvoted;
                    lPost.voteData.downvoted = votedData.downvoted;
                }
            });
            return loadedPosts;
        }
        retrievePosts()
            .then(retrievedPosts => {
                setPosts(retrievedPosts);
            })
            .catch(error => console.log(error));
    }, [params]);

    return (
        <div className="App">
            <header className="sticky top-0 w-full">
                <Navbar />
            </header>
            <main className="m-6">
                {posts.map((post, index) => (
                    <Post post={post} key={index} />
                ))}
            </main>
        </div>
    );
}

export default App;
