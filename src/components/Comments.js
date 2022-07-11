import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import {
    doc,
    getDoc,
    addDoc,
    collection,
    serverTimestamp,
    setDoc,
    query,
    orderBy,
    getDocs,
    updateDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Post from "./Post";
import Comment from "./Comment";

function Comments() {
    const navigate = useNavigate();

    // Redirect if use is not signed up
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

    const [renderPost, setRenderPost] = useState(false);
    const [post, setPost] = useState([]);

    const params = useParams();

    useEffect(() => {
        async function retrievePost() {
            try {
                const postSnapshot = await getDoc(
                    doc(
                        db,
                        "subreddits",
                        params.subreddit,
                        "posts",
                        params.postid
                    )
                );
                const retrievedPost = postSnapshot.data();
                const voteData = await getDoc(
                    doc(
                        db,
                        "users",
                        auth.currentUser.displayName,
                        "votedPosts",
                        params.postid
                    )
                );
                if (voteData.exists) {
                    retrievedPost.voteData = voteData.data();
                } else {
                    retrievedPost.voteData.upvoted = false;
                    retrievedPost.voteData.downvoted = false;
                }
                setPost(retrievedPost);
                setRenderPost(true);
            } catch (error) {
                console.log(error);
            }
        }
        retrievePost();
    }, [params]);

    const [comments, setComments] = useState([]);

    // Get comments from backend
    useEffect(() => {
        async function retrieveComments() {
            const loadedComments = [];
            const q = query(
                collection(
                    db,
                    "subreddits",
                    params.subreddit,
                    "posts",
                    params.postid,
                    "comments"
                ),
                orderBy("votes", "desc"),
                orderBy("timeCreated", "desc")
            );
            const commentsSnapshot = await getDocs(q);
            if (commentsSnapshot.empty) {
                return [];
            }
            commentsSnapshot.forEach(comment => {
                loadedComments.push({
                    ...comment.data(),
                    id: comment.id,
                    voteData: { upvoted: false, downvoted: false }
                });
            });
            // Retrieve data on which comments have been voted on by user
            const votedCommentsData = [];
            const votedSnapshot = await getDocs(
                collection(
                    db,
                    "users",
                    auth.currentUser.displayName,
                    "votedComments"
                )
            );
            votedSnapshot.forEach(comment => {
                votedCommentsData.push({
                    ...comment.data(),
                    id: comment.id
                });
            });
            // Add voted data to loadedComments
            loadedComments.forEach(lComment => {
                const votedData = votedCommentsData.find(
                    vComment => lComment.id === vComment.id
                );
                if (votedData) {
                    lComment.voteData = votedData;
                }
            });
            return loadedComments;
        }
        retrieveComments()
            .then(retrievedComments => {
                setComments(retrievedComments);
            })
            .catch(error => console.log(error));
    }, [params]);

    const [commentToBeSubmitted, setCommentToBeSubmitted] = useState("");

    async function submitComment(e) {
        e.preventDefault();
        if (!commentToBeSubmitted) {
            return;
        }
        // Disable comment button while submitting
        e.target.disabled = true;
        try {
            // Submit Comment to database
            const commentRef = await addDoc(
                collection(
                    db,
                    "subreddits",
                    params.subreddit,
                    "posts",
                    params.postid,
                    "comments"
                ),
                {
                    author: {
                        displayName: auth.currentUser.displayName,
                        photoURL: auth.currentUser.photoURL,
                        uid: auth.currentUser.uid
                    },
                    body: commentToBeSubmitted,
                    timeCreated: serverTimestamp(),
                    votes: 1 // Post will be automatically liked
                }
            );
            // Add path to post
            await updateDoc(commentRef, { path: commentRef.path });
            // Add comment to user collection
            await setDoc(
                doc(
                    db,
                    "users",
                    auth.currentUser.displayName,
                    "comments",
                    commentRef.id
                ),
                { id: commentRef.id, path: commentRef.path }
            );
            // Automatically like comment
            await setDoc(
                doc(
                    db,
                    "users",
                    auth.currentUser.displayName,
                    "votedComments",
                    commentRef.id
                ),
                { upvoted: true, downvoted: false }
            );
            // Clear comment form
            setCommentToBeSubmitted("");
            // Refresh Page
            navigate(`/r/${params.subreddit}/comments/${params.postid}`);
        } catch (error) {
            console.log(error);
            e.target.disabled = false;
        }
    }

    return (
        <div className="Comments bg-black bg-opacity-80 min-h-screen w-screen flex flex-col">
            <header className="sticky top-0 w-full">
                <Navbar />
            </header>
            <main className="flex-1 w-10/12 lg:w-8/12 m-auto flex flex-col">
                <div className="bg-black text-gray-200 py-4 px-6 flex items-center">
                    <span className="flex-1">{post.title}</span>
                    <span
                        className="flex items-center justify-end cursor-pointer hover:text-gray-300"
                        onClick={() => navigate("/")}
                    >
                        <svg
                            style={{ width: "24px", height: "24px" }}
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                            />
                        </svg>
                        Close
                    </span>
                </div>
                <div className="flex-1 bg-slate-200 p-4">
                    {renderPost && <Post post={post} comments={true} />}
                    <div className="bg-white max-w-[1000px] m-auto">
                        <div className="px-8 py-4">
                            <p className="text-sm">
                                Comment as{" "}
                                {auth.currentUser
                                    ? auth.currentUser.displayName
                                    : ""}
                            </p>
                            <form className="flex flex-col gap-1">
                                <textarea
                                    name="body"
                                    id="body"
                                    placeholder="What are your thoughts?"
                                    rows="6"
                                    className="input-border"
                                    onChange={e =>
                                        setCommentToBeSubmitted(e.target.value)
                                    }
                                    value={commentToBeSubmitted}
                                ></textarea>
                                <button
                                    className="text-white border-blue-500 bg-blue-500 text-xs self-end"
                                    type="submit"
                                    onClick={submitComment}
                                >
                                    Comment
                                </button>
                            </form>
                        </div>
                        {comments.length === 0 ? (
                            <p className="text-center text-gray-500 py-16">
                                No comments yet. Be the first to share what you
                                think!
                            </p>
                        ) : (
                            comments.map((comment, index) => (
                                <Comment comment={comment} key={index} />
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Comments;
