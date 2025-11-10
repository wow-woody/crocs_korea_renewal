import React from 'react';

const SearchInput = ({ onSearch, inputText, onInputText }) => {
    return (
        <div className="search_input">
            <input type="text" placeholder="SEARCH" value={inputText} onChange={onInputText} />
            <button className="search_btn" onClick={onSearch}>
                <img src="./images/search_icon.svg" alt="search_icon" />
            </button>
        </div>
    );
};

export default SearchInput;
