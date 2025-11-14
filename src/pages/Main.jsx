import React, { useRef } from "react";
import JibbitzCollaboSwiper from "../components/JibbitzCollaboSwiper";
// import Join from './Join';
// import { Link } from 'react-router-dom';
import MainSlider from "../components/MainSlider";
import TopPopup from "../components/TopPopup";
import Monthly from "../components/Monthly";
import MainCategory from "../components/MainCategory";
import MainInstagram from "../components/MainInstagram";
import SlideCircle from "../components/SlideCircle";
import CrocsSection from "../components/CrocsSectionFinal";
import FullPageScroll from "../components/FullPageScroll";
import Footer from "../components/Footer";

const Main = () => {
  return (
    <main>
      <FullPageScroll onSectionChange={setCurrentIndex}>
        <section>
          <MainSlider />
        </section>
        <div className="container">
          {/* 두 번째 섹션 */}
          <section style={{ position: "relative" }}>
            {/* currentIndex가 1일 때만 TopPopup 렌더 */}
            {currentIndex === 1 && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  zIndex: 9999,
                }}
              >
                <TopPopup />
              </div>
            )}
            <MainCategory />
          </section>
          <section>
            <SlideCircle />
          </section>
          <section>
            <JibbitzCollaboSwiper />
          </section>
          <section>
            <CrocsSection />
          </section>
          <Monthly />
          <MainInstagram />
        </div>
        <Footer />
      </FullPageScroll>
    </main>
  );
};

export default Main;
