import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Brand from './pages/Brand';
import Login from './pages/Login';
import Join from './pages/Join';
import OrderHistory from './pages/OrderHistory';
import Header from './components/Header';
import CrocsClubPopup from './components/CrocsClubPopup';
import UserInfo from './pages/UserInfo';
import Nonmember from './pages/Nonmember';
import ComeAsPopup from './components/ComeAsPopup';
import { useEffect } from 'react';
import { loginAuthStore } from './store/loginStore';
import ProductListPage from './pages/ProductListPage';
import CrocsProductDetail from './pages/CrocsProductDetail';
import Store from './pages/Store';
import WishList from './pages/WishList';
import JibbitzProductDetail from './pages/JibbitzProductDetail';
import JibbitzProductListPage from './pages/JibbitzProductListPage';
import Cart from './pages/Cart';
import Order from './components/Order/Order';

function App() {
    const { user, loading, checkSession, initAuthListener } = loginAuthStore();

    // Firebase 세션 복원
    useEffect(() => {
        initAuthListener();
    }, [initAuthListener]);

    // 1분마다 세션 만료 체크
    useEffect(() => {
        const timer = setInterval(() => {
            checkSession();
        }, 60000);
        return () => clearInterval(timer);
    }, [checkSession]);

    if (loading) return <h3>로딩 중...</h3>;

    return (
        <div className="App">
            <Header />
            <Routes>
                <Route index element={<Main />} />
                <Route path="/store" element={<Store />} />
                <Route path="/Brand" element={<Brand />} />
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/:cate/:subcategory?" element={<ProductListPage />} />
                <Route path="/crocsclub" element={<CrocsClubPopup />} />
                <Route path="/userinfo" element={<UserInfo />} />
                <Route path="/nonmember" element={<Nonmember />} />
                <Route path="/comaspopup" element={<ComeAsPopup />} />
                <Route path="/product/:id" element={<CrocsProductDetail />} />
                <Route path="/orderhistory" element={<OrderHistory />} />
                <Route path="/wishlist" element={<WishList />} />
                <Route path="/jibbitz" element={<JibbitzProductListPage />} />
                <Route path="/jibbitz/:id" element={<JibbitzProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<Order />} />
            </Routes>
            {/* <Footer /> */}
        </div>
    );
}

export default App;
