import React, { useEffect, useState } from 'react';
import { useSearchStore } from '../store/useSearchStore';
import { Link } from 'react-router-dom';

const hashtags = [
    '신상',
    '라인드 클로그',
    '레이',
    '주토피아',
    '지비츠',
    '베이 크록스',
    '아이브',
    '르세라핌',
    '장 폴 고티에',
    '샤몬 로샤',
    '도라에몽',
    '언퍼게터블',
    '클래식 플랫폼 클로그',
    '에코 웨이브',
    '태민',
    '발레리나 플랫폼',
    '트레일브레이크',
    '하이드라 클로그',
    '잔망루피',
];

// 배열 섞기 함수
const shuffleTag = (tag) => {
    const newTag = [...tag];
    for (let i = newTag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newTag[i], newTag[j]] = [newTag[j], newTag[i]];
    }

    return newTag;
};

const SearchLeft = () => {
    const { recentSearches, onRemoveSearch, onClearAll } = useSearchStore();
    const [randomTags, setRandomTags] = useState([]);

    useEffect(() => {
        const shuffled = shuffleTag(hashtags).slice(0, 6);
        setRandomTags(shuffled);
    }, []);

    return (
        <>
            <div className="recent_searches_wrap">
                <h4 className="recent_search">Recent Searches</h4>
                <ul className="recent_search_list">
                    {recentSearches.length > 0 ? (
                        recentSearches.map((search) => (
                            <li key={search.id}>
                                <Link to="*">{search.inputText}</Link>
                                <button onClick={() => onRemoveSearch(search.id)}>x</button>
                            </li>
                        ))
                    ) : (
                        <li className="none_searche">최근 검색어가 없습니다.</li>
                    )}
                </ul>
                {recentSearches.length > 0 && (
                    <button className="all_clear_btn" onClick={onClearAll}>
                        전제 삭제 <span>x</span>
                    </button>
                )}
            </div>

            <div className="hashtag_wrap">
                <h4 className="hashtag"># HASHTAG</h4>
                <div className="hashtag_list">
                    {/* {hashtags.map((hashtag) => (
                        <span className="tag">
                            <Link to="*">{`# ${hashtag}`}</Link>
                        </span>
                    ))} */}
                    {randomTags.map((hashtag, id) => (
                        <span className="tag" key={id}>
                            <Link to="*">{`# ${hashtag}`}</Link>
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SearchLeft;
