import { createUserWithEmailAndPassword } from 'firebase/auth';
import { create } from 'zustand';
import { auth, db, googleProvider } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const joinStore = create((set, get) => ({
    onJoin: async ({ name, phnoe, email, password, birthday, gender }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            set({ user: userCredential.user });
            console.log(email, password);
            alert('회원가입 성공');
        } catch (err) {
            alert(err.message);
        }
    },
}));
