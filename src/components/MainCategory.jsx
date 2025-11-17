import React from "react";
import "./scss/MainCategory.scss";
// import '../index.css';
import Title from "./Title";
import CategoryList from "./CategoryList";
import PromotionList from "./PromotionList";
import categoryData from "../data/categoryData.json";
import promotionData from "../data/promotionData.json";
import TopPopup from "./TopPopup";

const MainCategory = ({ showTopPopup }) => {
  // 카테고리 클릭 핸들러
  const handleCategoryClick = (e, link) => {
    e.preventDefault();
    console.log("Navigate to:", link);
    // React Router 사용 시: navigate(link);
  };

  // 프로모션 클릭 핸들러
  const handlePromotionClick = (e, link) => {
    e.preventDefault();
    console.log("Navigate to promotion:", link);
    // React Router 사용 시: navigate(link);
  };

  return (
    <section className="category category_wrap">
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 9999,
        }}
      >
        {showTopPopup && (
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
      </div>
      <div className="inner">
        <Title
          title="Shop by Category"
          subTitle="당신의 스타일에 맞는 완벽한 크록스를 찾아보세요"
        />
        <CategoryList
          categories={categoryData}
          onCategoryClick={handleCategoryClick}
        />
        <PromotionList
          promotions={promotionData}
          onPromotionClick={handlePromotionClick}
        />
      </div>
    </section>
  );
};

export default MainCategory;
