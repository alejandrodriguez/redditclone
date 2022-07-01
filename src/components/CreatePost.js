import React, { useState } from "react";
import Select from "react-select";

function CreatePost() {
    const mockSubreddits = [
        { value: "funny", label: "r/funny" },
        { value: "ProgrammerHumor", label: "r/ProgrammerHumor" },
        { value: "ThatsInsane", label: "r/ThatsInsane" },
        { value: "news", label: "r/news" },
        { value: "science", label: "r/science" }
    ];

    const [subreddit, setSubreddit] = useState(null);

    const [postType, setPostType] = useState("text");

    const [title, setTitle] = useState("");

    const [body, setBody] = useState("");

    const [image, setImage] = useState(null);

    const [video, setVideo] = useState(null);

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
                console.log("image");
                setImage(reader.result);
            } else if (file.type.includes("video")) {
                console.log("video");
                setVideo(reader.result);
            }
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className="CreatePost">
            <div className="max-w-4xl m-auto">
                <h2 className="text-lg font-bold border-b-white border-b-1 mb-4 py-3">
                    Create a post
                </h2>
                <Select
                    className="w-72 mb-2"
                    options={mockSubreddits}
                    placeholder="Choose a community"
                    onChange={setSubreddit}
                />
                <div className="bg-white rounded-md">
                    <div className="flex">
                        <div
                            className={`post-tab ${
                                postType === "text" && "selected-tab"
                            }`}
                            onClick={() => setPostType("text")}
                        >
                            Post
                        </div>
                        <div
                            className={`post-tab ${
                                postType === "image" && "selected-tab"
                            }`}
                            onClick={() => setPostType("image")}
                        >
                            Image
                        </div>
                        <div
                            className={`post-tab ${
                                postType === "video" && "selected-tab"
                            }`}
                            onClick={() => setPostType("video")}
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
                        {postType === "text" && (
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
                        {postType === "image" && (
                            <div className="flex justify-center items-center min-h-[8rem] input-border">
                                {image ? (
                                    <div className="flex justify-center items-center min-h-[8rem]">
                                        <img
                                            src={image}
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
                        {postType === "video" && (
                            <div className="flex justify-center items-center min-h-[8rem] input-border">
                                {video ? (
                                    <div className="flex justify-center items-center min-h-[8rem]">
                                        <video
                                            controls
                                            width={960}
                                            height={720}
                                        >
                                            <source src={video} />
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
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={e => e.preventDefault()}
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
