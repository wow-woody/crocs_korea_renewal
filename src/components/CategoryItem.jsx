import React from 'react';

const CategoryItem = ({ category, onClick }) => {
  return (
    <li className={`category__list-item ${category.backgroundColor}`}>
      <a
        href="#"
        className="category__link"
        onClick={(e) => onClick(e, category.link)}
        aria-label={`${category.name} 카테고리 보기`}
      >
        <img
          src={category.image}
          alt={category.alt}
          className="category__image"
        />
        <p className="category__label">{category.name}</p>
      </a>
    </li>
  );
};

export default CategoryItem;
