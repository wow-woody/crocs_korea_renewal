import { createUserWithEmailAndPassword } from 'firebase/auth';
import { create } from 'zustand';
import { auth, db, googleProvider } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const joinStore = create((set, get) => ({
    onJoin: async ({ name, nickname, email, password, phone, file, profile }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            set({ user: userCredential.user });
            alert('회원가입 성공');
        } catch (err) {
            alert(err.message);
        }
    },
}));
