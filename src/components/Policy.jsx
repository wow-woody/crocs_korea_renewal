import React, { useState } from 'react';
import { joinStore } from '../store/joinStore';
import PolicyPopup from './PolicyPopup';

const Policy = () => {
    const { onPolicyPopup } = joinStore();
    //이용약관 동의 변수
    const [agree, setAgree] = useState({
        terms: false,
        privacy: false,
        option: false,
    });

    // 이용약관 토글버튼
    const handleToggle = (agree) => {
        console.log('들어온값 확인:', agree);
        setAgree((prev) => ({
            ...prev,
            [agree]: !prev[agree],
        }));
    };

    return (
        <div className="policy_wrap">
            <div className="policy_top">약관 전체 동의</div>
            <div className="policy_middle">
                <div className="policy_checklist">
                    <input type="checkbox" />
                    <div>(필수) 이용약관 동의</div>
                    <div
                        onClick={() => {
                            onPolicyPopup();
                        }}
                    >
                        <img src="/images/icon-arrow-down.svg" alt="icon-down" />
                    </div>
                </div>

                <div className="policy_checklist">
                    <input type="checkbox" />
                    <div>(필수) 개인정보 수집 및 이용 동의</div>
                    <div
                        onClick={() => {
                            onPolicyPopup();
                        }}
                    >
                        <img src="/images/icon-arrow-down.svg" alt="icon-down" />
                    </div>
                    {/*                 
                    <div
                        onClick={() => {
                            handleToggle('privacy');
                        }}
                    >
                        {agree.privacy ? (
                            <img src="/images/icon-arrow-up.svg" alt="icon-up" />
                        ) : (
                            <img src="/images/icon-arrow-down.svg" alt="icon-down" />
                        )}
                    </div>
                    {agree.privacy && (
                        <div className="privacy_text">
                            <strong>1. 개인정보 수집 및 이용 목적</strong>
                            <span></span>회원가입
                            <br />
                            (온라인 일반 회원 가입 / 소셜 회원가입(네이버) / 소셜 회원가입(카카오))
                            <br />
                            <strong>2. 수집하는 개인정보 항목</strong>
                            <br />
                            &nbsp;- (온라인 일반 회원가입): 아이디, 비밀번호, 이름, 휴대폰번호,
                            이메일, 본인확인정보(CI), 중복가입확인정보(DI)
                            <br />
                            &nbsp;- (소셜 회원가입/네이버): 이름, 이메일주소, 휴대폰번호
                            <br />
                            &nbsp;- (소셜 회원가입/카카오): 카카오계정(이메일), 프로필 사진, 닉네임,
                            이름, 카카오계정(전화번호)
                            <br />
                            <strong>3. 개인정보 보유 및 이용 기간</strong>
                            <br />
                            <strong>
                                <ins>회원탈퇴 후 5일까지</ins>
                            </strong>
                            <br />※ 필수 항목 수집에 대한 동의를 거부할 수 있으나 거부 시 회원
                            가입이 불가능합니다.
                        </div>
                    )} */}
                </div>
                <div className="policy_checklist">
                    <input type="checkbox" />
                    <div>(선택) 개인정보 수집 및 이용 동의</div>
                    <div
                        onClick={() => {
                            onPolicyPopup();
                        }}
                    >
                        <img src="/images/icon-arrow-down.svg" alt="icon-down" />
                    </div>
                    {/* <div
                        onClick={() => {
                            handleToggle('option');
                        }}
                    >
                        {agree.option ? (
                            <img src="/images/icon-arrow-up.svg" alt="icon-up" />
                        ) : (
                            <img src="/images/icon-arrow-down.svg" alt="icon-down" />
                        )}
                    </div>
                    {agree.option && (
                        <div className="option_text">
                            <strong>1. 개인정보 수집 및 이용 목적</strong>
                            <br />
                            생일 쿠폰 제공, 성별, 연령층 타겟 분석 및 맞춤형 혜택/정보 제공
                            <br />
                            (온라인 일반 회원 가입 / 소셜 회원가입(네이버) / 소셜 회원가입(카카오))
                            <br />
                            <strong>2. 수집하는 개인정보 항목</strong>
                            <br />
                            &nbsp;- (온라인 일반 회원가입): 성별, 생년월일, 주소
                            <br />
                            &nbsp;- (소셜 회원가입/네이버): 출생연도, 성별, 생일
                            <br />
                            &nbsp;- (소셜 회원가입/카카오): 성별, 배송지정보(수령인명, 배송지 주소,
                            전화번호), 연령대, 생일, 출생 연도
                            <br />
                            <strong>3. 개인정보 보유 및 이용 기간</strong>
                            <br />
                            <strong>
                                <ins>동의 철회 시 또는 회원탈퇴 후 5일까지</ins>
                            </strong>
                            <br />
                            ※ 선택 항목 수집에 대한 동의를 거부할 수 있으며 거부 시에도 회원 가입이
                            가능합니다.
                            <br />
                        </div>
                    )} */}
                </div>
            </div>

            <div className="policy_bottom"></div>
            <PolicyPopup />
        </div>
    );
};

export default Policy;
