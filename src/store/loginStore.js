<<<<<<< HEAD
// import { create } from 'zustand';
// import { auth, db, googleProvider } from '../firebase/firebase';
// import {
//     signInWithEmailAndPassword,
//     signInWithPopup,
//     setPersistence,
//     browserLocalPersistence,
//     signOut,
// } from 'firebase/auth';
// import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// export const loginAuthStore = create((set, get) => ({
//     user: null,

//     // ===========================
//     // 🔥 크록스 클럽 가입 상태 변경
//     // ===========================
//     setClubMember: async (uid, value) => {
//         try {
//             const userRef = doc(db, 'users', uid);
//             await updateDoc(userRef, { isClubMember: value });

//             set({
//                 user: {
//                     ...get().user,
//                     isClubMember: value,
//                 },
//             });
//         } catch (err) {
//             console.error('클럽 가입 정보 업데이트 실패:', err);
//         }
//     },

//     // ===========================
//     // 🔥 이메일 로그인
//     // ===========================
//     onLogin: async (email, password) => {
//         try {
//             await setPersistence(auth, browserLocalPersistence);

//             const userCredential = await signInWithEmailAndPassword(auth, email, password);
//             const firebaseUser = userCredential.user;
//             const userRef = doc(db, 'users', firebaseUser.uid);
//             const userDoc = await getDoc(userRef);

//             let userData;

//             if (userDoc.exists()) {
//                 // 기존 회원 → Firestore 데이터 불러오기
//                 userData = userDoc.data();
//             } else {
//                 // 신규 회원 → Firestore 데이터 생성
//                 userData = {
//                     uid: firebaseUser.uid,
//                     email: firebaseUser.email,
//                     name: firebaseUser.displayName || '',
//                     nickname: '',
//                     phone: '',
//                     file: '',
//                     profile: '',
//                     isClubMember: false,
//                 };
//                 await setDoc(userRef, userData);
//             }

//             set({ user: userData });
//             localStorage.setItem('loginTime', Date.now().toString());
//             alert('로그인 성공!');
//         } catch (err) {
//             console.error('로그인 오류:', err);
//             alert(err.message);
//         }
//     },

//     // ===========================
//     // 🔥 구글 로그인
//     // ===========================
//     onGoogleLogin: async () => {
//         try {
//             await setPersistence(auth, browserLocalPersistence);

//             const result = await signInWithPopup(auth, googleProvider);
//             const firebaseUser = result.user;

//             const userRef = doc(db, 'users', firebaseUser.uid);
//             const userDoc = await getDoc(userRef);

//             let userData;

//             if (userDoc.exists()) {
//                 userData = userDoc.data();
//             } else {
//                 userData = {
//                     uid: firebaseUser.uid,
//                     email: firebaseUser.email,
//                     name: firebaseUser.displayName || '',
//                     nickname: '',
//                     phone: '',
//                     file: '',
//                     profile: '',
//                     isClubMember: false,
//                 };
//                 await setDoc(userRef, userData);
//             }

//             set({ user: userData });
//             localStorage.setItem('loginTime', Date.now().toString());
//             alert('구글 로그인 성공!');
//         } catch (err) {
//             console.error('구글 로그인 오류:', err);
//             alert(err.message);
//         }
//     },

//     // ===========================
//     // 🔥 카카오 로그인
//     // ===========================
//     onKakaoLogin: async (navigate) => {
//         try {
//             if (!window.Kakao.isInitialized()) {
//                 window.Kakao.init('278bf328d5fd32cb74049bf38a44bf2e');
//             }

//             const authObj = await new Promise((resolve, reject) => {
//                 window.Kakao.Auth.login({
//                     scope: 'profile_nickname, profile_image',
//                     success: resolve,
//                     fail: reject,
//                 });
//             });

//             const res = await window.Kakao.API.request({ url: '/v2/user/me' });

//             const uid = res.id.toString();
//             const userRef = doc(db, 'users', uid);
//             const userDoc = await getDoc(userRef);

//             let userData;

//             if (userDoc.exists()) {
//                 userData = userDoc.data();
//             } else {
//                 userData = {
//                     uid,
//                     email: res.kakao_account?.email || '',
//                     name: res.kakao_account.profile?.nickname || '카카오사용자',
//                     nickname: res.kakao_account.profile?.nickname || '카카오사용자',
//                     photoURL: res.kakao_account.profile?.profile_image_url || '',
//                     provider: 'kakao',
//                     createAt: new Date(),
//                     isClubMember: false,
//                 };
//                 await setDoc(userRef, userData);
//             }

//             set({ user: userData });
//             localStorage.setItem('loginTime', Date.now().toString());
//             alert('카카오 로그인 성공!');

//             if (navigate) navigate('/userinfo');
//         } catch (err) {
//             console.error('카카오 로그인 오류:', err);
//             alert(err.message);
//         }
//     },

//     // ===========================
//     // 🔥 로그인 상태에 따라 이동
//     // ===========================
//     handleUserClick: (navigate) => {
//         const { user } = get();
//         if (user) navigate('/userinfo');
//         else navigate('/login');
//     },

