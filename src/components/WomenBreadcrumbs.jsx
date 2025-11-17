import React from 'react';
<<<<<<< HEAD:src/components/Breadcrumbs.jsx
<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
import './scss/breadcrumbs.scss';

export default function Breadcrumbs({ category, subcategory }) {
    const navigate = useNavigate();

    const handleClose = () => {
        if (subcategory) {
            // 서브카테고리가 있으면 메인 카테고리로 이동
            navigate(`/${category}`);
        } else {
            // 서브카테고리가 없으면 홈으로 이동
            navigate('/');
        }
    };

=======

const Breadcrumbs = ({ category, subcategory }) => {
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
=======
import './scss/WomenBreadcrumbs.scss';

export default function WomenBreadcrumbs({ category, subcategory }) {
>>>>>>> 680e991 (2025-11-17(월) 스와이퍼 적용 완료 - v02):src/components/WomenBreadcrumbs.jsx
    return (
        <div className="breadcrumbs">
            <ul className="breadcrumbs__list">
                <li className="breadcrumbs__list--home">
<<<<<<< HEAD
                    <Link to="/" className="breadcrumbs__list--home_link">
                        <img src="/images/Sub_Women_Images/icon-home.svg" alt="홈 버튼" />
                    </Link>
                </li>

                <li className="breadcrumbs__list--section">
                    <span>:</span>
                </li>

                {/* 🟢 메인 카테고리 */}
                <li className="breadcrumbs__list--women">
                    <Link to={`/${category}`} className="breadcrumbs__list--women_link">
                        <span>{category.toUpperCase()}</span>
                    </Link>
                    <button className="close_btn" onClick={handleClose}>
                        <img src="/images/Sub_Women_Images/icon-close_cross.svg" alt="닫기 버튼" />
                    </button>
                </li>

                {/* 🟢 서브 카테고리 */}
=======
                    <a href="/" className="breadcrumbs__list--home_link">
                        <img src="/images/Sub_Women_Images/icon-home.svg" alt="홈 버튼" />
                    </a>
                </li>
                <li className="breadcrumbs__list--section">
                    <span>:</span>
                </li>
                <li className="breadcrumbs__list--women">
                    <a href="#" className="breadcrumbs__list--women_link">
                        <span>{category || '여성'}</span>
                        <img src="/images/Sub_Women_Images/icon-arrow-right.svg" alt="여성 버튼" />
                    </a>
                </li>
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
                {subcategory && (
                    <>
                        <li className="breadcrumbs__list--section">
                            <span>:</span>
                        </li>
                        <li className="breadcrumbs__list--Fur-lined">
<<<<<<< HEAD
                            <Link
                                to={`/${category}/${subcategory}`}
                                className="breadcrumbs__list--Fur-lined_link"
                            >
                                <span>{subcategory.toUpperCase()}</span>
                            </Link>
                            <button className="close_btn" onClick={handleClose}>
                                <img
                                    src="/images/Sub_Women_Images/icon-close_cross.svg"
                                    alt="닫기 버튼"
                                />
                            </button>
=======
                            <a href="#" className="breadcrumbs__list--Fur-lined_link">
                                <span>{subcategory}</span>
                                <img src="/images/Sub_Women_Images/icon-close_cross.svg" alt="닫기 버튼" />
                            </a>
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
                        </li>
                    </>
                )}
            </ul>
<<<<<<< HEAD

            <div className="breadcrumbs__title">
                <h2>
                    {subcategory
                        ? `${category.toUpperCase()} : ${subcategory.toUpperCase()}`
                        : category.toUpperCase()}
                </h2>
            </div>
        </div>
    );
}
=======
            <div className="breadcrumbs__title">
                <h2>{subcategory || category || '털안감 라인드 클로그'}</h2>
            </div>
        </div>
    );
<<<<<<< HEAD:src/components/Breadcrumbs.jsx
};

export default Breadcrumbs;
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
=======
}
>>>>>>> 680e991 (2025-11-17(월) 스와이퍼 적용 완료 - v02):src/components/WomenBreadcrumbs.jsx
