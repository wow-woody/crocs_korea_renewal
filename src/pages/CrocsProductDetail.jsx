import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import { wishListStore } from '../store/wishListStore';
import Title from '../components/Title';
import WishAddPopup from '../components/WishAddPopup';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';

const CrocsProductDetail = () => {
    const { id } = useParams();
    const { crocsItems, onFetchItems } = useCrocsProductStore();
    const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();
    const { onAddWishList } = wishListStore();

    const [CrocsProduct, setCrocsProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        onFetchItems();
        onFetchSize();
    }, []);

    useEffect(() => {
        if (!id || crocsItems.length === 0) return;

        const findCrocsItem = crocsItems.find((item) => String(item.id) === String(id));
        setCrocsProduct(findCrocsItem);
    }, [id, crocsItems]);

    if (!CrocsProduct) {
        return <div>상품 정보를 불러오고 있으니 기다려주세요.</div>;
    }

    const normalizeCate = (cate) => {
        if (!cate) return 'women'; // 기본값

        const c = cate.split(',')[0].trim().toLowerCase();

        if (c.includes('men') || c.includes('남성') || c.includes('man')) return 'men';
        if (c.includes('women') || c.includes('여성') || c.includes('woman')) return 'women';
        if (c.includes('kid') || c.includes('아동') || c.includes('주니어')) return 'kids';

        return 'women'; // fallback
    };

    // 카테고리 기반 사이즈 찾기
    const mainCate = normalizeCate(CrocsProduct.cate);

    console.log('정규화된 mainCate:', mainCate);
    console.log('sizes store:', crocsSizesByCategory);

    const categorySizes = crocsSizesByCategory[mainCate] || [];

    // ⭐ 이미지 타입 관계없이 배열로 통일
    const images = Array.isArray(CrocsProduct.product_img)
        ? CrocsProduct.product_img
        : String(CrocsProduct.product_img)
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean);

    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="ProductDetail" />
                <div className="product-detail-wrap">
                    <div className="img_box">
                        <img src={images[0]} alt={CrocsProduct.product} />
                    </div>
                    <div className="detail-info">
                        {/* 🔥 제품명 */}
                        <h2 className="detail-title">{CrocsProduct.product}</h2>

                        {/* 🔥 가격 */}
                        <p className="detail-price">₩{CrocsProduct.prices?.[0] || '가격 없음'}</p>

                        {/* 🔥 사이즈 선택 */}
                        <div className="detail-sizes">
                            <h3>사이즈</h3>
                            <div className="size-buttons">
                                {categorySizes.map((size) => (
                                    <button
                                        key={size}
                                        className={selectedSize === size ? 'active' : ''}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => onAddWishList(CrocsProduct)}>위시버튼💚</button>
                        <WishAddPopup />
                    </div>{' '}
                    {/* detail-info 닫는 태그 */}
                </div>
            </div>
        </div>
    );
};
export default CrocsProductDetail;
