import React from 'react';
import Title from '../components/Title';
import UserInfoTop from '../components/UserInfoTop';
import './scss/userinfo.scss';
import { Link } from 'react-router-dom';
import WishListCard from '../components/WishListCard';

const UserInfo = () => {
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
                    <button>주문 정보</button>
                    <button>혜택 정보</button>
                    <button>1 : 1 문의</button>
                </div>
                <div className="userinfo_order_wrap">
                    <div className="user_menu_top">
                        {/* 주문 처리 현황 */}
                        <h4>주문 처리 현황</h4>
                        <Link to="/orderhistory">더보기</Link>
                    </div>
                    <hr />
                    <div className="user_menu_bottom">주문 처리 현황 영역</div>
                </div>
                <div className="userinfo_order_wrap">
                    <div className="user_menu_top">
                        {/* 최근 주문 내역 */}
                        <h4>최근 주문 내역</h4>
                        <Link>더보기</Link>
                    </div>
                    <hr />
                    <div className="user_menu_bottom">최근 주문 내역 영역</div>
                </div>
                <div className="userinfo_wishlist_wrap">
                    <div className="user_menu_top">
                        {/* 위시리스트 */}
                        <h4>WishList</h4>
                        <Link to="/wishlist">더보기</Link>
                    </div>
                    <hr />
                    <div className="user_menu_bottom">
                        <ul>
                            <WishListCard />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
