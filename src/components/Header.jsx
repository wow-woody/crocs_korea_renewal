import React from "react";
import { Link } from "react-router-dom";
import MainmenuList from "./MainmenuList";
import "./scss/header.scss";
import GnbWrap from "./GnbWrap";
import Depth1 from "./Depth1";
import Search from "./Search";
import { useSearchStore } from "../store/useSearchStore";

const Header = ({ onCartClick }) => {
    // const [searchOpen, setSearchOpen] = useState(false);
    const searchOpen = useSearchStore((state) => state.searchOpen);
    const onOpenSearch = useSearchStore((state) => state.onOpenSearch);
    const onCloseSearch = useSearchStore((state) => state.onCloseSearch);

    return (
        <>
            <header className={`header ${searchOpen ? "hide" : ""}`}>
                <div className='wide_inner'>
                    <div className='header_left'>
                        <h1 className='logo'>
                            <Link to='/'>
                                <img src='./images/crocs_logo.svg' alt='crocs logo' />
                            </Link>
                        </h1>
                        <nav>
                            <MainmenuList />
                            <Depth1 />
                        </nav>
                    </div>
                    <div className='header_right'>
                        <GnbWrap onSearchClick={onOpenSearch}/>
                    </div>
                    {/* 장바구니 최근본상품 슬라이드 버튼 */}
                    <div className='header_slide_buttons'>
                        <button className="cart-button" onClick={onCartClick}>
                            <img src='./images/cart-slide-icon.svg' alt='' />
                        </button>
                        <button className="recently-button">
                            <img src='./images/recently-slide-icon.svg' alt='' />
                        </button>
                    </div>
                </div>
            </header>

            {searchOpen && <Search onClose={onCloseSearch} />}
        </>
    );
};

export default Header;
