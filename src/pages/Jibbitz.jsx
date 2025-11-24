import React from "react";
import Title from "../components/Title";
import JibbitzProductListPage from "../components/JibbitzProductListPage";
import "./scss/productListpage.scss";
import { useRecentProductsStore } from "../store/recentProductsStore";

const Jibbitz = () => {
  const { addProduct } = useRecentProductsStore();

  const handleProductClick = (product) => {
    addProduct(product);
  };
  return (
    <div className='sub_page'>
      <div className='inner'>
        <Title title='jibbitz' />
        <JibbitzProductListPage onProductClick={handleProductClick} />
      </div>
    </div>
  );
};

export default Jibbitz;
