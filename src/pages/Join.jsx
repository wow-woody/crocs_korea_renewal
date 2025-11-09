import React from 'react';
import { Link } from 'react-router-dom';
import Title from '../components/Title';
import LoginSns from '../components/LoginSns';
import JoinForm from '../components/JoinForm';
import './scss/join.scss';

const Join = () => {
    return (
        <div className="sub_page">
            <div className="content_inner">
                <Link to="/">home</Link>
                <Title title="Join" />
                <LoginSns />
                <JoinForm />
            </div>
        </div>
    );
};

export default Join;
