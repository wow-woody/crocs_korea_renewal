import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useNewProductStore } from '../store/useNewProductStore';
import { collaboAuthStore } from '../store/authStore';

const ProductDetail = () => {
    const { ID } = useParams();
    const { jibbitzItems, onAddWishList } = collaboAuthStore();

    //찾은 상품을 저장할 변수
    const [product, setProduct] = useState();

    //위시 팝업창
    const [showwish, setShowWish] = useState(false);

    useEffect(() => {
        if (!ID || jibbitzItems.length === 0) return;
        //뿌려질 제품 찾기
        const findItem = jibbitzItems.find((item) => String(item.id) === ID);
        setProduct(findItem);
    }, [ID, jibbitzItems]);

    if (!product) {
        return <div>상품 정보를 불러오고 있으니 기다리라 ㅡㅡ </div>;
    }

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
            <div className="product-detail-wrap">상품 예시입니당 💚</div>
            <button onClick={handleAddToWish}>찜하기 테스트용💚</button>
        </div>
    );
};

export default ProductDetail;
