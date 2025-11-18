import React from 'react';
import Title from './Title';
import CrocsClubOption from './CrocsClubOption';
import { Link } from 'react-router-dom';
import './scss/crocsClubPopup.scss';

const CrocsClubPopup = () => {
    return (
        <div className="sub_page">
            <div className="inner">
                <div className="crocs_club_popup_wrap">
                    <Title
                        title="Crocs Club"
                        subTitle="크록스 클럽을 가입하고 15%할인 쿠폰 및 다양한 혜택을 받아보세요."
                    />
                    <div className="popup_wrap">
                        <div className="crocs_club_popup_left">
                            <p>
                                <span>1</span> 첫 주문 추가 15% 할인
                            </p>
                            <p>
                                <span>2</span> 신상품 프리뷰
                            </p>
                            <p>
                                <span>3</span> 온라인 단독 할인 & 행사
                            </p>
                            <p>
                                <span>4</span> VIP 세일 & 프라이빗 이벤트
                            </p>
                        </div>
                        <div className="crocs_club_popup_right">
                            {/* 생일 옵션 , 이메일, 체크박스, 동의*/}
                            <CrocsClubOption />
                        </div>
                    </div>
                    <p>
                        <Link to="/userinfo">Crocs Club Join</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CrocsClubPopup;
