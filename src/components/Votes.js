import React from "react";

function Votes(props) {
    return (
        <div className="flex flex-col justify-center items-center">
            {/* Upvote Outline */}
            <svg
                className="cursor-pointer"
                onClick={props.upvote}
                style={{ width: "24px", height: "24px" }}
                viewBox="0 0 24 24"
            >
                <path
                    fill="currentColor"
                    d="M16,13V21H8V13H2L12,3L22,13H16M7,11H10V19H14V11H17L12,6L7,11Z"
                />
            </svg>
            {props.votes}
            {/* Downvote Outline */}
            <svg
                className="cursor-pointer"
                onClick={props.downvote}
                style={{ width: "24px", height: "24px" }}
                viewBox="0 0 24 24"
            >
                <path
                    fill="currentColor"
                    d="M22,11L12,21L2,11H8V3H16V11H22M12,18L17,13H14V5H10V13H7L12,18Z"
                />
            </svg>
        </div>
    );
}

export default Votes;
