import React, { useEffect, useState, useRef } from "react";
import "./scss/FullPageScroll.scss";

const FullPageScroll = ({ children }) => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sections, setSections] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);

  // mount 후 각 section 찾아서 배열로 저장
  useEffect(() => {
    if (containerRef.current) {
      const sec = containerRef.current.querySelectorAll("section, footer");
      setSections(Array.from(sec));
    }
  }, [children]);

  // footer offsetTop 찍기 (디버그용)
  useEffect(() => {
    if (!footerRef) return;
    if (!footerRef.current) return;
    console.log("footer offsetTop:", footerRef.current.offsetTop);
  }, [footerRef]);

  const scrollToSection = (index) => {
    if (!sections[index]) return;
    setIsScrolling(true);

    const maxScroll = document.body.scrollHeight - window.innerHeight;

    window.scrollTo({
      top: Math.min(sections[index].offsetTop, maxScroll),
      behavior: "smooth",
    });

    setTimeout(() => setIsScrolling(false), 300);
  };

  useEffect(() => {
    if (sections.length > 0) {
      scrollToSection(currentIndex);
    }
  }, [currentIndex, sections]);

  // Wheel Event
  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return;

      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentIndex, isScrolling, sections]);

  // Touch Event
  useEffect(() => {
    let startY = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      if (isScrolling) return;
      const diff = startY - e.changedTouches[0].clientY;

      if (Math.abs(diff) < 50) return;

      if (diff > 0 && currentIndex < sections.length - 1)
        setCurrentIndex((prev) => prev + 1);
      else if (diff < 0 && currentIndex > 0)
        setCurrentIndex((prev) => prev - 1);
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, isScrolling, sections]);

  return (
    <div className="fullpage-container" ref={containerRef}>
      {/* {React.Children.map(children, (child, index) => (
        <div className="fullpage-section">{child}</div>
      ))} */}
      {children}
    </div>
  );
};

export default FullPageScroll;
