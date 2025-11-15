import React from 'react';

const CrocsClubOption = () => {
    return (
        <div className="crocs_club_option">
            <div className="option_wrap">
                <form className="join_option_wrap">
                    <div className="birthday_select_wrap">
                        <select>
                            <option value="">mm</option>
                            <option value="01">1월</option>
                            <option value="02">2월</option>
                            <option value="03">3월</option>
                            <option value="04">4월</option>
                            <option value="05">5월</option>
                            <option value="06">6월</option>
                            <option value="07">7월</option>
                            <option value="08">8월</option>
                            <option value="09">9월</option>
                            <option value="10">10월</option>
                            <option value="11">11월</option>
                            <option value="12">12월</option>
                        </select>
                        <select>
                            <option value="">dd</option>
                            <option value="01">01일</option>
                            <option value="02">02일</option>
                            <option value="03">03일</option>
                            <option value="04">04일</option>
                            <option value="05">05일</option>
                            <option value="06">06일</option>
                            <option value="07">07일</option>
                            <option value="08">08일</option>
                            <option value="09">09일</option>
                            <option value="10">10일</option>
                            <option value="11">11일</option>
                            <option value="12">12일</option>
                            <option value="13">13일</option>
                            <option value="14">14일</option>
                            <option value="15">15일</option>
                            <option value="16">16일</option>
                            <option value="17">17일</option>
                            <option value="18">18일</option>
                            <option value="19">19일</option>
                            <option value="20">20일</option>
                            <option value="21">21일</option>
                            <option value="22">22일</option>
                            <option value="23">23일</option>
                            <option value="24">24일</option>
                            <option value="25">25일</option>
                            <option value="26">26일</option>
                            <option value="27">27일</option>
                            <option value="28">28일</option>
                            <option value="29">29일</option>
                            <option value="30">30일</option>
                            <option value="31">31일</option>
                        </select>
                    </div>

                    <input type="email" placeholder="이메일 주소를 입력해주세요." />
                    <label>
                        <input type="checkbox" />
                        크록스 클럽 및 마케팅 정보 수신 을 위한 개인정보의 수집 및 이용에
                        동의합니다.
                    </label>
                    <div className="text_box">
                        <div>
                            크록스코리아 주식회사는 아래와 같이 개인정보를 수집 및 이용합니다.
                            개인정보 수집 및 이용에 동의하지 않으셔도 되지만, 이 경우 Crocs
                            Korea에서 제공해드리는 특별 행사 관련 정보 및 할인쿠폰 발송이
                            불가합니다. 생일은 선택 항목이나, 미제공 시 생일 혜택 및 관련 이벤트
                            안내를 받지 못할 수 있습니다.
                        </div>
                        <div>
                            <strong>수집항목:</strong>
                            <p>이메일주소, 생일(선택)</p>
                        </div>
                        <div>
                            <strong>수집 및 이용목적</strong>
                            <p>Crocs Korea 소식 및 특별 행사 관련 이메일, 할인 쿠폰 발송</p>
                        </div>
                        <div>
                            <strong>보유 및 이용기간</strong>
                            <p>수신 거부시로부터 1년간 (중복가입 및 쿠폰 부정사용 방지목적)</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrocsClubOption;
