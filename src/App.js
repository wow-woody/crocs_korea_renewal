import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
// import New from './pages/New';
// import Women from './pages/Women';
// import Men from './pages/Men';
// import Kids from './pages/Kids';
import Collabs from './pages/Collabs';
import Brand from './pages/Brand';
import Login from './pages/Login';
import Join from './pages/Join';
// import Footer from './components/Footer';
import Header from './components/Header';
import CrocsClubPopup from './components/CrocsClubPopup';
import UserInfo from './pages/UserInfo';
import Nonmember from './pages/Nonmember';
import ComeAsPopup from './components/ComeAsPopup';
import { useEffect } from 'react';
import { loginAuthStore } from './store/loginStore';
import JibbitzCollaboProductDetail from './pages/JibbitzCollaboProductDetail';
// import Order from './components/Order/Order';
import WishList from './pages/WishList';
import OrderHistory from './pages/OrderHistory';
import Cart from './pages/Cart';
import JibbitzProductDetail from './pages/JibbitzProductDetail';
import JibbitzProductListPage from './pages/JibbitzProductListPage';
import ProductListPage from './pages/ProductListPage';
// import CustomerService from './components/CustomerService';

import CrocsProductDetail from './pages/CrocsProductDetail';
import Promotion from './pages/Promotion';
import StoreLocator from './components/StoreLocator';

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
                <Route path="/jibbitz" element={<JibbitzProductListPage />} />
                <Route path="/collabs" element={<Collabs />} />
                <Route path="/promotion" element={<Promotion />} />
                {/* <Route path="/store" element={<Store />} /> */}
                <Route path="/Brand" element={<Brand />} />
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/:cate/:subcategory?" element={<ProductListPage />} />
                <Route path="/crocsclub" element={<CrocsClubPopup />} />
                <Route path="/userinfo" element={<UserInfo />} />
                <Route path="/nonmember" element={<Nonmember />} />
                <Route path="/comaspopup" element={<ComeAsPopup />} />
                <Route path="/product/:id" element={<JibbitzCollaboProductDetail />} />
                <Route path="/wishlist" element={<WishList />} />
                <Route path="/orderhistory" element={<OrderHistory />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/jibbitz/:cate/:id" element={<JibbitzProductListPage />} />
                <Route path="/jibbitz/:id" element={<JibbitzProductDetail />} />
                <Route path="/wishlist" element={<WishList />} />
                <Route path="/orderhistory" element={<OrderHistory />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/:cate/:subcategory?" element={<ProductListPage />} />
                {/* <Route path="/cscenter" element={<CustomerService />} /> */}
                <Route path="/product/:id" element={<CrocsProductDetail />} />
                <Route path="/store" element={<StoreLocator />} />
            </Routes>
            {/* <Footer /> */}
        </div>
    );
}

export default App;
