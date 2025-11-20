import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import New from './pages/New';
import Women from './pages/Women';
import Men from './pages/Men';
import Kids from './pages/Kids';
import Jibbitz from './pages/Jibbitz';
import Collabs from './pages/Collabs';
import Brand from './pages/Brand';
import Promotion from './pages/Promotion';
import Login from './pages/Login';
import Join from './pages/Join';
// import Cart from './pages/Cart3';
// import Footer from './components/Footer';
import Header from './components/Header';
import CrocsClubPopup from './components/CrocsClubPopup';
import UserInfo from './pages/UserInfo';
import Nonmember from './pages/Nonmember';
import ComeAsPopup from './components/ComeAsPopup';

import { useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { loginAuthStore } from './store/loginStore';
import JibbitzCollaboProductDetail from './pages/JibbitzCollaboProductDetail';
import WishList from './pages/WishList';
import OrderHistory from './pages/OrderHistory';
import Cart from './pages/Cart';
// import Order from './components/Order/Order';

function App() {
    useEffect(() => {
        const restoreUser = async () => {
            onAuthStateChanged(auth, async (firebaseUser) => {
                const loginTime = localStorage.getItem('loginTime');
                const now = Date.now();

                // 1시간 초과 시 자동 로그아웃
                if (loginTime && now - parseInt(loginTime) > 3600000) {
                    await signOut(auth);
                    loginAuthStore.getState().logout();
                    return;
                }

                // 로그인 상태 복원
                if (firebaseUser) {
                    const userRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        loginAuthStore.getState().user = userDoc.data();
                    }
                }
            });
        };
        restoreUser();
    }, []);

    return (
        <div className="App">
            <Header />
            <Routes>
                <Route index element={<Main />} />
                <Route path="/new" element={<New />} />
                <Route path="/women" element={<Women />} />
                <Route path="/men" element={<Men />} />
                <Route path="/kids" element={<Kids />} />
                <Route path="/jibbitz" element={<Jibbitz />} />
                <Route path="/collabs" element={<Collabs />} />
                <Route path="/promotion" element={<Promotion />} />
                <Route path="/Brand" element={<Brand />} />
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                {/* <Route path="/order" element={<Order />} /> */}
                <Route path="/crocsclub" element={<CrocsClubPopup />} />
                <Route path="/userinfo" element={<UserInfo />} />
                <Route path="/nonmember" element={<Nonmember />} />
                <Route path="/comaspopup" element={<ComeAsPopup />} />
                <Route path="/product/:id" element={<JibbitzCollaboProductDetail />} />
                <Route path="/jibbitz/:id" element={<JibbitzCollaboProductDetail />} />
                <Route path="/wishlist" element={<WishList />} />
                <Route path="/orderhistory" element={<OrderHistory />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </div>
    );
}

export default App;
