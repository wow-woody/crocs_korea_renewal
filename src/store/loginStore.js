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

                // 🎟️ 기존 크록스 클럽 회원이지만 쿠폰이 없는 경우 자동 발급
                if (userData.isClubMember && (!userData.coupons || userData.coupons.length === 0)) {
                    console.log('🎁 기존 클럽 회원에게 웰컴 쿠폰 자동 발급');

                    const welcomeCoupon = {
                        id: `WELCOME_${Date.now()}`,
                        name: '크록스 클럽 가입 축하 15% 할인 쿠폰',
                        discount: 15,
                        type: 'percentage',
                        code: `CLUB15_${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
                        issuedAt: new Date(),
                        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        isUsed: false,
                    };

                    try {
                        await updateDoc(userRef, {
                            coupons: [welcomeCoupon],
                        });

                        userData = {
                            ...userData,
                            coupons: [welcomeCoupon],
                        };

                        console.log('✅ 기존 회원 쿠폰 발급 완료');
                    } catch (err) {
                        console.error('기존 회원 쿠폰 발급 실패:', err);
                    }
                }

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
    // 🔥 크록스 클럽 가입 상태 변경 + 쿠폰 발급
    // ==========================================================
    setClubMember: async (uid, value) => {
        try {
            const userRef = doc(db, 'users', uid);

            // 가입 시 15% 할인 쿠폰 발급
            const welcomeCoupon = {
                id: `WELCOME_${Date.now()}`,
                name: '크록스 클럽 가입 축하 15% 할인 쿠폰',
                discount: 15,
                type: 'percentage',
                code: `CLUB15_${uid.slice(0, 6).toUpperCase()}`,
                issuedAt: new Date(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후 만료
                isUsed: false,
            };

            // 기존 유저 데이터 가져오기
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
            const existingCoupons = userData?.coupons || [];

            await updateDoc(userRef, {
                isClubMember: value,
                coupons: [...existingCoupons, welcomeCoupon], // 쿠폰 추가
            });

            set({
                user: {
                    ...get().user,
                    isClubMember: value,
                    coupons: [...existingCoupons, welcomeCoupon],
                },
            });

            console.log('✅ 쿠폰 발급 완료:', welcomeCoupon);
        } catch (err) {
            console.error('클럽 가입 정보 업데이트 실패:', err);
            throw err; // 에러를 다시 throw해서 CrocsClubPopup에서 처리
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

                // 🎟️ 기존 크록스 클럽 회원이지만 쿠폰이 없는 경우 자동 발급
                if (userData.isClubMember && (!userData.coupons || userData.coupons.length === 0)) {
                    console.log('🎁 기존 클럽 회원에게 웰컴 쿠폰 자동 발급');

                    const welcomeCoupon = {
                        id: `WELCOME_${Date.now()}`,
                        name: '크록스 클럽 가입 축하 15% 할인 쿠폰',
                        discount: 15,
                        type: 'percentage',
                        code: `CLUB15_${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
                        issuedAt: new Date(),
                        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        isUsed: false,
                    };

                    try {
                        await updateDoc(userRef, {
                            coupons: [welcomeCoupon],
                        });

                        userData = {
                            ...userData,
                            coupons: [welcomeCoupon],
                        };

                        console.log('✅ 기존 회원 쿠폰 발급 완료');
                    } catch (err) {
                        console.error('기존 회원 쿠폰 발급 실패:', err);
                    }
                }
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
                    coupons: [], // 쿠폰 배열 초기화
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

            // 🎟️ 기존 크록스 클럽 회원이지만 쿠폰이 없는 경우 자동 발급
            if (userData.isClubMember && (!userData.coupons || userData.coupons.length === 0)) {
                console.log('🎁 기존 클럽 회원에게 웰컴 쿠폰 자동 발급');

                const welcomeCoupon = {
                    id: `WELCOME_${Date.now()}`,
                    name: '크록스 클럽 가입 축하 15% 할인 쿠폰',
                    discount: 15,
                    type: 'percentage',
                    code: `CLUB15_${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
                    issuedAt: new Date(),
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    isUsed: false,
                };

                try {
                    await updateDoc(userRef, {
                        coupons: [welcomeCoupon],
                    });

                    userData = {
                        ...userData,
                        coupons: [welcomeCoupon],
                    };

                    console.log('✅ 기존 회원 쿠폰 발급 완료');
                } catch (err) {
                    console.error('기존 회원 쿠폰 발급 실패:', err);
                }
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
                    coupons: [], // 쿠폰 배열 초기화
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
                // 🎟️ 기존 크록스 클럽 회원이지만 쿠폰이 없는 경우 자동 발급
                if (userData.isClubMember && (!userData.coupons || userData.coupons.length === 0)) {
                    console.log('🎁 기존 클럽 회원에게 웰컴 쿠폰 자동 발급');

                    const welcomeCoupon = {
                        id: `WELCOME_${Date.now()}`,
                        name: '크록스 클럽 가입 축하 15% 할인 쿠폰',
                        discount: 15,
                        type: 'percentage',
                        code: `CLUB15_${uid.slice(0, 6).toUpperCase()}`,
                        issuedAt: new Date(),
                        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        isUsed: false,
                    };

                    try {
                        await updateDoc(userRef, {
                            coupons: [welcomeCoupon],
                        });

                        userData = {
                            ...userData,
                            coupons: [welcomeCoupon],
                        };

                        console.log('✅ 기존 회원 쿠폰 발급 완료');
                    } catch (err) {
                        console.error('기존 회원 쿠폰 발급 실패:', err);
                    }
                }
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
                    coupons: [], // 쿠폰 배열 초기화
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
