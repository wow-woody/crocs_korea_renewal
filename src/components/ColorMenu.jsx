<<<<<<< HEAD
// import React from 'react';
// import './scss/WomenComponents.scss';

// export default function ColorMenu() {
//     const colors = [
//         { name: '블랙', class: 'black' },
//         { name: '그레이', class: 'gray' },
//         { name: '화이트', class: 'white' },
//         { name: '빨강', class: 'red' },
//         { name: '핑크', class: 'pink' },
//         { name: '브라운', class: 'brown' },
//         { name: '주황', class: 'orange' },
//         { name: '보라', class: 'purple' },
//         { name: '노랑', class: 'yellow' },
//         { name: '민트', class: 'mint' },
//         { name: '연두', class: 'light-green' },
//         { name: '녹색', class: 'green' },
//         { name: '하늘', class: 'sky-blue' },
//         { name: '파랑', class: 'blue' },
//         { name: '네이비', class: 'navy' },
//     ];

//     return (
//         <div className="color-menu">
//             <div className="color-menu__wrap menu_wrap-style">
//                 <div className="color-menu__wrap--title_wrap title--wrap">
//                     <h3 className="color-menu__wrap--title title">색상</h3>
//                     <a href="#" className="color-menu--title__toggle title--toggle">
//                         <button>
//                             <img
//                                 src="/images/Sub_Women_Images/icon-minus.svg"
//                                 alt="줄이기/더보기 버튼"
//                             />
//                         </button>
//                     </a>
//                 </div>
//                 <ul className="select__color--wrap">
//                     {colors.map((color) => (
//                         <li key={color.class} className="select__color--wrap_list">
//                             <a href="#" className="select__color--link">
//                                 <p className={`color_select ${color.class}`}></p>
//                                 <p className="color_select-text">{color.name}</p>
//                             </a>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }

import React, { useState } from 'react';
import './scss/WomenComponents.scss';
import { useColorFilterStore } from '../store/useColorFilterStore';
import { Link } from 'react-router-dom';

