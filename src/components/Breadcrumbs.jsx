import React from 'react';
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

    return (
        <div className="breadcrumbs">
            <ul className="breadcrumbs__list">
                <li className="breadcrumbs__list--home">
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
                {subcategory && (
                    <>
                        <li className="breadcrumbs__list--section">
                            <span>:</span>
                        </li>
                        <li className="breadcrumbs__list--Fur-lined">
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
                        </li>
                    </>
                )}
            </ul>

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
