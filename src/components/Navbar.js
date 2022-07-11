import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import logo from "../img/logo-navbar.png";
import logonotext from "../img/logo-navbar-no-text.png";
import PageSelect from "./PageSelect";
import ProfileSelect from "./ProfileSelect";

function Navbar() {
    const [subredditOptions, setSubredditOptions] = useState([]);

    useEffect(() => {
        async function retrieveSubreddits() {
            const subredditArr = [
                {
                    value: "/",
                    label: (
                        <div className="flex gap-2 items-center">
                            <svg className="w-7 h-7" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"
                                />
                            </svg>
                            <p>Home</p>
                        </div>
                    )
                },
                {
                    value: "/createpost",
                    label: (
                        <div className="flex gap-1 items-center">
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
                            <p>Create Post</p>
                        </div>
                    )
                },
                {
                    value: "/createcommunity",
                    label: (
                        <div className="flex gap-1 items-center">
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
                            <p>Create Community</p>
                        </div>
                    )
                }
            ];
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

    return (
        <nav className="flex items-center gap-6 bg-white w-full p-2">
            <Link to="/">
                <img
                    src={logo}
                    alt="Reddit Logo"
                    className="h-8 min-w-max hidden md:inline"
                />
                <img
                    src={logonotext}
                    alt="Reddit Logo"
                    className="h-8 min-w-max md:hidden"
                />
            </Link>
            <PageSelect options={subredditOptions} />
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
        </nav>
    );
}

export default Navbar;
