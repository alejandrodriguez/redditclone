import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
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
        <nav className="Navbar flex items-center gap-2 md:gap-6 bg-white w-full p-2">
            <div className="h-8 w-[32px] md:w-[100px]">
                <Link to="/" className="min-w-max">
                    <img
                        src={logo}
                        alt="Reddit Logo"
                        className="w-full hidden md:inline"
                    />
                    <img
                        src={logonotext}
                        alt="Reddit Logo"
                        className="w-full md:hidden"
                    />
                </Link>
            </div>
            <PageSelect options={subredditOptions} />
            {auth.currentUser && (
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
            )}
            {auth.currentUser ? (
                <ProfileSelect />
            ) : (
                <div className="flex gap-1 ml-auto text-sm md:text-base">
                    <Link
                        to="/login"
                        className="navBtn text-blue-500 border-blue-500 min-w-max"
                    >
                        Log In
                    </Link>
                    <Link
                        to="/signup"
                        className="navBtn text-white border-blue-500 bg-blue-500 min-w-max hidden 480:block"
                    >
                        Sign Up
                    </Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
