import React from "react";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";

function SubredditLinks(props) {
    const navigate = useNavigate();
    const params = useParams();

    function redirect(option) {
        if (option.value === "home") {
            navigate("/");
        } else {
            navigate(`/r/${option.value}`);
        }
    }

    return (
        <Select
            placeholder="Subreddit"
            className="w-72 mb-2"
            isSearchable={false}
            closeMenuOnSelect={false}
            options={props.options}
            value={
                // Set selected value to current subreddit
                props.options
                    ? params.subreddit
                        ? props.options.find(option => {
                              return option.value === params.subreddit;
                          })
                        : props.options[0]
                    : ""
            }
            onChange={redirect}
        />
    );
}

export default SubredditLinks;
