import React, { useState, useEffect } from "react";
import Select from "react-select";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import defaultPic from "../img/default-profile-picture.png";

function ProfileSelect() {
    const [profilePic, setProfilePic] = useState(defaultPic);
    const [username, setUsername] = useState("redditor");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setProfilePic(user.photoURL);
                setUsername(user.displayName);
            }
        });
        return unsubscribe;
    }, []);

    const dummyOptions = [
        {
            value: "profile",
            label: (
                <div className="flex gap-1">
                    <p>{username}</p>
                    <img
                        className="w-6 rounded-full"
                        src={profilePic}
                        alt="Profile Icon"
                    />
                </div>
            )
        },
        { value: "logout", label: "logout" }
    ];

    return (
        <Select
            className="min-w-min"
            value={dummyOptions[0]}
            options={dummyOptions}
        />
    );
}

export default ProfileSelect;
