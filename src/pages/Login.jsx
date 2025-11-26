'use no memo';

import React, { useState } from 'react';
import Title from '../components/Title';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import './scss/login.scss';
import { loginAuthStore } from '../store/loginStore';
import CrocsClubJoin from '../components/CrocsClubJoin';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { onLogin, onGoogleLogin } = loginAuthStore();

    const navigate = useNavigate();

    // 메서드
    // 1. 기본 로그인
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('전송.');
        await onLogin(email, password);
        navigate('/userinfo');
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
                        <Link to="/nonmember">비회원 주문조회</Link>
                    </p>
                    <CrocsClubJoin />
                </div>
            </div>
        </div>
    );
};

export default Login;
