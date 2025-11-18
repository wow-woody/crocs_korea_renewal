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
    const sec = Array.from(containerRef.current.children).filter(
      (el) =>
        el.tagName.toLowerCase() === "section" ||
        el.tagName.toLowerCase() === "footer"
    );
    setSections(sec);
    // 처음들어왔을때 스크롤 초기화
    window.scrollTo(0, 0);
  }, [children]);

  // 스크롤 이동 함수
  const scrollToSection = (index) => {
    if (!sections[index]) return;
    isScrolling.current = true;
    sections[index].scrollIntoView({ behavior: "smooth" });
    // 스크롤 중복 방지 (300~500ms 사이)
    setTimeout(() => {
      isScrolling.current = false;
    }, 300);
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
      e.preventDefault();
      if (isScrolling.current) return;
      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        // 아래로 스크롤
        setCurrentIndex((prev) => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // 위로 스크롤
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentIndex, sections]);

  // Touch 스크롤 (모바일)
  useEffect(() => {
    let startY = 0;
    const handleTouchStart = (e) => (startY = e.touches[0].clientY);
    const handleTouchEnd = (e) => {
      if (isScrolling.current) return;
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50) return;
      if (diff > 0 && currentIndex < sections.length - 1) {
        // 아래 방향
        setCurrentIndex((prev) => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, sections]);

  return (
    <div className="fullpage-container" ref={containerRef}>
      {children}
    </div>
  );
};

export default FullPageScroll;
