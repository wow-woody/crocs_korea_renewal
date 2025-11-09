import React, { useState } from 'react';
import './scss/joinform.scss';
import { joinStore } from '../store/joinStore';
import { useNavigate } from 'react-router-dom';

const JoinForm = () => {
    //변수
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        email: '',
        password: '',
        phone: '',
        file: null,
        profile: '',
    });

    const { onJoin } = joinStore();
    const navigate = useNavigate();

    //메서드
    //회원가입 메서드
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('회원가입');
        await onJoin(formData);
        navigate('/');
    };

    // 각각의 input 요소의 값이 변경될 때
    const handleChange = (e) => {
        const { name, value, file } = e.target;
        // console.log(name, value);
        setFormData({ ...formData, [name]: value });
    };

    //화면에 뿌려질 내용
    return (
        <div className="join_form_wrap">
            <form onSubmit={handleSubmit}>
                <div className="phone_admit">
                    <p>이름</p>
                    <input
                        type="text"
                        name="name"
                        placeholder="이름"
                        onChange={handleChange}
                        className="admit_input"
                    />
                    <p>전화번호</p>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="전화번호"
                        onChange={handleChange}
                        className="admit_input"
                    />
                </div>
                <div className="required">
                    <p className="required_title">필수정보</p>
                    <input
                        type="text"
                        name="ID"
                        placeholder="아이디"
                        onChange={handleChange}
                        className="required_input"
                    />
                    <p className="required_content">영문소문자/숫자, 4-16자</p>
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        onChange={handleChange}
                        className="required_input"
                    />
                    <p className="required_content">영문소문자/숫자, 4-16자</p>
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        onChange={handleChange}
                        className="required_input"
                    />
                </div>
                <div className="add_info">
                    <p>
                        <span>회원가입</span>
                        <input
                            type="date"
                            name="text"
                            placeholder="생년월일"
                            onChange={handleChange}
                        />
                    </p>
                    <p>
                        <span>성별</span>
                        <span>남자</span>
                        <input type="radio" name="gender_man" onChange={handleChange} />
                        <span>여자</span>
                        <input type="radio" name="gender_women" onChange={handleChange} />
                    </p>
                </div>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default JoinForm;
