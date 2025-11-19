<<<<<<< HEAD
// import React, { useState } from 'react';
// import './scss/WomenComponents.scss';

// export default function SizeMenu({
//     sizes = ['210', '220', '230', '240', '250', '260', '265', '270', '280', '290', '300', '310'],
//     onSizeChange, // ⬅ 부모로 사이즈 전달하는 콜백 추가
// }) {
//     const [activeSize, setActiveSize] = useState(null);

//     const handleClick = (size, e) => {
//         e.preventDefault();

//         // 같은 버튼 클릭하면 선택 해제
//         const newSize = activeSize === size ? null : size;

//         setActiveSize(newSize);

//         // 선택된 사이즈 부모로 전달
//         onSizeChange?.(newSize);
//     };

//     return (
//         <div className="size-menu">
//             <div className="size-menu__wrap">
//                 <div className="size-menu__wrap--title_wrap title--wrap">
//                     <h3 className="size-menu__wrap--title title">사이즈</h3>
//                     <a href="#" className="size-menu--title__toggle title--toggle">
//                         <button>
//                             <img
//                                 src="/images/Sub_Women_Images/icon-minus.svg"
//                                 alt="줄이기/더보기 버튼"
//                             />
//                         </button>
//                     </a>
//                 </div>

//                 <ul className="size-menu__wrap size-menu__wrap--size">
//                     {sizes.map((size) => (
//                         <li key={size} className="size-menu__item">
//                             <a
//                                 href="#"
//                                 className={`size-menu__link btn-menu-style ${
//                                     activeSize === size ? 'active' : ''
//                                 }`}
//                                 onClick={(e) => handleClick(size, e)}
//                             >
//                                 <button className="size-menu__button btn-menu__button">
//                                     {size}
//                                 </button>
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

export default function SizeMenu({ sizes = [], selectedSize, onSizeSelect }) {
    const [activeSize, setActiveSize] = useState(selectedSize || null);

    const handleClick = (size, e) => {
        e.preventDefault();
        const newSize = activeSize === size ? null : size;
        setActiveSize(newSize);
        onSizeSelect?.(newSize); // 상위로 선택 사이즈 전달
    };

=======
import React from 'react';
import './scss/WomenComponents.scss';

<<<<<<< HEAD:src/components/SizeMenu.jsx
const SizeMenu = ({ sizes = ['210', '220', '230', '240', '250', '260', '265', '270', '280', '290', '300', '310'] }) => {
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
=======
export default function WomenSizeMenu({ sizes = ['210', '220', '230', '240', '250', '260', '265', '270', '280', '290', '300', '310'] }) {
>>>>>>> 680e991 (2025-11-17(월) 스와이퍼 적용 완료 - v02):src/components/WomenSizeMenu.jsx
    return (
        <div className="size-menu">
            <div className="size-menu__wrap">
                <div className="size-menu__wrap--title_wrap title--wrap">
                    <h3 className="size-menu__wrap--title title">사이즈</h3>
<<<<<<< HEAD
                    <button className="size-menu--title__toggle title--toggle">
                        <img
                            src="/images/Sub_Women_Images/icon-minus.svg"
                            alt="줄이기/더보기 버튼"
                        />
                    </button>
=======
                    <a href="#" className="size-menu--title__toggle title--toggle">
                        <button>
                            <img src="/images/Sub_Women_Images/icon-minus.svg" alt="줄이기/더보기 버튼" />
                        </button>
                    </a>
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
                </div>
                <ul className="size-menu__wrap size-menu__wrap--size">
                    {sizes.map((size) => (
                        <li key={size} className="size-menu__item">
<<<<<<< HEAD
                            <a
                                href="#"
                                className={`size-menu__link btn-menu-style ${
                                    activeSize === size ? 'active' : ''
                                }`}
                                onClick={(e) => handleClick(size, e)}
                            >
                                <button className="size-menu__button btn-menu__button">
                                    {size}
                                </button>
=======
                            <a href="#" className="size-menu__link btn-menu-style">
                                <button className="size-menu__button btn-menu__button">{size}</button>
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
<<<<<<< HEAD:src/components/SizeMenu.jsx
<<<<<<< HEAD
}
=======
};

export default SizeMenu;
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
=======
}
>>>>>>> 680e991 (2025-11-17(월) 스와이퍼 적용 완료 - v02):src/components/WomenSizeMenu.jsx
