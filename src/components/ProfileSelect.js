import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import defaultPic from "../img/default-profile-picture.png";

function ProfileSelect() {
    const [profilePic, setProfilePic] = useState(defaultPic);
    const [username, setUsername] = useState("Loading...");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setProfilePic(user.photoURL);
                setUsername(user.displayName);
            }
        });
        return unsubscribe;
    }, []);

    const options = [
        {
            value: "profile",
            label: (
                <div className="flex gap-1">
                    <img
                        className="w-6 rounded-full"
                        src={profilePic}
                        alt="Profile Icon"
                    />
                    <p>{username}</p>
                </div>
            )
        },
        {
            value: "logout",
            label: (
                <div className="flex items-center gap-1">
                    <svg
                        style={{ width: "24px", height: "24px" }}
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z"
                        />
                    </svg>
                    <p>Log Out</p>
                </div>
            )
        }
    ];

    const navigate = useNavigate();

    async function handleChange(option) {
        if (option.value === "logout") {
            await signOut(auth);
            navigate("/login");
        }
    }

    const customStyles = {
        control: provided => ({
            ...provided,
            border: "1px solid white",
            "&:hover": {
                border: "1px solid #e5e7eb"
            },
            cursor: "pointer"
        }),
        dropdownIndicator: provided => ({
            ...provided,
            color: "#71717a"
        }),
        indicatorSeparator: () => {
            return {};
        },
        option: provided => ({
            ...provided,
            cursor: "pointer"
        })
    };

    return (
        <Select
            className="min-w-min"
            hideSelectedOptions
            value={options[0]}
            options={options}
            styles={customStyles}
            onChange={handleChange}
        />
    );
}

export default ProfileSelect;
