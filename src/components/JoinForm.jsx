import React, { useState } from 'react';
import './scss/joinform.scss';
import { joinStore } from '../store/joinStore';
import { useNavigate } from 'react-router-dom';

const JoinForm = () => {
    //변수
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        ID: '',
        password: '',
        email: '',
        birthday: '',
        gender: '',
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
                        placeholder="이름을 입력하세요"
                        onChange={handleChange}
                        className="admit_input"
                    />
                    <p>전화번호</p>
                    <input
                        type="tel"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        name="phone"
                        placeholder="전화번호"
                        onChange={handleChange}
                        className="admit_input"
                    />
                </div>
                <div className="form_line"></div>
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
                    <p>생년월일</p>
                    <input type="date" name="birthday" onChange={handleChange} />
                    <p>성별</p>
                    <div className="gender_wrap">
                        <label className="radio">
                            <input type="radio" name="gender" onChange={handleChange} />
                            <span className="radio_custom"></span>
                            남자
                        </label>
                        <label className="radio">
                            <input type="radio" name="gender" onChange={handleChange} />
                            <span className="radio_custom"></span>
                            여자
                        </label>
                    </div>
                </div>
                <button type="submit">Join</button>
            </form>
        </div>
    );
};

export default JoinForm;
