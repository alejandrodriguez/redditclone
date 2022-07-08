import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebaseConfig";
import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    setDoc,
    doc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uniqid from "uniqid";
import Navbar from "./Navbar";

function CreatePost() {
    const navigate = useNavigate();
    // Redirect to log in page if not signed in
    useEffect(() => {
        if (!auth.currentUser) {
            navigate("/login");
        }
    });

    const [subredditOptions, setSubredditOptions] = useState([]);

    // Retrieve subreddits from the backend and set subreddit options
    useEffect(() => {
        async function retrieveSubreddits() {
            const subredditArr = [];
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

    const [subreddit, setSubreddit] = useState(null);

    const [type, setType] = useState("text");

    const [title, setTitle] = useState("");

    const [body, setBody] = useState("");

    const [image, setImage] = useState(null);

    const [imageDataURL, setImageDataURL] = useState(null);

    const [video, setVideo] = useState(null);

    const [videoDataURL, setVideoDataURL] = useState(null);

    const [spoiler, setSpoiler] = useState(false);

    const [NSFW, setNSFW] = useState(false);

    function handleUpload(e) {
        const file = e.target.files[0];
        // Check if file is under 25MB
        if (file.size > 26214400) {
            alert("Maximum file size is 25MB");
            e.target.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (file.type.includes("image")) {
                setImageDataURL(reader.result);
                setImage(file);
            } else if (file.type.includes("video")) {
                setVideoDataURL(reader.result);
                setVideo(file);
            }
        };
        reader.readAsDataURL(file);
    }

    async function submitPost(e) {
        e.preventDefault();
        // Reject if required fields remain unfilled
        if (
            !subreddit ||
            !title ||
            (type === "text" && !body) ||
            (type === "image" && !image) ||
            (type === "video" && !video)
        ) {
            return;
        }
        // Disable Post button while post is being uploaded
        e.target.disabled = true;
        try {
            const post = {
                subreddit: subreddit.value,
                author: {
                    id: auth.currentUser.uid,
                    displayName: auth.currentUser.displayName
                },
                type,
                title,
                spoiler,
                NSFW,
                votes: 0,
                body: null,
                src: null,
                timeCreated: serverTimestamp(),
                pinned: false
            };
            if (type === "text") {
                post.body = body;
            } else {
                let fileRef;
                if (type === "image") {
                    fileRef = ref(storage, `images/${uniqid()}`);
                    await uploadBytes(fileRef, image, "data_url");
                } else {
                    fileRef = ref(storage, `videos/${uniqid()}`);
                    await uploadBytes(fileRef, video, "data_url");
                }
                post.src = await getDownloadURL(fileRef);
            }
            // Submit post to database
            const postRef = await addDoc(
                collection(db, `subreddits/${post.subreddit}/posts`),
                post
            );
            // Add post info to user collection
            setDoc(
                doc(
                    db,
                    "users",
                    auth.currentUser.displayName,
                    "posts",
                    postRef.id
                ),
                { id: postRef.id, path: postRef.path }
            );

            navigate("/");
        } catch (error) {
            console.log(error);
            e.target.disabled = false;
        }
    }

    return (
        <div className="CreatePost">
            <Navbar />
            <div className="max-w-4xl m-auto">
                <h2 className="text-lg font-bold border-b-white border-b-1 mb-4 py-3">
                    Create a post
                </h2>
                <Select
                    className="w-72 mb-2"
                    options={subredditOptions}
                    placeholder="Choose a community"
                    onChange={setSubreddit}
                />
                <div className="bg-white rounded-md">
                    <div className="flex">
                        <div
                            className={`post-tab ${
                                type === "text" && "selected-tab"
                            }`}
                            onClick={() => setType("text")}
                        >
                            Post
                        </div>
                        <div
                            className={`post-tab ${
                                type === "image" && "selected-tab"
                            }`}
                            onClick={() => setType("image")}
                        >
                            Image
                        </div>
                        <div
                            className={`post-tab ${
                                type === "video" && "selected-tab"
                            }`}
                            onClick={() => setType("video")}
                        >
                            Video
                        </div>
                    </div>
                    <form className="p-4">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Title"
                            maxLength={300}
                            className="input-border block mb-2"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        {type === "text" && (
                            <textarea
                                name="text"
                                id="text"
                                placeholder="Text (optional)"
                                className="input-border h-32"
                                value={body}
                                onChange={e => setBody(e.target.value)}
                            ></textarea>
                        )}
                        {/* If post type is image, display file input. If image has already been uploaded, display image preview */}
                        {type === "image" && (
                            <div className="flex justify-center items-center min-h-[8rem] input-border">
                                {image ? (
                                    <div className="flex justify-center items-center min-h-[8rem]">
                                        <img
                                            src={imageDataURL}
                                            alt="uploaded by user"
                                            className="max-h-96 max-w-full"
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="image"
                                        name="image"
                                        className="w-auto"
                                        onChange={handleUpload}
                                    />
                                )}
                            </div>
                        )}
                        {/* If post type is video, display file input. If video has already been uploaded, display video preview */}
                        {type === "video" && (
                            <div className="flex justify-center items-center min-h-[8rem] input-border">
                                {video ? (
                                    <div className="flex justify-center items-center min-h-[8rem]">
                                        <video
                                            controls
                                            width={960}
                                            height={720}
                                        >
                                            <source src={videoDataURL} />
                                        </video>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        accept="video/*"
                                        id="video"
                                        name="video"
                                        className="w-auto"
                                        onChange={handleUpload}
                                    />
                                )}
                            </div>
                        )}
                        <div className="border-b-1 border-gray-200 py-3">
                            <button
                                type="button"
                                onClick={() => setSpoiler(!spoiler)}
                                className={`text-gray-400 border-gray-400 ${
                                    spoiler && "spoiler-active"
                                }`}
                            >
                                Spoiler
                            </button>
                            <button
                                type="button"
                                onClick={() => setNSFW(!NSFW)}
                                className={`text-gray-400 border-gray-400 ${
                                    NSFW && "nsfw-active"
                                }`}
                            >
                                NSFW
                            </button>
                        </div>
                        <div className="py-3 flex justify-end">
                            <button
                                type="button"
                                className="text-blue-500 border-blue-500"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={submitPost}
                                className="text-white border-blue-500 bg-blue-500"
                            >
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
