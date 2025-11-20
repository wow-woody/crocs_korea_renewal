import React, { useState } from 'react';
import Title from '../components/Title';
import UserInfoTop from '../components/UserInfoTop';
import './scss/userinfo.scss';
import { Link, useSearchParams } from 'react-router-dom';
import WishListCard from '../components/WishListCard';
import { wishListStore } from '../store/wishListStore';
import OrderHistoryCard from '../components/OrderHistoryCard';
import OrderState from '../components/OrderState';

const UserInfo = () => {
    const { wishLists } = wishListStore();

    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="My Page" />
                {/* 마이 페이지 회원정보
                이름 / 크록스 클럽 가입 여부 / 쿠폰 정보 */}
                <UserInfoTop />
                <div className="user_btn_wrap">
                    {/* 마이 페이지 탭 버튼
                나의 정보 / 주문 정보 / 1:1 문의 /  */}
                    <button>나의 정보</button>
                    <Link to="/orderhistory">주문 정보</Link>
                    <button>혜택 정보</button>
                    <button>1 : 1 문의</button>
                </div>
                <div className="userinfo_current_order_wrap">
                    <div className="user_menu_top">
                        {/* 주문 처리 현황 */}
                        <h4>주문 처리 현황</h4>
                        <Link to="/orderhistory">더보기</Link>
                    </div>
                    <hr />
                    <div className="user_menu_bottom">
                        <OrderState />
                    </div>
                </div>
                {/* 최근 주문 내역 */}
                {/* <div className="userinfo_order_wrap">
                    <div className="user_menu_top">
                        <h4>최근 주문 내역</h4>
                        <Link to="/orderhistory">더보기</Link>
                    </div>
                    <hr />
                    <div className="user_menu_bottom">
                        <OrderHistoryCard />
                    </div>
                </div> */}
                <div className="userinfo_recentOrder_wrap">
                    <div className="user_menu_top">
                        {/* 최근 본 상품 */}
                        <h4>최근 본 상품</h4>
                        <Link to="/wishlist">더보기</Link>
                    </div>
                    <hr />
                    <div className="user_menu_bottom">
                        {wishLists.slice(0, 4).map((item) => (
                            <div key={item.id} className="wish_card">
                                <div className="wish_card_imgbox">
                                    <img src={item.imageUrl} alt={item.title} />
                                </div>
                                <div className="wish_card_textbox">
                                    <p>{item.title}</p>
                                    <div className="wish_card_price">
                                        <p>
                                            <span>{item.price}</span>
                                            <span>{item.price}</span>
                                        </p>
                                        <p className="price_bottom">
                                            {(
                                                (Number(item.price) / Number(item.price)) *
                                                100
                                            ).toFixed(0)}
                                            %
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="userinfo_wishlist_wrap">
                    <div className="user_menu_top">
                        {/* 위시리스트 */}
                        <h4>WishList</h4>
                        <Link to="/wishlist">더보기</Link>
                    </div>
                    <hr />
                    <div className="user_menu_bottom">
                        {wishLists.slice(0, 4).map((item) => (
                            <div key={item.id} className="wish_card">
                                <div className="wish_card_imgbox">
                                    <img src={item.imageUrl} alt={item.title} />
                                </div>
                                <div className="wish_card_textbox">
                                    <p>{item.title}</p>
                                    <div className="wish_card_price">
                                        <p>
                                            <span>{item.price}</span>
                                            <span>{item.price}</span>
                                        </p>
                                        <p className="price_bottom">
                                            {(
                                                (Number(item.price) / Number(item.price)) *
                                                100
                                            ).toFixed(0)}
                                            %
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
