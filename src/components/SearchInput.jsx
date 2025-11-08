import React from 'react';

const SearchInput = () => {
    return (
        <div className="search_input">
            <input type="text" placeholder="SEARCH" />
            <button className="search_btn">
                <img src="./images/search_icon.svg" alt="search_icon" />
            </button>
        </div>
    );
};

export default SearchInput;
