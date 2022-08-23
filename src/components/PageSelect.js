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
        }),
        menuPortal: provided => ({
            ...provided,
            zIndex: 9999
        })
    };

    return (
        <Select
            placeholder="..."
            className="w-48 md:w-72"
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
            styles={customStyles}
            menuPortalTarget={document.body}
        />
    );
}

export default PageSelect;
