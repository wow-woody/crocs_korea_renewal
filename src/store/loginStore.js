import { create } from 'zustand';
import { Navigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

console.log(db); // undefined 아니면 정상
export const loginAuthStore = create((set, get) => ({
    // 기본 로그인
    onLogin: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            set({ user: userCredential.user });
            alert('로그인 성공');
        } catch (err) {
            alert(err.message);
            console.error(err.code, err.message);
        }
    },

    // 구글 로그인
    onGoogleLogin: async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                const userInfo = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    nickname: '',
                    phone: '',
                    file: '',
                    profile: '',
                };

                await setDoc(userRef, userInfo);
                set({ user: userInfo });
            }
            //  있으면 정보 불러오기
            else {
                set({ user: userDoc.data() });
            }
        } catch (err) {
            alert(err.message);
        }
    },

    //카카오 로그인
    onKakaoLogin: async (navigate) => {
        try {
            // 1 카카오 SDK 초기화
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init('278bf328d5fd32cb74049bf38a44bf2e');
                console.log('kakao SDK 초기화 완료');
            }

            // 2 로그인 요청 (Promise 반환)
            const authObj = await new Promise((resolve, reject) => {
                window.Kakao.Auth.login({
                    scope: 'profile_nickname, profile_image',
                    success: resolve,
                    fail: reject,
                });
            });
            console.log('카카오 로그인 성공:', authObj);

            // 3 사용자 정보 요청 (Promise 기반)
            const res = await window.Kakao.API.request({
                url: '/v2/user/me',
            });
            console.log('카카오 사용자 정보:', res);

            //4 사용자 정보 가공
            const uid = res.id.toString();
            const kakaoUser = {
                uid,
                email: res.kakao_account?.email || '',
                name: res.kakao_account.profile?.nickname || '카카오사용자',
                nickname: res.kakao_account.profile?.nickname || '카카오사용자',
                photoURL: res.kakao_account.profile?.profile_image_url || '',
                provider: 'kakao',
                createAt: new Date(),
            };

            // 5 Firestore에 저장
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, kakaoUser);
                console.log('신규 카카오 회원 Firestore에 등록 완료');
            } else {
                console.log('기존 카카오 회원 Firestore 데이터 있음');
            }

            // 6 Zustand 상태 업데이트
            set({ user: kakaoUser });

            alert(`${kakaoUser.nickname}님, 카카오 로그인 성공!`);
            if (navigate) Navigate('/dashboard');
        } catch (err) {
            console.error('카카오 로그인 중 오류:', err);
            alert('카카오 로그인 실패:' + err.message);
        }
    },
}));
