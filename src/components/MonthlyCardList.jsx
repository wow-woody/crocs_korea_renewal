import React from 'react';
import { Link } from 'react-router-dom';

const MonthlyCardList = () => {
    const monthlyCards = [
        {
            id: 1,
            mainImg: './images/magazine_01.png',
            aImg: './images/magazine_a_01.png',
            item: '클래식 플랫폼 클로그',
            color: '콰츠',
            price: '79,900',
            dc: '',
            dcPrice: '',
            dec: '월간 크록스 x 아이브 레이',
            itemImg: './images/item_01.png',
        },
        {
            id: 2,
            mainImg: './images/magazine_02.png',
            aImg: './images/magazine_a_02.png',
            item: '베이클로그',
            color: '화이트',
            price: '99,900',
            dc: '20%',
            dcPrice: '79,900',
            dec: '월간 크록스 x 레드벨벳 슬기',
            itemImg: './images/item_01.png',
        },
        {
            id: 3,
            mainImg: './images/magazine_03.png',
            aImg: './images/magazine_a_03.png',
            item: '에코 웨이브',
            color: '아몬드 틴트',
            price: '99,900',
            dc: '40%',
            dcPrice: '59,900',
            dec: '월간 크록스 x 샤이니 태민',
            itemImg: './images/item_01.png',
        },
        {
            id: 4,
            mainImg: './images/magazine_04.png',
            aImg: './images/magazine_a_04.png',
            item: '베이클로그',
            color: '블랙',
            price: '99,900',
            dc: '20%',
            dcPrice: '79,900',
            dec: '월간 크록스 x 르세라핌 채원',
            itemImg: './images/item_01.png',
        },
    ];
    return (
        <ul className="monthly_card_list">
            {monthlyCards.map((card) => (
                <li key={card.id}>
                    <Link className="monthly_card">
                        <div className="card_img">
                            <img className="main_img" src={card.mainImg} alt={card.dec} />
                            <img
                                className={`a_img a_img_${card.id}`}
                                src={card.aImg}
                                alt={card.dec}
                            />
                            <Link className="item_card">
                                <div className={`item_box item_box_${card.id}`}>
                                    <div className="img_box">
                                        <img src={card.itemImg} alt={card.item} />
                                    </div>
                                    <div className="text_box">
                                        <p className="title">{card.item}</p>
                                        <p className="dc_wrap">
                                            <strong>{card.dc}</strong>
                                            <span>{card.dcPrice}</span>
                                        </p>
                                        {/* <p className="price">{card.price}</p> */}
                                        <p className={card.dc ? 'price_d' : 'price'}>
                                            {card.price}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default MonthlyCardList;
