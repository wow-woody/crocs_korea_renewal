import React, { useEffect, useState } from 'react';
import JibbitzCollaboSwiper from '../components/JibbitzCollaboSwiper';
import MainSlider from '../components/MainSlider';
import TopPopup from '../components/TopPopup';
import Monthly from '../components/Monthly';
import MainCategory from '../components/MainCategory';
import MainInstagram from '../components/MainInstagram';
import SlideCircle from '../components/SlideCircle';
import CrocsSection from '../components/CrocsSectionFinal';
import FullPageScroll from '../components/FullPageScroll';
import Footer from '../components/Footer';
import ComeAsPopupBtn from '../components/ComeAsPopupBtn';
import ComeAsPopup from '../components/ComeAsPopup';
import CustomerService from '../components/CustomerService';

const Main = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(true); // 페이지 진입 시 모달 노출
    const [isBtnVisible, setIsBtnVisible] = useState(false); // 모달 닫으면 버튼 표시
    const [isCSOpen, setIsCSOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState('main-slider');

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setIsBtnVisible(true);
    };

    // ⭐ CS 센터 모달 열기
    const openCS = () => {
        setIsCSOpen(true);
        document.body.classList.add('no-scroll');
    };

    // ⭐ CS 센터 모달 닫기
    const closeCS = () => {
        setIsCSOpen(false);
        document.body.classList.remove('no-scroll');
    };

    // ✅ 팝업 열려 있을 때만 body 스크롤 제거
    useEffect(() => {
        if (isPopupOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isPopupOpen]);

    // ✅ FullPageScroll에서 섹션이 바뀔 때 id만 받아서 상태로 저장
    const handleSectionChange = (index, element) => {
        const sectionId = element?.getAttribute('data-section-id');
        if (sectionId) {
            setCurrentSection(sectionId);
        }
    };

    // ✅ 메인 배너(main-slider)를 지나갔을 때만 버튼 보이게
    const showBtn = isBtnVisible && currentSection !== 'main-slider';

    useEffect(() => {
        // 메인 페이지 진입 시 body 스크롤 제거
        document.body.style.overflow = 'hidden';

        return () => {
            // 페이지 떠날 때 body 스크롤 복원
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <main>
            <div className="fullpage-wrapper">
                <FullPageScroll onSectionChange={handleSectionChange}>
                    <section data-section-id="main-slider">
                        <MainSlider />
                        <TopPopup />
                    </section>
                    <section data-section-id="main-category">
                        <MainCategory />
                    </section>
                    <section data-section-id="slide-circle" className="showDot">
                        <SlideCircle showDot={currentSection === 'slide-circle'} />
                    </section>
                    <section data-section-id="jibbitz">
                        <JibbitzCollaboSwiper />
                    </section>
                    <section data-section-id="crocs">
                        <CrocsSection />
                    </section>
                    <section data-section-id="monthly">
                        <Monthly />
                    </section>
                    <section data-section-id="instagram">
                        <MainInstagram />
                    </section>
                    {/* ⭐ Footer를 마지막 섹션으로 포함해야 FullPageScroll에서 보임 */}
                    <section data-section-id="footer">
                        <Footer onOpenCS={openCS} />
                    </section>
                </FullPageScroll>
            </div>
            {/* 팝업창 */}
            {isPopupOpen && <ComeAsPopup onClose={handleClosePopup} />}

            {/* 🔘 다시 열기 버튼 */}
            {showBtn && <ComeAsPopupBtn onOpen={() => setIsPopupOpen(true)} />}

            {/* 📌 CS 모달 */}
            {isCSOpen && (
                <div className="cs-modal-bg" onClick={closeCS}>
                    <div className="cs-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="cs-close-btn" onClick={closeCS}>
                            ×
                        </button>
                        <CustomerService />
                    </div>
                </div>
            )}
        </main>
    );
};

export default Main;
