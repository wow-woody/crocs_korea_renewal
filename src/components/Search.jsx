import React from 'react';
import SearchInput from './SearchInput';
import './scss/search.scss';
import SearchLeft from './SearchLeft';
import { useSearchStore } from '../store/useSearchStore';
import SearchRight from './SearchRight';
import { useLocation } from 'react-router-dom';

const Search = ({ scrolled }) => {
    const { inputText, onInputText, onAddRecentSearches, searchOpen, onCloseSearch } =
        useSearchStore();

    const handleSearch = (e) => {
        e.preventDefault();
        onAddRecentSearches();
        onInputText('');
    };

    const location = useLocation();
    const isSubPage = location.pathname !== '/'; // 예: 메인 페이지가 '/'일 경우

    if (!searchOpen) return null;

    return (
        // <div className={`search_wrap ${searchOpen ? 'open' : ''}`}>
        <div
            className={`search_wrap
        ${searchOpen ? 'open' : ''}
        ${isSubPage ? 'subpage' : ''}
        ${scrolled ? 'scrolled' : ''}`}
        >
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
                    {/* <Link>
                        <img src="./images/search_img.svg" alt="" />
                    </Link> */}
                    <SearchRight />
                </div>
            </div>
        </div>
    );
};

export default Search;
