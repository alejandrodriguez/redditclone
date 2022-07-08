import React from "react";
import Select from "react-select";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function PageSelect(props) {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    function redirect(option) {
        if (option.value.includes("/")) {
            navigate(option.value);
        } else {
            navigate(`/r/${option.value}`);
        }
    }

    return (
        <Select
            placeholder="Subreddit"
            className="w-72"
            isSearchable={false}
            options={props.options}
            value={
                // Set selected value to current subreddit or path
                props.options
                    ? params.subreddit
                        ? props.options.find(option => {
                              return option.value === params.subreddit;
                          })
                        : props.options.find(option => {
                              return option.value === location.pathname;
                          })
                    : ""
            }
            onChange={redirect}
        />
    );
}

export default PageSelect;
