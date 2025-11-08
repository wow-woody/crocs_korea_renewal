import React from 'react';
import SearchInput from './SearchInput';
import { Link } from 'react-router-dom';
import './scss/search.scss';

const Search = () => {
    return (
        <div className="search_wrap inner">
            <div className="search_top">
                <SearchInput />
            </div>
            <div className="search_bottom">
                <div className="search_left"></div>
                <div className="search_right">
                    <Link>
                        <img src="" alt="" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Search;
