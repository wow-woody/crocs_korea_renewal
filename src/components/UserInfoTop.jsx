import React from 'react';
import { Link } from 'react-router-dom';

const UserInfoTop = () => {
    return (
        <div className="user_info_top">
            <div className="user_info_left">
                <p>안녕하세요.(크록스클럽 미가입자)</p>
                <p>크록스로 나만의 스타일을 완성해보세요.</p>
                <Link to="/crocsclub">Crocs Club Join</Link>
            </div>
            <div className="user_info_left">
                <p>안녕하세요.(크록스클럽 가입자)</p>
                <p>크록스로 나만의 스타일을 완성해보세요.</p>
                <div className="club_join">
                    <strong>Crocs Club</strong>
                    <p>혜택 안내</p>
                </div>
            </div>
            <div className="usr_info_right">
                <strong>쿠폰</strong>
                <p>쿠폰 개수</p>
            </div>
        </div>
    );
};

export default UserInfoTop;
