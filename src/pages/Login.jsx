import React from 'react';
import Title from '../components/Title';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="login" />
                <p>
                    <Link>비회원 주문조회</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
