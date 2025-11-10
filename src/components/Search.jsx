import React from 'react';
import SearchInput from './SearchInput';
import { Link } from 'react-router-dom';
import './scss/search.scss';
import SearchLeft from './SearchLeft';
import { useSearchStore } from '../store/useSearchStore';

const Search = () => {
    const { inputText, onInputText, onAddRecentSearches } = useSearchStore();

    const handleSearch = (e) => {
        e.preventDefault();
        onAddRecentSearches();
    };

    return (
        <div className="search_wrap">
            <div className="search_top">
                <SearchInput
                    onSearch={handleSearch}
                    inputText={inputText}
                    onInputText={(e) => {
                        onInputText(e.target.value);
                    }}
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
