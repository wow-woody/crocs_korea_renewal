import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MonthlyCardList = () => {
    const navigate = useNavigate();

    const monthlyCards = [
        {
            id: 1,
            mainImg: '/images/magazine_01.png',
            aImg: '/images/magazine_a_01.png',
            item: {
                id: '206750',
                product: '클래식 플랫폼 클로그',
                color: '콰츠',
                price: '79,900',
                dc: '',
                dcPrice: '',
            },
            dec: '월간 크록스 x 아이브 레이',
            itemImg: '/images/item_01.png',
        },
        {
            id: 2,
            mainImg: '/images/magazine_02.png',
            aImg: '/images/magazine_a_02.png',
            item: {
                id: '206302',
                product: '베이클로그',
                color: '화이트',
                price: '99,900',
                dc: '20%',
                dcPrice: '79,900',
            },
            dec: '월간 크록스 x 레드벨벳 슬기',
            itemImg: '/images/item_02.png',
        },
        {
            id: 3,
            mainImg: '/images/magazine_03.png',
            aImg: '/images/magazine_a_03.png',
            item: {
                id: '210521',
                product: '에코 웨이브',
                color: '아몬드 틴트',
                price: '99,900',
                dc: '40%',
                dcPrice: '59,900',
            },
            dec: '월간 크록스 x 샤이니 태민',
            itemImg: '/images/item_03.png',
        },
        {
            id: 4,
            mainImg: '/images/magazine_04.png',
            aImg: '/images/magazine_a_04.png',
            item: {
                id: '206302',
                product: '베이클로그',
                color: '블랙',
                price: '99,900',
                dc: '20%',
                dcPrice: '79,900',
            },
            dec: '월간 크록스 x 르세라핌 채원',
            itemImg: '/images/item_04.png',
        },
    ];

    const handleCardClick = (productId) => {
        console.log('🎯 클릭한 제품 ID:', productId);
        console.log('🎯 ID 타입:', typeof productId);
        navigate(`/product/${productId}`);
    };

    return (
        <ul className="monthly_card_list">
            {monthlyCards.map((card) => {
                const productId = card.item.id; // 이미 객체에 id가 있음

                return (
                    <li key={card.id}>
                        <div className="monthly_card" onClick={() => handleCardClick(productId)}>
                            <div className="card_img">
                                <img className="main_img" src={card.mainImg} alt={card.dec} />
                                <img
                                    className={`a_img a_img_${card.id}`}
                                    src={card.aImg}
                                    alt={card.dec}
                                />

                                <div className="item_card">
                                    <div className={`item_box item_box_${card.id}`}>
                                        <div className="img_box">
                                            <img src={card.itemImg} alt={card.item.product} />
                                        </div>
                                        <div className="text_box">
                                            <p className="title">{card.item.product}</p>
                                            <p className="dc_wrap">
                                                <strong>{card.item.dc}</strong>
                                                <span>{card.item.dcPrice}</span>
                                            </p>
                                            <p className={card.item.dc ? 'price_d' : 'price'}>
                                                {card.item.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default MonthlyCardList;
