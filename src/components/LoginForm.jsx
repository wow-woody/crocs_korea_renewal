import React from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ onLoginSubmit, email, password, setEmail, setPassword, onGoogleLogin }) => {
    return (
        <form className="login_form" onSubmit={onLoginSubmit}>
            <input
                type="email"
                value={email}
                placeholder="ID"
                required
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                value={password}
                placeholder="PW"
                required
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="checkbox_wrap">
                <div className="checkbox_left">
                    <label className="save_id">
                        <input type="checkbox" />
                        아이디 저장
                    </label>
                </div>
                <div className="checkbox_right">
                    <span>
                        <Link>아이디 찾기</Link>
                    </span>
                    <span> | </span>
                    <span>
                        <Link>비밀번호 찾기</Link>
                    </span>
                </div>
            </div>
            <button className="login_btn" type="submit">
                Login
            </button>
<<<<<<< HEAD
            <button className="join_btn" type="button">
                Join
            </button>
=======
            {/* <button className="join_btn" type="button">
                Join
            </button> */}
            <Link to="/join" className="join_link" type="button">
                Join
            </Link>
>>>>>>> 7e8c2c77746530933c16fbb40c876986979575d2

            <div className="sns_login_wrap">
                <button className="sns_login kakao">
                    <img src="./images/kakao_icon.svg" alt="kakao_login" />
                </button>
                <button className="sns_login google" onClick={onGoogleLogin}>
                    <img src="./images/google_icon.svg" alt="google_login" />
                </button>

                <button className="sns_login naver">
                    <img src="./images/naver_icon.svg" alt="naver_login" />
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
