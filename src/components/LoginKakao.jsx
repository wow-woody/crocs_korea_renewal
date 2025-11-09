import React, { useState } from 'react';
import { loginAuthStore } from '../store/loginStore';
import { useNavigate } from 'react-router-dom';

const LoginKakao = () => {
    //변수
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //store 전역변수
    const { onKakaoLogin } = loginAuthStore();
    const navigate = useNavigate();

    //메서드
    const handleKakaoLogin = async () => {
        console.log('카카오');
        await onKakaoLogin();
        navigate('/');
    };
    return (
        <div className="kakao_wrap">
            <button className="kakao" onClick={handleKakaoLogin}>
                <img src="/images/icon_kakao.svg" alt="icon_kakao" />
            </button>
        </div>
    );
};

export default LoginKakao;