//     // ===========================
//     // 🔥 로그아웃
//     // ===========================
//     logout: async () => {
//         try {
//             await signOut(auth);
//             set({ user: null });
//             localStorage.removeItem('loginTime');
//             alert('로그아웃 되었습니다.');
//         } catch (err) {
//             console.error('로그아웃 실패:', err);
//             alert(err.message);
//         }
//     },
// }));

=======
>>>>>>> origin/Chae-A
import { create } from 'zustand';
import { auth, db, googleProvider } from '../firebase/firebase';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const loginAuthStore = create((set, get) => ({
    //로그인, 회원가입
    user: null,
    loginTime: null,
    loading: true, // Firebase가 초기화될 때 잠시 로딩 상태

    // Firebase 로그인 복원 (앱 최초 실행 시)
    initAuthListener: () => {
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Firestore에서 추가 정보 가져오기
                const userRef = doc(db, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userRef);
                const userData = userDoc.exists() ? userDoc.data() : firebaseUser;

                set({
                    user: userData,
                    loginTime: Date.now(), // 복원 시점 저장
                    loading: false,
                });
            } else {
                set({ user: null, loginTime: null, loading: false });
            }
        });
    },

    // 세션 만료 체크 (1시간 = 3600000ms)
    checkSession: () => {
        const { loginTime, onLogout } = get();
        if (loginTime && Date.now() - loginTime > 3600000) {
            alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
            onLogout();
        }
    },

    // ==========================================================
    // 🔥 크록스 클럽 가입 상태 변경
    // ==========================================================
    setClubMember: async (uid, value) => {
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, { isClubMember: value });

            set({
                user: {
                    ...get().user,
                    isClubMember: value,
                },
            });
        } catch (err) {
            console.error('클럽 가입 정보 업데이트 실패:', err);
        }
    },

    // ==========================================================
    // 🔥 이메일 로그인
    // ==========================================================
    onLogin: async (email, password) => {
        try {
            await setPersistence(auth, browserLocalPersistence);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const userRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userRef);

            let userData;

            if (userDoc.exists()) {
                userData = userDoc.data();
            } else {
                userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || '',
                    nickname: '',
                    phone: '',
                    file: '',
                    profile: '',
                    isClubMember: false,
                };
                await setDoc(userRef, userData);
            }

            set({ user: userData });

            // 로그인 시간 저장 (1시간 만료 기준)
            localStorage.setItem('loginTime', Date.now().toString());

            alert('로그인 성공!');
        } catch (err) {
            console.error('로그인 오류:', err);
            alert(err.message);
        }
    },

    // ==========================================================
    // 🔥 구글 로그인
    // ==========================================================
    onGoogleLogin: async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);

            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            const userRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userRef);

            let userData;

            if (userDoc.exists()) {
                userData = userDoc.data();
            } else {
                userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || '',
                    nickname: '',
                    phone: '',
                    file: '',
                    profile: '',
                    isClubMember: false,
                };
                await setDoc(userRef, userData);
            }

            set({ user: userData });
            localStorage.setItem('loginTime', Date.now().toString());

            alert('구글 로그인 성공!');
        } catch (err) {
            console.error('구글 로그인 오류:', err);
            alert(err.message);
        }
    },

    // ==========================================================
    // 🔥 카카오 로그인
    // ==========================================================
    onKakaoLogin: async (navigate) => {
        try {
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init('278bf328d5fd32cb74049bf38a44bf2e');
            }

            await new Promise((resolve, reject) => {
                window.Kakao.Auth.login({
                    scope: 'profile_nickname, profile_image',
                    success: resolve,
                    fail: reject,
                });
            });

            const res = await window.Kakao.API.request({ url: '/v2/user/me' });

            const uid = res.id.toString();
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);

            let userData;

            if (userDoc.exists()) {
                userData = userDoc.data();
            } else {
                userData = {
                    uid,
                    email: res.kakao_account?.email || '',
                    name: res.kakao_account.profile?.nickname || '카카오사용자',
                    nickname: res.kakao_account.profile?.nickname || '카카오사용자',
                    photoURL: res.kakao_account.profile?.profile_image_url || '',
                    provider: 'kakao',
                    createAt: new Date(),
                    isClubMember: false,
                };
                await setDoc(userRef, userData);
            }

            set({ user: userData });
            localStorage.setItem('loginTime', Date.now().toString());

            alert('카카오 로그인 성공!');
            if (navigate) navigate('/userinfo');
        } catch (err) {
            console.error('카카오 로그인 오류:', err);
            alert(err.message);
        }
    },

    // ==========================================================
    // 🔥 로그인 상태에 따라 이동
    // ==========================================================
    handleUserClick: (navigate) => {
        const { user } = get();
        if (user) navigate('/userinfo');
        else navigate('/login');
    },

    // ==========================================================
    // 🔥 로그아웃
    // ==========================================================
    logout: async (navigate) => {
        try {
            await signOut(auth);
            set({ user: null });
            localStorage.removeItem('loginTime');
            alert('로그아웃 되었습니다.');

            if (navigate) navigate('/'); // ⭐ 메인 페이지로 이동
        } catch (err) {
            console.error('로그아웃 실패:', err);
            alert(err.message);
        }
    },
}));
