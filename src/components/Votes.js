import React from "react";

function Votes(props) {
    return (
        <div className="flex flex-col items-center">
            {/* Upvote Outline */}
            {props.upvoted ? (
                <svg
                    className="cursor-pointer hover:bg-gray-300 rounded"
                    onClick={props.upvote}
                    style={{ width: "24px", height: "24px" }}
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="#FF5430"
                        d="M15,20H9V12H4.16L12,4.16L19.84,12H15V20Z"
                    />
                </svg>
            ) : (
                <svg
                    className="cursor-pointer hover:bg-gray-300 rounded"
                    onClick={props.upvote}
                    style={{ width: "24px", height: "24px" }}
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M16,13V21H8V13H2L12,3L22,13H16M7,11H10V19H14V11H17L12,6L7,11Z"
                    />
                </svg>
            )}
            {props.votes}
            {/* Downvote Outline */}
            {props.downvoted ? (
                <svg
                    className="cursor-pointer hover:bg-gray-300 rounded"
                    onClick={props.downvote}
                    style={{ width: "24px", height: "24px" }}
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="#8374FF"
                        d="M9,4H15V12H19.84L12,19.84L4.16,12H9V4Z"
                    />
                </svg>
            ) : (
                <svg
                    className="cursor-pointer hover:bg-gray-300 rounded"
                    onClick={props.downvote}
                    style={{ width: "24px", height: "24px" }}
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M22,11L12,21L2,11H8V3H16V11H22M12,18L17,13H14V5H10V13H7L12,18Z"
                    />
                </svg>
            )}
        </div>
    );
}

export default Votes;
