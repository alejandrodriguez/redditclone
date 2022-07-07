import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import logo from "../img/logo-navbar.png";
import SubredditLinks from "./SubredditLinks";
import ProfileSelect from "./ProfileSelect";

function Navbar() {
    const [subredditOptions, setSubredditOptions] = useState([]);

    useEffect(() => {
        async function retrieveSubreddits() {
            const subredditArr = [{ value: "home", label: "Home" }];
            const querySnapshot = await getDocs(collection(db, "subreddits"));
            querySnapshot.forEach(subreddit => {
                const subredditOption = {
                    value: subreddit.id,
                    label: `r/${subreddit.id}`
                };
                subredditArr.push(subredditOption);
            });
            setSubredditOptions(subredditArr);
        }
        retrieveSubreddits();
    }, []);

    const navigate = useNavigate();

    return (
        <nav className="flex items-center gap-6 bg-white w-full p-2">
            <Link to="/">
                <img src={logo} alt="Reddit Logo" className="h-8" />
            </Link>
            <SubredditLinks options={subredditOptions} />
            <Link
                to="/createpost"
                className="hover:bg-gray-300 hover:text-gray-600 rounded text-gray-500 ml-auto"
            >
                <abbr title="Create Post">
                    <svg
                        className="w7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                    </svg>
                </abbr>
            </Link>
            <ProfileSelect />
            <button
                onClick={async () => {
                    await signOut(auth);
                    navigate("/login");
                }}
            >
                Sign Out
            </button>
        </nav>
    );
}

export default Navbar;

// Math.ceil(Math.random() * 25)
