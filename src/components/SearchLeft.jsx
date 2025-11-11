import React from 'react';
import { useSearchStore } from '../store/useSearchStore';
import { Link } from 'react-router-dom';

const hashtags = [
    '신상',
    '라인드 클로그',
    '주토피아',
    '지비츠',
    '베이 크록스',
    '아이브',
    '르세라핌',
    '장 폴 고티에',
    '샤몬 로샤',
];

const SearchLeft = () => {
    const { recentSearches } = useSearchStore();

    return (
        <>
            <div className="recent_searches_wrap">
                <h4 className="recent_search">Recent Searches</h4>
                <div className="recent_search_list">
                    {recentSearches.map((search) => (
                        <li key={search.id}>
                            <Link to="*">{search.inputText}</Link>
                            <button>x</button>
                        </li>
                    ))}
                    <button>
                        전제 삭제 <span>x</span>
                    </button>
                </div>
            </div>

            <div className="hashtag_wrap">
                <h4 className="hashtag"># HASHTAG</h4>
                <div className="hashtag_list">
                    {hashtags.map((hashtag) => (
                        <span className="tag">
                            <Link to="*">{`# ${hashtag}`}</Link>
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SearchLeft;