export default function ColorMenu() {
    const [isOpen, setIsOpen] = useState(true);
    const { selectedColors, toggleColor } = useColorFilterStore();

    // 컬러 데이터 (이름, CSS 클래스, RGB 값)
    const colors = [
        { name: '블랙', class: 'black', value: 'rgb(0, 0, 0)' },
        {
            name: '그레이',
            class: 'gray',
            value: [
                'rgb(221, 223, 222)',
                'rgb(220,220,220)',
                'rgba(221,223,222,1)',
                'rgb(76, 76, 76)',
                'rgb(66, 65, 71)',
            ],
        },
        { name: '화이트', class: 'white', value: 'rgb(255, 255, 255)' },
        {
            name: '빨강',
            class: 'red',
            value: ['rgb(220, 43, 43)', 'rgb(160, 21, 51)', 'rgb(225, 68, 41)'],
        },
        {
            name: '핑크',
            class: 'pink',
            value: [
                'rgba(250, 213, 220)',
                'rgb(248, 238, 237)',
                'rgb(207, 96, 161)',
                'rgb(220, 163, 188)',
            ],
        },
        { name: '브라운', class: 'brown', value: 'rgba(92, 53, 27, 1)' },
        { name: '주황', class: 'orange', value: ['rgb(255, 140, 0)', 'rgb(219, 166, 138)'] },
        { name: '보라', class: 'purple', value: 'rgba(78, 52, 212, 1)' },
        {
            name: '노랑',
            class: 'yellow',
            value: ['rgba(255, 255, 91, 1)', 'rgb(230, 229, 198)', 'rgb(210, 195, 82)'],
        },
        { name: '민트', class: 'mint', value: 'rgb(215, 251, 225)' },
        { name: '연두', class: 'light-green', value: 'rgba(142, 240, 50)' },
        {
            name: '녹색',
            class: 'green',
            value: [
                'rgb(34, 139, 34)',
                'rgb(116, 121, 78)',
                'rgb(143, 222, 165)',
                'rgb(171, 196, 147)',
            ],
        },
        { name: '하늘', class: 'sky-blue', value: ['rgb(210, 244, 255)', 'rgb(164, 191, 200)'] },
        { name: '파랑', class: 'blue', value: 'rgb(0, 8, 255)' },
        { name: '네이비', class: 'navy', value: 'rgb(23, 29, 96)' },
    ];

    const handleToggle = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const handleColorClick = (e, color) => {
        e.preventDefault();
        toggleColor(color);
    };

    const isColorSelected = (colorValue) => {
        return selectedColors.some((c) => c.value === colorValue);
    };

    return (
        <div className="filtering_wrap color_menu_wrap">
            <div className="filtering_menu color_menu">
                <div className="filtering_menu_top color_menu_top">
                    <h3 className="menu_title">색상</h3>
                    <button className="filtering_menu_toggle" onClick={handleToggle}>
                        <img
                            src={
                                isOpen
                                    ? '/images/Sub_Women_Images/icon-minus.svg'
                                    : '/images/Sub_Women_Images/icon-plus.svg'
                            }
                            alt={isOpen ? '줄이기 버튼' : '더보기 버튼'}
                        />
                    </button>
                </div>

                {isOpen && (
                    <ul className="select_color_wrap">
                        {colors.map((color) => {
                            const selected = isColorSelected(color.value);

                            return (
                                <li
                                    key={color.class}
                                    className={`color_list ${selected ? 'selected' : ''}`}
                                >
                                    <button
                                        className="select_color_btn"
                                        onClick={(e) => handleColorClick(e, color)}
                                    >
                                        {/* 🎨 여기가 핵심! 실제 색상 표시 */}
                                        <span
                                            className={`select_color ${color.class}`}
                                            style={{ backgroundColor: color.value }}
                                        ></span>
                                        <span className="select_color_text">{color.name}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

// import React, { useState } from 'react';
// import './scss/WomenComponents.scss';
// import { useCrocsProductStore } from '../store/useCrocsProductStore';

// export default function ColorMenu() {
//     const [isOpen, setIsOpen] = useState(true);

//     // ⭐ Crocs Store에서 colorFilter 상태 사용
//     const colorFilter = useCrocsProductStore((s) => s.colorFilter);
//     const setColorFilter = useCrocsProductStore((s) => s.setColorFilter);

//     const colors = [
//         { name: '블랙', class: 'black', value: 'rgb(0, 0, 0)' },
//         { name: '그레이', class: 'gray', value: 'rgb(128, 128, 128)' },
//         { name: '화이트', class: 'white', value: 'rgb(255, 255, 255)' },
//         { name: '빨강', class: 'red', value: 'rgb(220, 43, 43)' },
//         { name: '핑크', class: 'pink', value: 'rgb(255, 166, 237)' },
//         { name: '브라운', class: 'brown', value: 'rgb(92, 53, 27)' },
//         { name: '주황', class: 'orange', value: 'rgb(255, 140, 0)' },
//         { name: '보라', class: 'purple', value: 'rgb(78, 52, 212)' },
//         { name: '노랑', class: 'yellow', value: 'rgb(255, 255, 91)' },
//         { name: '민트', class: 'mint', value: 'rgb(215, 251, 225)' },
//         { name: '연두', class: 'light-green', value: 'rgb(142, 240, 50)' },
//         { name: '녹색', class: 'green', value: 'rgb(34, 139, 34)' },
//         { name: '하늘', class: 'sky-blue', value: 'rgb(210, 244, 255)' },
//         { name: '파랑', class: 'blue', value: 'rgb(0, 8, 255)' },
//         { name: '네이비', class: 'navy', value: 'rgb(23, 29, 96)' },
//     ];

//     const isSelected = (value) => colorFilter === value;

//     return (
//         <div className="filtering_wrap color_menu_wrap">
//             <div className="filtering_menu color_menu">
//                 <div className="filtering_menu_top color_menu_top">
//                     <h3 className="menu_title">색상</h3>
//                     <button className="filtering_menu_toggle" onClick={() => setIsOpen(!isOpen)}>
//                         <img
//                             src={
//                                 isOpen
//                                     ? '/images/Sub_Women_Images/icon-minus.svg'
//                                     : '/images/Sub_Women_Images/icon-plus.svg'
//                             }
//                             alt="toggle"
//                         />
//                     </button>
//                 </div>

//                 {isOpen && (
//                     <ul className="select_color_wrap">
//                         {colors.map((color) => (
//                             <li
//                                 key={color.class}
//                                 className={`color_list ${
//                                     isSelected(color.value) ? 'selected' : ''
//                                 }`}
//                             >
//                                 <button
//                                     className="select_color_btn"
//                                     onClick={() => setColorFilter(color.value)}
//                                 >
//                                     <span
//                                         className="select_color"
//                                         style={{ backgroundColor: color.value }}
//                                     ></span>
//                                     <span className="select_color_text">{color.name}</span>
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// }
=======
import React from 'react';

const ColorMenu = () => {
    const colors = [
        { name: '블랙', class: 'black' },
        { name: '그레이', class: 'gray' },
        { name: '화이트', class: 'white' },
        { name: '빨강', class: 'red' },
        { name: '핑크', class: 'pink' },
        { name: '브라운', class: 'brown' },
        { name: '주황', class: 'orange' },
        { name: '보라', class: 'purple' },
        { name: '노랑', class: 'yellow' },
        { name: '민트', class: 'mint' },
        { name: '연두', class: 'light-green' },
        { name: '녹색', class: 'green' },
        { name: '하늘', class: 'sky-blue' },
        { name: '파랑', class: 'blue' },
        { name: '네이비', class: 'navy' }
    ];

    return (
        <div className="color-menu">
            <div className="color-menu__wrap menu_wrap-style">
                <div className="color-menu__wrap--title_wrap title--wrap">
                    <h3 className="color-menu__wrap--title title">색상</h3>
                    <a href="#" className="color-menu--title__toggle title--toggle">
                        <button>
                            <img src="/images/Sub_Women_Images/icon-minus.svg" alt="줄이기/더보기 버튼" />
                        </button>
                    </a>
                </div>
                <ul className="select__color--wrap">
                    {colors.map((color) => (
                        <li key={color.class} className="select__color--wrap_list">
                            <a href="#" className="select__color--link">
                                <p className={`color_select ${color.class}`}></p>
                                <p className="color_select-text">{color.name}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ColorMenu;
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
