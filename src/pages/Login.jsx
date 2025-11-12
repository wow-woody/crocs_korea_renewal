import React, { useState } from 'react';
import Title from '../components/Title';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import './scss/login.scss';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { onLogin, onGoogleLogin } = useAuthStore();

    const navigate = useNavigate();

    // 메서드
    // 1. 기본 로그인
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('전송.');
        await onLogin(email, password);
        navigate('/');
    };

    // 2. 구글 로그인
    const handleGoogleLogin = async () => {
        console.log('구글');
        await onGoogleLogin();
        navigate('/userinfo');
    };

    return (
        <div className="sub_page">
            <div className="inner">
                <div className="login_wrap">
                    <Title title="Login" />
                    <LoginForm
                        onLoginSubmit={handleSubmit}
                        email={email}
                        password={password}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        onGoogleLogin={handleGoogleLogin}
                    />
                    <p>
                        <Link>비회원 주문조회</Link>
                    </p>
                </div>
                <div className="crocsclub_wrap">
                    <Title subTitle="CrocsClub Benefit" />
                    <ul className="benefit_list">
                        <li>
                            <img src="./images/benefit_img_01.svg" alt="benefit" />
                        </li>
                        <li>
                            <img src="./images/benefit_img_02.svg" alt="benefit" />
                        </li>
                        <li>
                            <img src="./images/benefit_img_03.svg" alt="benefit" />
                        </li>
                    </ul>
                    {/* <button>CrocsClub Join</button> */}
                    <Link to="/crocsclub">CrocsClub Join</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
