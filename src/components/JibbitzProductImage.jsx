import React from 'react';
import { Link } from 'react-router-dom';

const JibbitzProductImage = ({ product }) => {
    const mainImages = [
        `${process.env.PUBLIC_URL}/images/ProductPage/imgi_53_crocs.avif`,
        `${process.env.PUBLIC_URL}/images/ProductPage/imgi_54_crocs.avif`,
        `${process.env.PUBLIC_URL}/images/ProductPage/imgi_55_crocs.avif`,
        `${process.env.PUBLIC_URL}/images/ProductPage/imgi_56_crocs.avif`,
        `${process.env.PUBLIC_URL}/images/ProductPage/imgi_57_crocs.avif`,
        `${process.env.PUBLIC_URL}/images/ProductPage/imgi_58_crocs.avif`,
    ];

    return (
        <div className="product-img-info__wrap">
            <div className="product-img">
                {/* 메인 이미지 */}
                <div className="product-img__main-wrap">
                    <ul className="product-img__list product-img__list--main">
                        <li>
                            <img
                                className="product-img__img"
                                src={product.imageUrl}
                                alt={product.title}
                                loading="lazy"
                            />
                        </li>
                        {/* {mainImages.map((img, index) => (
                        <li
                            key={index}
                            className={`product-img__item ${
                                index !== 0 ? 'product-img__item--none' : ''
                            }`}
                        >
                            <img
                                className="product-img__img"
                                src={img}
                                alt={`클래식 언퍼게터블 스웨이드 클로그 ${index + 1}번째 이미지`}
                                loading="lazy"
                            />
                        </li>
                    ))} */}
                    </ul>
                </div>

                {/* 썸네일 이미지 */}
                <aside className="product-img__thumbs-wrap">
                    {/* Top btns */}
                    <div className="thumbs__ctrl thumbs__ctrl--top">
                        <button
                            type="button"
                            className="product-img__thumbs-link"
                            // aria-label={`${index + 1}번째 이미지 보기`}
                        >
                            <img
                                className="thumbs__icon"
                                src={`${process.env.PUBLIC_URL}/images/icon-arrow-up-hairline.svg`}
                                alt=""
                            />
                        </button>
                        <button
                            type="button"
                            className="thumbs__btn thumbs__btn--active"
                            aria-label="이전 썸네일 보기"
                        >
                            <img
                                className="thumbs__icon"
                                src={`${process.env.PUBLIC_URL}/images/icon-arrow-up-green.svg`}
                                alt=""
                            />
                        </button>
                    </div>

                    {/* Thumbs List */}
                    <ul className="product-img__thumbs-list">
                        <li className="product-img__thumbs-item">
                            <button
                                type="button"
                                className="product-img__thumbs-link"
                                // aria-label={`${index + 1}번째 이미지 보기`}
                            >
                                <img
                                    className="product-img__thumbs-img"
                                    src={product.imageUrl}
                                    alt={product.title}
                                    loading="lazy"
                                />
                            </button>
                        </li>
                        {/* {mainImages.map((img, index) => (
                        <li key={index} className="product-img__thumbs-item">
                            <button
                                type="button"
                                className="product-img__thumbs-link"
                                aria-label={`${index + 1}번째 이미지 보기`}
                            >
                                <img
                                    className="product-img__thumbs-img"
                                    src={img}
                                    alt={`썸네일 ${index + 1}`}
                                    loading="lazy"
                                />
                            </button>
                        </li>
                    ))} */}
                    </ul>

                    {/* Bottom btns */}
                    <div className="thumbs__ctrl thumbs__ctrl--bottom">
                        <button
                            type="button"
                            className="thumbs__btn thumbs__btn--down"
                            aria-label="다음 썸네일 보기"
                        >
                            <img
                                className="thumbs__icon"
                                src={`${process.env.PUBLIC_URL}/images/icon-arrow-down-hairline.svg`}
                                alt=""
                            />
                        </button>
                        <button
                            type="button"
                            className="thumbs__btn thumbs__btn--active"
                            aria-label="다음 썸네일 보기"
                        >
                            <img
                                className="thumbs__icon"
                                src={`${process.env.PUBLIC_URL}/images/icon-arrow-down-green.svg`}
                                alt=""
                            />
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default JibbitzProductImage;
