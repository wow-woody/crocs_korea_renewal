import React from 'react';
import './scss/WomenBreadcrumbs.scss';

export default function WomenBreadcrumbs({ category, subcategory }) {
    return (
        <div className="breadcrumbs">
            <ul className="breadcrumbs__list">
                <li className="breadcrumbs__list--home">
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
                {subcategory && (
                    <>
                        <li className="breadcrumbs__list--section">
                            <span>:</span>
                        </li>
                        <li className="breadcrumbs__list--Fur-lined">
                            <a href="#" className="breadcrumbs__list--Fur-lined_link">
                                <span>{subcategory}</span>
                                <img src="/images/Sub_Women_Images/icon-close_cross.svg" alt="닫기 버튼" />
                            </a>
                        </li>
                    </>
                )}
            </ul>
            <div className="breadcrumbs__title">
                <h2>{subcategory || category || '털안감 라인드 클로그'}</h2>
            </div>
        </div>
    );
}
