import "./App.css";
import { Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import New from "./pages/New";
import Women from "./pages/Women";
import Men from "./pages/Men";
import Kids from "./pages/Kids";
import Jibbitz from "./pages/Jibbitz";
import Collabs from "./pages/Collabs";
import Brand from "./pages/Brand";
import Promotion from "./pages/Promotion";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Cart from "./pages/Cart";
// import Footer from './components/Footer';
import Header from "./components/Header";
import CrocsClubPopup from "./components/CrocsClubPopup";
import UserInfo from "./UserInfo";
import Order from "./pages/Order";
import JibbitzCollaboProductDetail from "./pages/JibbitzCollaboProductDetail";
import WishList from "./pages/WishList";
import { useState } from "react";
import CartSidebar from "./components/CartSidebar";

function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    return (
        <div className='App'>
            <Header onCartClick={() => setIsCartOpen(true)} />
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <Routes>
                <Route index element={<Main />} />
                <Route path='/new' element={<New />} />
                <Route path='/women' element={<Women />} />
                <Route path='/men' element={<Men />} />
                <Route path='/kids' element={<Kids />} />
                <Route path='/jibbitz' element={<Jibbitz />} />
                <Route path='/collabs' element={<Collabs />} />
                <Route path='/promotion' element={<Promotion />} />
                <Route path='/Brand' element={<Brand />} />
                <Route path='/login' element={<Login />} />
                <Route path='/join' element={<Join />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/order' element={<Order />} />
                <Route path='/crocsclub' element={<CrocsClubPopup />} />
                <Route path='/userinfo' element={<UserInfo />} />
                <Route path='/product/:id' element={<JibbitzCollaboProductDetail />} />
                <Route path='/jibbitz/:id' element={<JibbitzCollaboProductDetail />} />
                <Route path='/wishlist' element={<WishList />} />
            </Routes>
        </div>
    );
}

export default App;
