import "./App.scss";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { loginAuthStore } from "./store/loginStore";
import Header from "./components/Header";
import Main from "./pages/Main";
import ComeAsPopup from "./components/ComeAsPopup";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Brand from "./pages/Brand";
import Store from "./pages/Store";
import OrderHistory from "./pages/OrderHistory";
import CrocsClubPopup from "./components/CrocsClubPopup";
import UserInfo from "./pages/UserInfo";
import Nonmember from "./pages/Nonmember";
import ProductListPage from "./pages/ProductListPage";
import CrocsProductDetail from "./pages/CrocsProductDetail";
import JibbitzProductDetail from "./pages/JibbitzProductDetail";
import JibbitzProductListPage from "./pages/JibbitzProductListPage";
import WishList from "./pages/WishList";
import Cart from "./pages/Cart";
import RecentProducts from "./pages/RecentProducts";
import CartSidebar from "./components/CartSidebar";
import RecentSidebar from "./components/RecentSidebar";
import Order from "./components/Order/Order";

function App() {
    const { user, loading, checkSession, initAuthListener } = loginAuthStore();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isRecentOpen, setIsRecentOpen] = useState(false);
    const location = useLocation();

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
        <div className='App'>
            <Header
                onCartClick={() => setIsCartOpen(true)}
                onRecentClick={() => setIsRecentOpen(true)}
            />
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <RecentSidebar isOpen={isRecentOpen} onClose={() => setIsRecentOpen(false)} />
            <Routes>
                {/* 메인 */}
                <Route index element={<Main />} />

                {/* 매장 */}
                <Route path='/store' element={<Store />} />

                {/* 브랜드 페이지 */}
                <Route path='/Brand' element={<Brand />} />

                {/* 로그인/회원가입 */}
                <Route path='/login' element={<Login />} />
                <Route path='/join' element={<Join />} />

                {/* 지비츠 리스트 + 상세 */}
                <Route path='/jibbitz/detail/:id' element={<JibbitzProductDetail />} />
                <Route path='/jibbitz/:filter' element={<JibbitzProductListPage />} />
                <Route path='/jibbitz' element={<JibbitzProductListPage />} />

                {/* 상품 페이지 */}
                <Route path='/:cate/:subcategory?' element={<ProductListPage />} />

                {/* 나머지 */}
                <Route path='/crocsclub' element={<CrocsClubPopup />} />
                <Route path='/userinfo' element={<UserInfo />} />
                <Route path='/nonmember' element={<Nonmember />} />
                <Route path='/comaspopup' element={<ComeAsPopup />} />
                <Route path='/product/:id' element={<CrocsProductDetail />} />
                <Route path='/recent' element={<RecentProducts />} />
                <Route path='/wishlist' element={<WishList />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/order' element={<Order />} />
                <Route path='/orderhistory' element={<OrderHistory />} />
            </Routes>
            {/* <Footer /> */}
        </div>
    );
}

export default App;
