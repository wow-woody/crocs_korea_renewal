import React, { useState, useMemo, useRef } from 'react';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';
import './styles/Order.scss';

// JSON
import womenProducts from '../../data/여성-카테고리-완전통합.json';
import menProducts from '../../data/남성-카테고리-완전통합.json';
import kidsProducts from '../../data/키즈-카테고리-완전통합.json';
import newProducts from '../../data/신상품&트렌드-카테고리-완전통합.json';
import jibbitzProducts from '../../data/지비츠_참-카테고리-완전통합.json';
import OrderProgress from './OrderProgress';
import Title from '../Title';

function Order() {
    const [isOrderComplete, setIsOrderComplete] = useState(false);
    const orderFormRef = useRef(null);

    // 초기 상품 데이터 생성 (useMemo로 한 번만 생성)
    const initialProducts = useMemo(() => {
        const result = [];

        // 여성 상품 1개 선택
        const womenItems = womenProducts.products || [];
        const randomWomen = getRandomItems(womenItems, 1);

        randomWomen.forEach((item) => {
            result.push({
                id: result.length + 1,
                name: item.product || '상품명 없음',
                color: parseColor(item.color),
                size: 'W7/W8',
                quantity: 1,
                price: parsePrice(item.price_dc_rate || item.price),
                image: Array.isArray(item.product_img) ? item.product_img[0] : item.product_img,
                category: '여성',
            });
        });

        // 남성 상품 1개 추가
        const menItems = menProducts.products || [];
        const randomMen = getRandomItems(menItems, 1);

        randomMen.forEach((item) => {
            result.push({
                id: result.length + 1,
                name: item.product || '상품명 없음',
                color: parseColor(item.color),
                size: 'M9/M10',
                quantity: 1,
                price: parsePrice(item.price_dc_rate || item.price),
                image: Array.isArray(item.product_img) ? item.product_img[0] : item.product_img,
                category: '남성',
            });
        });

        // 키즈 상품 1개 추가
        const kidsItems = kidsProducts.products || [];
        const randomKids = getRandomItems(kidsItems, 1);

        randomKids.forEach((item) => {
            result.push({
                id: result.length + 1,
                name: item.product || '상품명 없음',
                color: parseColor(item.color),
                size: 'C10/C11',
                quantity: 1,
                price: parsePrice(item.price_dc_rate || item.price),
                image: Array.isArray(item.product_img) ? item.product_img[0] : item.product_img,
                category: '키즈',
            });
        });

        // 지비츠 1개 추가
        const jibbitzItems = jibbitzProducts.products || [];
        const randomJibbitz = getRandomItems(jibbitzItems, 1);

        randomJibbitz.forEach((item) => {
            result.push({
                id: result.length + 1,
                name: item.product || '상품명 없음',
                color: '지비츠',
                size: 'ONE SIZE',
                quantity: 1,
                price: parsePrice(item.price_dc_rate || item.price),
                image: Array.isArray(item.product_img) ? item.product_img[0] : item.product_img,
                category: '지비츠',
            });
        });

        // 신상품 1개 추가
        const newItems = newProducts.products || [];
        const randomNew = getRandomItems(newItems, 1);

        randomNew.forEach((item) => {
            result.push({
                id: result.length + 1,
                name: item.product || '상품명 없음',
                color: parseColor(item.color),
                size: item.size || 'ONE SIZE',
                quantity: 1,
                price: parsePrice(item.price_dc_rate || item.price),
                image: Array.isArray(item.product_img) ? item.product_img[0] : item.product_img,
                category: '신상품',
            });
        });

        return result;
    }, []);

    // 상품 목록을 state로 관리 (동적 변경 가능)
    const [products, setProducts] = useState(initialProducts);

    const shippingInfo = {
        freeShippingThreshold: 30000,
        shippingFee: 2500,
    };

    // 총 상품 금액 계산
    const calculateSubtotal = () => {
        return products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    };

    // 배송비 계산
    const calculateShipping = () => {
        const subtotal = calculateSubtotal();
        return subtotal >= shippingInfo.freeShippingThreshold ? 0 : shippingInfo.shippingFee;
    };

    // 최종 결제 금액
    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping();
    };

    // 상품 삭제
    const handleRemoveProduct = (productId) => {
        setProducts(products.filter((product) => product.id !== productId));
    };

    // 수량 증가
    const handleIncreaseQuantity = (productId) => {
        setProducts(
            products.map((product) =>
                product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
            )
        );
    };

    // 수량 감소
    const handleDecreaseQuantity = (productId) => {
        setProducts(
            products.map((product) =>
                product.id === productId && product.quantity > 1
                    ? { ...product, quantity: product.quantity - 1 }
                    : product
            )
        );
    };

    // 주문 완료
    const handleOrderComplete = () => {
        if (orderFormRef.current && !orderFormRef.current.validateForm()) {
            return;
        }

        setIsOrderComplete(true);
    };

    return (
        <div className="order-container">
            <div className="main-title">
                <Title title="Order" />
            </div>
            {/* <h1 className="order-title">Order</h1> */}
            <OrderProgress />

            <div className="order-content">
                <div className="order-left">
                    <OrderForm ref={orderFormRef} />
                </div>

                <div className="order-right">
                    <OrderSummary
                        products={products}
                        subtotal={calculateSubtotal()}
                        shipping={calculateShipping()}
                        total={calculateTotal()}
                        freeShippingThreshold={shippingInfo.freeShippingThreshold}
                        isOrderComplete={isOrderComplete}
                        onOrderComplete={handleOrderComplete}
                        onRemoveProduct={handleRemoveProduct}
                        onIncreaseQuantity={handleIncreaseQuantity}
                        onDecreaseQuantity={handleDecreaseQuantity}
                    />
                </div>
            </div>
        </div>
    );
}

// 배열에서 랜덤하게 아이템 선택
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
}

// 가격
function parsePrice(priceStr) {
    if (!priceStr) return 0;

    let price = String(priceStr).replace(/₩|,/g, '').trim();
    price = price.replace(/\([^)]*\)/g, '').trim();

    const numbers = price.match(/\d+/);
    return numbers ? parseInt(numbers[0]) : 0;
}

// 색상
function parseColor(colorArray) {
    if (!colorArray || colorArray.length === 0) return '기본색상';

    const firstColor = String(colorArray[0]);

    if (firstColor.toLowerCase().includes('rgb')) {
        if (firstColor.includes('0, 0, 0')) return '블랙';
        if (firstColor.includes('249, 249, 249')) return '화이트';
        if (firstColor.includes('150, 105, 74')) return '브라운';
        return '컬러';
    }

    return firstColor;
}

export default Order;
