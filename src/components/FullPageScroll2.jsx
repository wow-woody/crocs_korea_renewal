import React, { useEffect, useState, useRef } from "react";
import "./scss/FullPageScroll.scss";

const FullPageScroll = ({ children, onSectionChange }) => {
  const containerRef = useRef(null);
  const [sections, setSections] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrolling = useRef(false);

  // 모든 요소(section, footer 포함) 수집 후 "묶어서" 섹션으로 정리
  useEffect(() => {
    if (!containerRef.current) return;

    const sec = containerRef.current.querySelectorAll("section, footer");
    setSections(Array.from(sec));

    // 처음들어왔을때 스크롤 초기화
    window.scrollTo(0, 0);
  }, [children]);

  // 스크롤 이동 함수
  const scrollToSection = (index) => {
    if (!sections[index]) return;

    isScrolling.current = true;

    const targetTop = sections[index].offsetTop;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });

    // 스크롤 중복 방지 (300~500ms 사이)
    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  };

  // currentIndex 변경되면 섹션 이동
  useEffect(() => {
    if (sections.length === 0) return;

    scrollToSection(currentIndex);

    // 부모(Main.jsx)에게 현재 섹션 전달
    if (onSectionChange) onSectionChange(currentIndex);
  }, [currentIndex, sections]);

  // Wheel 이벤트
  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling.current) return;

      if (e.deltaY > 0) {
        // 아래로 스크롤
        setCurrentIndex((prev) => Math.min(prev + 1, sections.length - 1));
      } else {
        // 위로 스크롤
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => window.removeEventListener("wheel", handleWheel);
  }, [sections]);

  // Touch 스크롤 (모바일)
  useEffect(() => {
    let startY = 0;

    const start = (e) => (startY = e.touches[0].clientY);

    const end = (e) => {
      if (isScrolling.current) return;

      const diff = startY - e.changedTouches[0].clientY;

      if (Math.abs(diff) < 50) return;

      if (diff > 0) {
        // 아래 방향
        setCurrentIndex((prev) => Math.min(prev + 1, sections.length - 1));
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchend", end, { passive: true });

    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchend", end);
    };
  }, [sections]);

  return (
    <div className="fullpage-container" ref={containerRef}>
      {children}
    </div>
  );
};

export default FullPageScroll;
