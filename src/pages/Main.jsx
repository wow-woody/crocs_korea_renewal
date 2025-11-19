import React, { useEffect, useState } from "react";
import JibbitzCollaboSwiper from "../components/JibbitzCollaboSwiper";
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
  const [currentSection, setCurrentSection] = useState(0);

  // Main컴포넌트 안에서만 스크롤 제거
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const handleSectionChange = (index, element) => {
    // data-section-id로 섹션 구분
    const sectionId = element?.getAttribute("data-section-id");
    setCurrentSection(sectionId);
  };

  return (
    <main>
      <FullPageScroll onSectionChange={handleSectionChange}>
        <section data-section-id='main-slider'>
          <MainSlider />
        </section>
        <section data-section-id='main-category'>
          <MainCategory />
        </section>
        <section data-section-id='slide-circle' className='showDot'>
          <SlideCircle showDot={currentSection === "slide-circle"} />
        </section>
        <section data-section-id='jibbitz'>
          <JibbitzCollaboSwiper />
        </section>
        <section data-section-id='crocs'>
          <CrocsSection />
        </section>
        <section data-section-id='monthly'>
          <Monthly />
        </section>
        <section data-section-id='instagram'>
          <MainInstagram />
        </section>
        <Footer />
      </FullPageScroll>
    </main>
  );
};

export default Main;
