import { create } from 'zustand';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useAuthStore = create((set, get) => ({
    user: null,

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
}));
