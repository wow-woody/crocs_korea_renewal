import React from 'react';
import { collaboAuthStore } from '../store/collaboAuthStore';

const WishList = () => {
    const { onAddWishList } = collaboAuthStore();
    //위시 팝업창
    const [showwish, setShowWish] = useState(false);

    //위시 메서드

    const handleAddToWish = () => {
        if (!product) return;

        const result = onAddWishList(product);

        // result가 true = 새로 추가된 경우만 팝업 띄움
        if (result) {
            setShowWish(true);
        }
    };
    return (
        <div>
            <div>
                위시리스트 목록 테스트여용
                <button onClick={handleAddToWish}>찜하기 테스트용💚</button>
            </div>
        </div>
    );
};

export default WishList;
