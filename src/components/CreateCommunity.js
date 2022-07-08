import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Navbar from "./Navbar";

function CreateCommunity() {
    const [charactersRemaining, setCharactersRemaining] = useState(21);
    const [subredditName, setSubredditName] = useState("");

    function handleChange(e) {
        if (e.target.value.length >= 21) {
            setSubredditName(e.target.value.slice(0, -1));
        } else {
            setSubredditName(e.target.value);
        }
        setCharactersRemaining(21 - e.target.value.length);
    }

    async function createSubreddit(e) {
        e.preventDefault();
        if (!subredditName || subredditName.length > 21) {
            return;
        }
        e.target.disabled = true;
        try {
            // Check if subreddit already exists
            const subredditRef = await getDoc(
                doc(db, "subreddits", subredditName)
            );
            if (subredditRef.exists) {
                throw new Error("Subreddit already exists");
            }
            // Create new subreddit
            await setDoc(doc(db, "subreddits", subredditName), {});
            navigate(`/r/${subredditName}`);
        } catch (error) {
            console.log(error);
            e.target.disabled = false;
        }
    }

    const navigate = useNavigate();

    return (
        <div className="CreateCommunity bg-black bg-opacity-80 h-screen w-screen flex flex-col">
            <Navbar />
            <div className="flex justify-center items-center flex-1">
                <div className="bg-white max-w-max rounded">
                    <form>
                        <div className="p-4">
                            <h2 className="pb-3">Create a community</h2>
                            <hr></hr>
                            <div className="my-4">
                                <h3>Name</h3>
                                <p className="text-gray-500 text-xs">
                                    Community names including capitalization
                                    cannot be changed.
                                </p>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="leading-4 p-2 pt-2 pl-6 border border-gray-200 rounded w-full mb-3"
                                    onChange={handleChange}
                                    value={subredditName}
                                />
                                <p className="absolute top-2 left-2 text-gray-500">
                                    r/
                                </p>
                            </div>
                            <p className="text-gray-500 text-xs">
                                {charactersRemaining} characters remaining
                            </p>
                        </div>
                        <div className="bg-gray-200 p-4 flex justify-end items-center">
                            <button
                                type="button"
                                className="text-blue-500 border-blue-500 hover:bg-blue-50"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="text-white border-blue-500 bg-blue-500"
                                onClick={createSubreddit}
                            >
                                Create Community
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateCommunity;
