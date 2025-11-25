import React from 'react';
import Title from './Title';

const CsEmailPopup = () => {
    return (
        <div className="cs_email_popup_wrap">
            <Title title="CS Center" />
            <div className="email_popup_left">{/* 공지사항 / 안내사항 */}</div>
            <div className="email_popup_right">
                {/* 이메일 입력 창 */}
                {/* 이름, 연락처(핸드폰 번호 & 이메일), 제목, 내용 */}
                <div className="cs_email_popup">
                    <form className="cs_email_form">
                        <label>
                            이름
                            <input type="text" placeholder="이름" />
                        </label>
                        <label>
                            연락처
                            <input type="phone" placeholder="핸드폰 번호" />
                        </label>
                        <label>
                            이메일
                            <input type="email" placeholder="email" />
                        </label>
                        <label>
                            제목
                            <input type="text" placeholder="제목" />
                        </label>
                        <textarea name="cs_text" id="cs_text" placeholder="문의 내용" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CsEmailPopup;
