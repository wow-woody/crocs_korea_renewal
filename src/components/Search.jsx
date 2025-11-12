import React from 'react';
import SearchInput from './SearchInput';
import { Link } from 'react-router-dom';
import './scss/search.scss';
import SearchLeft from './SearchLeft';
import { useSearchStore } from '../store/useSearchStore';

const Search = () => {
    const { inputText, onInputText, onAddRecentSearches, searchOpen, onCloseSearch } =
        useSearchStore();

    const handleSearch = (e) => {
        e.preventDefault();
        onAddRecentSearches();
    };

    return (
        <div className={`search_wrap ${searchOpen ? 'open' : ''}`}>
            <button className="close_btn" onClick={onCloseSearch}>
                <img src="./images/close_btn.svg" alt="close_btn" />
            </button>
            <div className="search_top">
                <SearchInput
                    inputText={inputText}
                    onChange={(e) => onInputText(e.target.value)} // 반드시 onChange로 전달
                    onSearch={handleSearch}
                />
            </div>
            <div className="search_bottom">
                <div className="search_left">
                    <SearchLeft />
                </div>
                <div className="search_right">
                    <Link>
                        <img src="./images/search_img.svg" alt="" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Search;
