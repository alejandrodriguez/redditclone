import React, { useState } from "react";
import Votes from "./Votes";
import { Link } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

function Post(props) {
    const [upvoted, setUpvoted] = useState(props.post.voteData.upvoted);
    const [downvoted, setDownvoted] = useState(props.post.voteData.downvoted);

    const [voteCount, setVoteCount] = useState(props.post.votes);

    async function updateVote(voteType) {
        let voteCountCache = voteCount;
        // If removing upvote or downvote, delete post from votedPosts
        if (
            (voteType === "upvote" && upvoted) ||
            (voteType === "downvote" && downvoted)
        ) {
            setUpvoted(false);
            setDownvoted(false);
            if (voteType === "upvote") {
                setVoteCount(voteCount - 1);
                voteCountCache = voteCountCache - 1;
            } else {
                setVoteCount(voteCount + 1);
                voteCountCache = voteCountCache + 1;
            }
            await deleteDoc(
                doc(
                    db,
                    "users",
                    auth.currentUser.displayName,
                    "votedPosts",
                    props.post.id
                )
            );
        } else {
            // If upvoting a post, update backend appropriately
            if (voteType === "upvote") {
                // If previously downvoted, remove downvote and add upvote
                if (downvoted) {
                    setVoteCount(voteCount + 2);
                    voteCountCache = voteCountCache + 2;
                } else {
                    setVoteCount(voteCount + 1);
                    voteCountCache = voteCountCache + 1;
                }
                setUpvoted(true);
                setDownvoted(false);
                await setDoc(
                    doc(
                        db,
                        "users",
                        auth.currentUser.displayName,
                        "votedPosts",
                        props.post.id
                    ),
                    { upvoted: true, downvoted: false }
                );
            }
            // If downvoting a post, update backend appropriately
            else {
                // If previously upvoted, remove upvote and add downvote
                if (upvoted) {
                    setVoteCount(voteCount - 2);
                    voteCountCache = voteCountCache - 2;
                } else {
                    setVoteCount(voteCount - 1);
                    voteCountCache = voteCountCache - 1;
                }
                setUpvoted(false);
                setDownvoted(true);
                await setDoc(
                    doc(
                        db,
                        "users",
                        auth.currentUser.displayName,
                        "votedPosts",
                        props.post.id
                    ),
                    { upvoted: false, downvoted: true }
                );
            }
        }
        // Update votes count in post
        updateDoc(
            doc(db, "subreddits", props.post.subreddit, "posts", props.post.id),
            { votes: voteCountCache }
        );
    }

    return (
        <div className="flex border border-gray-300 hover:border-gray-500 rounded m-auto max-w-[1000px] bg-white my-3 p-2 hover:cursor-pointer">
            <Votes
                votes={voteCount}
                upvote={() => updateVote("upvote")}
                upvoted={upvoted}
                downvote={() => updateVote("downvote")}
                downvoted={downvoted}
            />
            <div className="flex-1 flex flex-col ml-4">
                {props.post.pinned && (
                    <div className="flex items-center gap-1 ml-[-0.5rem]">
                        <svg
                            className="text-green-500 opacity-70"
                            style={{
                                width: "22px",
                                height: "22px"
                            }}
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z"
                            />
                        </svg>
                        <p className="uppercase text-xs text-gray-500 font-bold">
                            Pinned by Moderators
                        </p>
                    </div>
                )}
                <div className="flex text-xs items-center gap-1 mb-1">
                    <Link
                        to={`/r/${props.post.subreddit}`}
                        className="font-bold hover:underline"
                    >{`r/${props.post.subreddit}`}</Link>
                    <p className="text-gray-500">•</p>
                    <p className="text-gray-500">{`Posted by u/${props.post.author.displayName}`}</p>
                </div>
                <h2 className="font-bold text-lg">{props.post.title}</h2>
                <div className="self-center w-full">
                    {props.post.type === "text" && <p>{props.post.body}</p>}
                    {props.post.type === "image" && (
                        <img
                            src={props.post.src}
                            alt="User uploaded"
                            className="max-h-[600px] object-contain m-auto"
                        />
                    )}
                    {props.post.type === "video" && (
                        <video controls width="100%">
                            <source src={props.post.src} />
                        </video>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Post;
