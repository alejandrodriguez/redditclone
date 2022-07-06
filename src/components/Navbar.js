import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import SubredditLinks from "./SubredditLinks";

function Navbar() {
    const [subredditOptions, setSubredditOptions] = useState([]);

    useEffect(() => {
        async function retrieveSubreddits() {
            const subredditArr = [{ value: "home", label: "Home" }];
            const querySnapshot = await getDocs(collection(db, "subreddits"));
            querySnapshot.forEach(doc => {
                const subredditOption = {
                    value: doc.id,
                    label: `r/${doc.id}`
                };
                subredditArr.push(subredditOption);
            });
            setSubredditOptions(subredditArr);
        }
        retrieveSubreddits();
    }, []);

    return (
        <nav>
            <SubredditLinks options={subredditOptions} />
        </nav>
    );
}

export default Navbar;
