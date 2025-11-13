import React, { useState } from 'react';

const Policy = () => {
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
                            handleToggle('terms');
                        }}
                    >
                        {agree.terms ? (
                            <img src="/images/icon-arrow-up.svg" alt="icon-up" />
                        ) : (
                            <img src="/images/icon-arrow-down.svg" alt="icon-down" />
                        )}
                    </div>
                    {agree.terms && (
                        <div className="terms_text">
                            이용약관어쩌고저쩌고어쩌고저쩌고어쩔어쩔어쩔어쩔
                        </div>
                    )}
                </div>
                <div className="policy_checklist">
                    <input type="checkbox" />
                    <div>(필수) 개인정보 수집 및 이용 동의</div>
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
                            이용약관어쩌고저쩌고어쩌고저쩌고어쩔어쩔어쩔어쩔
                        </div>
                    )}
                </div>
                <div className="policy_checklist">
                    <input type="checkbox" />
                    <div>(선택) 개인정보 수집 및 이용 동의</div>
                    <div
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
                            이용약관어쩌고저쩌고어쩌고저쩌고어쩔어쩔어쩔어쩔
                        </div>
                    )}
                </div>
            </div>
            <div className="policy_bottom"></div>
        </div>
    );
};

export default Policy;
