import React, { useRef, useState } from "react";
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
import FullPageScroll from "../components/FullPageScroll2";
import Footer from "../components/Footer";

const Main = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <main>
      <FullPageScroll onSectionChange={setCurrentIndex}>
        <section>
          <MainSlider />
        </section>
        <section style={{ position: "relative" }}>
          <MainCategory showTopPopup={currentIndex === 1} />
        </section>
        <section>
          <SlideCircle showDot={currentIndex === 2} />
        </section>
        <section>
          <JibbitzCollaboSwiper />
        </section>
        <section>
          <CrocsSection />
        </section>
        <Monthly />
        <Footer />
      </FullPageScroll>
    </main>
  );
};

export default Main;
