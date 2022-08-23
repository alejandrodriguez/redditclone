import React, { useState } from "react";
import Votes from "./Votes";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

function Post(props) {
    const [upvoted, setUpvoted] = useState(props.post.voteData.upvoted);
    const [downvoted, setDownvoted] = useState(props.post.voteData.downvoted);

    const [voteCount, setVoteCount] = useState(props.post.votes);

    const [blurImgOrVid, setBlurImgOrVid] = useState(
        props.comments ? false : props.post.spoiler || props.post.NSFW
    );

    const navigate = useNavigate();

    async function updateVote(voteType) {
        if (!auth.currentUser) {
            navigate("/signup");
            return;
        }
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
        <div
            className={`flex border border-gray-300 m-auto max-w-[1000px] bg-white my-3 p-2 pb-0 rounded ${
                props.comments
                    ? ""
                    : "hover:border-gray-500 hover:cursor-pointer"
            }`}
        >
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
                            className="text-green-500"
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
                    <p className="text-gray-500 hidden sm:block">•</p>
                    <p className="text-gray-500 min-w-max hidden sm:block">{`Posted by u/${props.post.author.displayName}`}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <h2 className="font-bold text-base md:text-lg">
                        {props.post.title}
                    </h2>
                    {props.post.spoiler && (
                        <p className="px-1 text-xs text-gray-500 border border-gray-500 rounded-sm">
                            spoiler
                        </p>
                    )}
                    {props.post.NSFW && (
                        <p className="px-1 text-xs text-red-500 border border-red-500 rounded-sm">
                            nsfw
                        </p>
                    )}
                </div>
                <div className="self-center w-full">
                    {props.post.type === "text" && (
                        <p className="whitespace-pre-line text-sm md:text-base">
                            {props.post.body}
                        </p>
                    )}
                    {props.post.type === "image" && (
                        <img
                            src={props.post.src}
                            alt="User uploaded"
                            className={`max-h-[600px] object-contain m-auto ${
                                blurImgOrVid ? "blur-xl" : ""
                            }`}
                            onClick={() => setBlurImgOrVid(false)}
                        />
                    )}
                    {props.post.type === "video" && (
                        <video
                            controls
                            width="100%"
                            className={blurImgOrVid ? "blur-xl" : ""}
                            onClick={() => setBlurImgOrVid(false)}
                        >
                            <source src={props.post.src} />
                        </video>
                    )}
                </div>
                <div>
                    <Link
                        to={
                            props.comments
                                ? "#"
                                : `/r/${props.post.subreddit}/comments/${props.post.id}`
                        }
                        className="text-gray-500 text-xs font-bold flex items-center gap-1 hover:bg-gray-200 w-min p-1 rounded"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#6b7280"
                                d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7C5,5.89 5.9,5 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.9 12.75,23 12.5,23V23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15Z"
                            />
                        </svg>
                        Comments
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Post;
