import React from 'react';
import Title from '../components/Title';
import './scss/Nonmember.scss';
// import CrocsClubJion from '../components/CrocsClubJion';
import CrocsClubJoin from '../components/CrocsClubJoin';

const Nonmember = () => {
    return (
        <div className="sub_page">
            <div className="inner">
                <div className="nonmember_wrap">
                    <Title subTitle="비회원 주문 조회" />
                    <form className="nonmember_form">
                        <input type="text" placeholder="주문자명" />
                        <input type="text" placeholder="주문번호(하이픈'-'포함)" />
                        <input type="password" placeholder="비회원 주문조회 비밀번호" />
                        <button>주문조회</button>
                    </form>
                    <CrocsClubJoin />
                </div>
            </div>
        </div>
    );
};

export default Nonmember;
