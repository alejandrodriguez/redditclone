import React, { useState, useEffect } from "react";
import loginart from "../img/log-in-art.png";
import googleicon from "../img/google-icon.png";
import { auth, storage } from "../firebaseConfig";
import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updateProfile,
    getAdditionalUserInfo
} from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";

function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function signInWithGoogle() {
        // Sign In/Sign Up
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        // If new user, reset display name and set profile pic. Redirect to setusername. Otherwise, send home.
        if (getAdditionalUserInfo(userCredential).isNewUser) {
            await updateProfile(auth.currentUser, {
                displayName: "",
                photoURL: await getDownloadURL(
                    ref(
                        storage,
                        `profile-pics/default-${Math.ceil(
                            Math.random() * 25
                        )}.png`
                    )
                )
            });
            navigate("/signup/setusername");
        } else {
            navigate("/");
        }
    }

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                navigate("/");
            }
        });
        unsubscribe();
    }, [navigate]);

    async function signInWithEmail(e) {
        try {
            e.preventDefault();
            // Check validity of email
            const re =
                // eslint-disable-next-line no-useless-escape
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (re.test(email) && password.length < 8 && password.length < 20) {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="bg-white min-h-screen flex gap-8">
            <div className="min-h-full w-56">
                <img
                    className="h-full object-cover object-left"
                    src={loginart}
                    alt="A Reddit Snoo goes to outer space."
                />
            </div>
            <div className="w-80 self-center">
                <h2 className="font-bold mb-3">Log in</h2>
                <p className="text-sm mb-12">
                    <strong className="text-red-500">DISCLAIMER:</strong>{" "}
                    <span className="font-bold">
                        Please do not use any sesnsitive information to sign up
                        for this site. This is a project built for my portfolio.
                    </span>{" "}
                    Authentication for this project is provided by Firebase,
                    Google's app development platform. If you sign in with
                    Google, I cannot access any private information. If you sign
                    up with an email and password, please do not use a password
                    you use for any other site.
                </p>
                <button
                    className="uppercase text-center py-2 px-4 border-1 border-blue-500 text-blue-500 font-bold rounded hover:bg-blue-500 hover:text-white w-full flex items-center my-2"
                    onClick={signInWithGoogle}
                >
                    <img src={googleicon} alt="Google Icon" className="h-7" />
                    <div className="flex-1 text-base">Continue with Google</div>
                </button>
                <h3 className="uppercase text-gray-500 text-center my-6">OR</h3>
                <form>
                    <input
                        className="w-full border-gray-400 border-1 rounded py-2 px-4 mb-2 outline-none focus:border-gray-500"
                        type="email"
                        placeholder="EMAIL"
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="w-full border-gray-400 border-1 rounded py-2 px-4 mb-2 outline-none focus:border-gray-500"
                        type="password"
                        placeholder="PASSWORD"
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="block uppercase text-center py-2 px-4 bg-blue-600 border-1 border-blue-600 text-white font-bold rounded hover:bg-blue-500 hover:border-blue-500 w-full mb-8"
                        onClick={signInWithEmail}
                    >
                        Log In
                    </button>
                </form>
                <p className="text-sm w-full">
                    New to fake reddit?{" "}
                    <Link
                        to="/signup"
                        className="uppercase text-blue-600 hover:text-blue-500 font-bold"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LogIn;
