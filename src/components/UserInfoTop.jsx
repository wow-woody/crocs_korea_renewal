// import React from 'react';
// import { Link } from 'react-router-dom';
// import { loginAuthStore } from '../../store/loginStore';

// const UserInfoTop = () => {
//     const { user, setClubMember } = loginAuthStore(); // 로그인된 사용자 데이터

//     const isClubMember = user?.isClubMember === true;

//     const handleJoin = () => {
//         setClubMember(user.uid, true); // 클럽 가입 처리
//     };

//     return (
//         <div className="user_info_top">
//             <div className="user_info_left">
//                 <p>안녕하세요.(크록스클럽 미가입자)</p>
//                 <p>크록스로 나만의 스타일을 완성해보세요.</p>

//                 {/* 가입하러가기 */}
//                 <Link to="/crocsclub">Crocs Club Join</Link>
//             </div>
//             <div className="user_info_left club_join">
//                 <p>안녕하세요.(크록스클럽 가입자)</p>
//                 <p>크록스로 나만의 스타일을 완성해보세요.</p>
//                 <div className="club_join">
//                     <strong>Crocs Club</strong>
//                     <p>혜택 안내</p>
//                 </div>
//             </div>
//             <div className="usr_info_right">
//                 <strong>쿠폰</strong>
//                 <p>쿠폰 개수</p>
//             </div>
//         </div>
//     );
// };

// export default UserInfoTop;

import React from 'react';
import { Link } from 'react-router-dom';
import { loginAuthStore } from '../store/loginStore';

// const UserInfoTop = () => {
//     const { user, setClubMember } = loginAuthStore();

//     const isClubMember = user?.isClubMember === true;

//     // 가입하기 버튼 눌렀을 때 (필요할 경우 사용)
//     const handleJoin = () => {
//         if (user) {
//             setClubMember(user.uid, true);
//         }
//     };

//     return (
//         <div className="user_info_top">
//             {/* 🔥 크록스 클럽 미가입자 영역 */}
//             {!isClubMember && (
//                 <div className="user_info_left">
//                     <p>안녕하세요.(크록스클럽 미가입자)</p>
//                     <p>크록스로 나만의 스타일을 완성해보세요.</p>

//                     <Link to="/crocsclub">Crocs Club Join</Link>
//                     {/* <button onClick={handleJoin}>가입하기(테스트용)</button> */}
//                 </div>
//             )}

//             {/* 🔥 크록스 클럽 가입자 영역 */}
//             {isClubMember && (
//                 <div className="user_info_left club_join">
//                     <p>안녕하세요.(크록스클럽 가입자)</p>
//                     <p>크록스로 나만의 스타일을 완성해보세요.</p>

//                     <div className="club_join">
//                         <strong>Crocs Club</strong>
//                         <p>혜택 안내</p>
//                     </div>
//                 </div>
//             )}

//             {/* 오른쪽 고정 영역 */}
//             <div className="usr_info_right">
//                 <strong>쿠폰</strong>
//                 <p>쿠폰 개수</p>
//             </div>
//         </div>
//     );
// };

const UserInfoTop = () => {
    const { user, setClubMember } = loginAuthStore();

    if (!user) return null; // ⭐ 중요! user 준비가 안 되면 렌더링 X

    const isClubMember = user.isClubMember === true;

    const handleJoin = () => {
        setClubMember(user.uid, true);
    };

    return (
        <div className="user_info_top">
            {!isClubMember && (
                <div className="user_info_left_wrap">
                    <p className="user_info_text">
                        안녕하세요. <strong>{user.name || user.nickname || user.email}</strong>님
                    </p>
                    <p>크록스로 나만의 스타일을 완성해보세요.</p>

                    <button className="club_join_btn" onClick={handleJoin}>
                        Crocs Club Join
                    </button>
                </div>
            )}

            {isClubMember && (
                <div className="user_info_left_wrap club_join_wrap">
                    <p>
                        안녕하세요. <strong>{user.name || user.nickname || user.email}</strong>님
                    </p>
                    <p>크록스로 나만의 스타일을 완성해보세요.</p>

                    <div className="club_join">
                        <strong>Crocs Club</strong>
                        <p>혜택 안내</p>
                    </div>
                </div>
            )}

            <div className="usr_info_right">
                <strong>쿠폰</strong>
                <p>쿠폰 개수</p>
            </div>
        </div>
    );
};

export default UserInfoTop;
