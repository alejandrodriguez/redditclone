import React, { useState } from "react";
import Votes from "./Votes";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Comment(props) {
    const [upvoted, setUpvoted] = useState(props.comment.voteData.upvoted);
    const [downvoted, setDownvoted] = useState(
        props.comment.voteData.downvoted
    );

    const [voteCount, setVoteCount] = useState(props.comment.votes);

    const navigate = useNavigate();

    async function updateVote(voteType) {
        // Redirect if not signed in
        if (!auth.currentUser) {
            navigate("/signup");
            return;
        }
        let voteCountCache = voteCount;
        // If removing upvote or downvote, delete comment from votedComments
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
                    "votedComments",
                    props.comment.id
                )
            );
        } else {
            // If upvoting a comment, update backend appropriately
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
                        "votedComments",
                        props.comment.id
                    ),
                    { upvoted: true, downvoted: false }
                );
            }
            // If downvoting a comment, update backend appropriately
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
                        "votedComments",
                        props.comment.id
                    ),
                    { upvoted: false, downvoted: true }
                );
            }
        }
        // Update votes count in comment
        updateDoc(doc(db, props.comment.path), { votes: voteCountCache });
    }

    return (
        <div className="Comment p-2">
            <div className="flex gap-1 items-center">
                <img
                    src={props.comment.author.photoURL}
                    alt="Profile Icon"
                    className="w-6 rounded-full"
                />
                <p className="text-sm">{props.comment.author.displayName}</p>
            </div>
            <div className="ml-3 mt-2 flex gap-4">
                <div className="inline-block bg-gray-200 hover:bg-gray-700 w-[2px] cursor-pointer rounded-sm"></div>
                <div>
                    <p className="mb-1 whitespace-pre-line">
                        {props.comment.body}
                    </p>
                    <Votes
                        comment={true}
                        votes={voteCount}
                        upvote={() => updateVote("upvote")}
                        upvoted={upvoted}
                        downvote={() => updateVote("downvote")}
                        downvoted={downvoted}
                    />
                </div>
            </div>
        </div>
    );
}

export default Comment;
