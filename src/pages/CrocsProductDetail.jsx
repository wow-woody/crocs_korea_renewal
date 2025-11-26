import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCrocsProductStore } from "../store/useCrocsProductStore";
import { wishListStore } from "../store/wishListStore";
import Title from "../components/Title";
import WishAddPopup from "../components/WishAddPopup";
import { useCrocsSizeStore } from "../store/useCrocsSizeStore";
import { useCartStore } from "../store/useCartStore";

const CrocsProductDetail = () => {
  const { id } = useParams();
  const { crocsItems, onFetchItems } = useCrocsProductStore();
  const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();
  const { onAddWishList, onProductAddCart } = wishListStore();

  const [CrocsProduct, setCrocsProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("brown"); // 기본 색상
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // 가격 파싱 유틸 (문자열 내 숫자만 추출)
  const parsePriceNumber = useCallback((p) => {
    if (!p) return 0;
    const num = String(p).replace(/[^0-9]/g, "");
    return Number(num || 0);
  }, []);

  // CrocsProduct가 아직 로드되지 않았을 때 null 접근 방지
  // const salePriceNumber = parsePriceNumber(CrocsProduct?.prices?.[0]);
  // const originalPriceNumber = parsePriceNumber(CrocsProduct?.prices?.[1]);
  // const hasOriginal = originalPriceNumber > 0 && originalPriceNumber > salePriceNumber;
  // const discountPercent = hasOriginal
  //     ? Math.round(((originalPriceNumber - salePriceNumber) / originalPriceNumber) * 100)
  //     : null;
  // ⭐ 장바구니 규칙과 동일한 가격 계산 함수
  const getDetailPrice = (product) => {
    if (!product) return 0; // ⭐ null 방어

    if (product.price) {
      return Number(String(product.price).replace(/,/g, ""));
    }

    if (product.prices && product.prices.length > 0) {
      const sale = product.prices[1] || product.prices[0] || "0";
      return Number(String(sale).replace(/,/g, ""));
    }

    return 0;
  };

  // ⭐ 원가 계산 (prices[0])
  const getOriginalPrice = (product) => {
    if (!product || !product.prices) return null; // ⭐ null 방어

    const origin = product.prices[0];
    if (!origin) return null;

    return Number(String(origin).replace(/,/g, ""));
  };

  // ⭐ 할인율 계산
  const detailPrice = CrocsProduct ? getDetailPrice(CrocsProduct) : 0;
  const originalPrice = CrocsProduct ? getOriginalPrice(CrocsProduct) : null;

  const hasOriginal = originalPrice !== null && originalPrice > detailPrice;

  const discountPercent = hasOriginal
    ? Math.round(((originalPrice - detailPrice) / originalPrice) * 100)
    : null;

  const totalPrice = detailPrice * quantity;

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleColorSelect = (c) => setSelectedColor(c);

  // 토글 섹션 상태 (지비츠 / 설명 / 유의사항 / 리뷰)
  const [openJibbitz, setOpenJibbitz] = useState(false);
  const [openDesc, setOpenDesc] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const [openReview, setOpenReview] = useState(false);

  // 더미 지비츠 데이터 (실제 연동 전 시각적 구조용)
  const jibbitzItems = [
    {
      id: 1,
      name: "지비츠 참 A",
      price: "₩4,900",
      img: "/images/ProductPage/imgi_53_crocs.avif",
    },
    {
      id: 2,
      name: "지비츠 참 B",
      price: "₩5,900",
      img: "/images/ProductPage/imgi_54_crocs.avif",
    },
    {
      id: 3,
      name: "지비츠 참 C",
      price: "₩6,900",
      img: "/images/ProductPage/imgi_55_crocs.avif",
    },
  ];

  const colorOptions = [
    { key: "black", label: "블랙" },
    { key: "brown", label: "브라운" },
    { key: "pink", label: "핑크" },
    { key: "green", label: "그린" },
    { key: "blue", label: "블루" },
  ];

  useEffect(() => {
    onFetchItems();
    onFetchSize();
  }, []);

  useEffect(() => {
    if (!id || crocsItems.length === 0) return;

    const findCrocsItem = crocsItems.find(
      (item) => String(item.id) === String(id)
    );
    setCrocsProduct(findCrocsItem);
  }, [id, crocsItems]);

  if (!CrocsProduct) {
    return <div>상품 정보를 불러오고 있으니 기다려주세요.</div>;
  }

  const normalizeCate = (cate) => {
    if (!cate) return "women"; // 기본값

    const c = cate.split(",")[0].trim().toLowerCase();

    if (c.includes("men") || c.includes("남성") || c.includes("man"))
      return "men";
    if (c.includes("women") || c.includes("여성") || c.includes("woman"))
      return "women";
    if (c.includes("kid") || c.includes("아동") || c.includes("주니어"))
      return "kids";

    return "women"; // fallback
  };

  // 카테고리 기반 사이즈 찾기
  const mainCate = normalizeCate(CrocsProduct.cate);

  console.log("정규화된 mainCate:", mainCate);
  console.log("sizes store:", crocsSizesByCategory);

  const categorySizes = crocsSizesByCategory[mainCate] || [];

  // ⭐ 이미지 타입 관계없이 배열로 통일
  //   const images = Array.isArray(CrocsProduct.product_img)
  //     ? CrocsProduct.product_img
  //     : String(CrocsProduct.product_img)
  //         .split(",")
  //         .map((v) => v.trim())
  //         .filter(Boolean);
  let images = [];

  if (Array.isArray(CrocsProduct.product_img)) {
    // 배열인 경우: 각 요소가 쉼표 포함 가능 → 모두 split 처리
    images = CrocsProduct.product_img
      .flatMap((item) => String(item).split(","))
      .map((v) => v.trim())
      .filter(Boolean);
  } else {
    // 문자열인 경우
    images = String(CrocsProduct.product_img)
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return (
    <div className='sub_page'>
      <div className='inner'>
        <Title title='ProductDetail' />
        <div className='product-detail-wrap'>
          {/* 이미지 + 썸네일 + 크럼브 영역 */}
          <div className='product-img'>
            <div className='product-img__crumbs-wrap'>
              <ul className='product-img__crumbs'>
                <li className='product-img__crumb product-img__crumb--home'>
                  <a href='/' className='product-img__link' aria-label='홈'>
                    <img
                      className='product-img__icon'
                      src='/images/Sub_Women_Images/icon-close_cross.svg'
                      alt='홈'
                    />
                  </a>
                </li>
                <li className='product-img__sep'>
                  <span>:</span>
                </li>
                <li className='product-img__crumb product-img__crumb--category'>
                  <button
                    type='button'
                    className='product-img__link'
                    aria-label='카테고리'
                  >
                    <span className='product-img__text'>{mainCate}</span>
                  </button>
                </li>
                <li className='product-img__sep'>
                  <span>:</span>
                </li>
                <li className='product-img__crumb product-img__crumb--current'>
                  <button
                    type='button'
                    className='product-img__link'
                    aria-current='page'
                    aria-label='현재 상품'
                  >
                    <span className='product-img__text'>
                      {CrocsProduct.product}
                    </span>
                    <img
                      className='product-img__icon'
                      src='/images/Sub_Women_Images/icon-close_cross.svg'
                      alt='닫기'
                    />
                  </button>
                </li>
              </ul>
            </div>
            <div className='product-img__main-wrap'>
              <ul className='product-img__list product-img__list--main'>
                <li className='product-img__item'>
                  <img
                    className='product-img__img'
                    src={images[selectedImageIdx]}
                    alt={CrocsProduct.product}
                  />
                </li>
              </ul>
            </div>
            <div className='product-img__thumbs-wrap'>
              {/* 상단 컨트롤 (비활성화 상태 유지) */}
              <div
                className='thumbs__ctrl thumbs__ctrl--top'
                aria-hidden='true'
              >
                <button
                  type='button'
                  className='thumbs__btn thumbs__btn--up'
                  tabIndex={-1}
                >
                  <img
                    className='thumbs__icon'
                    src='/images/icon-arrow-up-hairline.svg'
                    alt=''
                  />
                </button>
                <button
                  type='button'
                  className='thumbs__btn thumbs__btn--active'
                  tabIndex={-1}
                >
                  <img
                    className='thumbs__icon'
                    src='/images/icon-arrow-up-green.svg'
                    alt=''
                  />
                </button>
              </div>
              <ul className='product-img__thumbs-list'>
                {images.map((img, idx) => (
                  <li key={idx} className='product-img__thumbs-item'>
                    <button
                      type='button'
                      className='product-img__thumbs-link'
                      aria-label={`이미지 ${idx + 1} 보기`}
                      onClick={() => setSelectedImageIdx(idx)}
                    >
                      <img
                        className='product-img__thumbs-img'
                        src={img}
                        alt={`${CrocsProduct.product} 썸네일 ${idx + 1}`}
                        style={
                          selectedImageIdx === idx
                            ? {
                                filter: "brightness(1.05)",
                                transform: "scale(1.05)",
                              }
                            : undefined
                        }
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <div
                className='thumbs__ctrl thumbs__ctrl--bottom'
                aria-hidden='true'
              >
                <button
                  type='button'
                  className='thumbs__btn thumbs__btn--down'
                  tabIndex={-1}
                >
                  <img
                    className='thumbs__icon'
                    src='/images/icon-arrow-down-hairline.svg'
                    alt=''
                  />
                </button>
                <button
                  type='button'
                  className='thumbs__btn thumbs__btn--active'
                  tabIndex={-1}
                >
                  <img
                    className='thumbs__icon'
                    src='/images/icon-arrow-down-green.svg'
                    alt=''
                  />
                </button>
              </div>
            </div>
          </div>
          {/* <div className="img_box">
                        <img src={images[0]} alt={CrocsProduct.product} />
                    </div> */}
          {/* 상품 정보 영역 */}
          <div className='product-info__wrap'>
            <div className='product-info'>
              <div className='product-info__title_wrap'>
                <p className='product-info__subtitle'>{CrocsProduct.product}</p>
                <h2 className='product-info__title'>{CrocsProduct.product}</h2>
                {/* <div className="product-info__price">
                                    <span className="product-info__price_dc_rate">
                                        {salePriceNumber
                                            ? salePriceNumber.toLocaleString()
                                            : '가격 없음'}
                                    </span>
                                    {hasOriginal && (
                                        <span className="product-info__price_breadcrumbs__line" />
                                    )}
                                    {discountPercent && (
                                        <span className="product-info__price_sale">
                                            {discountPercent}%
                                        </span>
                                    )}
                                    {hasOriginal && (
                                        <span className="product-info__price_breadcrumbs__line" />
                                    )}
                                    {hasOriginal && (
                                        <span className="product-info__price_cost">
                                            {originalPriceNumber.toLocaleString()}
                                        </span>
                                    )}
                                </div> */}
                <div className='product-info__price'>
                  <span className='product-info__price_dc_rate'>
                    {detailPrice ? detailPrice.toLocaleString() : "가격 없음"}
                  </span>

                  {hasOriginal && (
                    <>
                      <span className='product-info__price_breadcrumbs__line' />
                      <span className='product-info__price_sale'>
                        {discountPercent}%
                      </span>
                      <span className='product-info__price_breadcrumbs__line' />
                      <span className='product-info__price_cost'>
                        {originalPrice.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className='product-info_breadcrumbs' />
              {/* 색상 선택 */}
              <div className='product-info_color'>
                <div className='product-info__color-title-wrap'>
                  <p className='product-info__color-title'>색상</p>
                  <span className='product-info__price_breadcrumbs__line' />
                  <p className='product-info__color-select'>
                    {colorOptions.find((c) => c.key === selectedColor)?.label ||
                      "브라운"}
                  </p>
                </div>
                <div
                  className='product-info__color-badge-wrap'
                  role='group'
                  aria-label='색상 선택'
                >
                  {colorOptions.map((c) => (
                    <button
                      key={c.key}
                      type='button'
                      className={`color-badge color-badge--${c.key} ${
                        selectedColor === c.key ? "active" : ""
                      }`}
                      aria-label={`${c.label} 선택`}
                      aria-pressed={selectedColor === c.key}
                      onClick={() => handleColorSelect(c.key)}
                    />
                  ))}
                </div>
              </div>
              {/* 사이즈 선택 (BEM 구조 변환) */}
              <div className='product-info_size'>
                <div className='product-info_size-title-wrap'>
                  <p className='product-info_size-title'>사이즈</p>
                  <span className='product-info_size_breadcrumbs__line' />
                  <p className='product-info_size-select'>
                    {selectedSize || "선택하세요"}
                  </p>
                </div>
                <div className='product-info_size-btns-wrap'>
                  <ul
                    className='product-info_size-btns'
                    role='group'
                    aria-label='사이즈 선택'
                  >
                    {categorySizes.map((size) => (
                      <li key={size}>
                        <button
                          type='button'
                          className={selectedSize === size ? "active" : ""}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button onClick={() => onAddWishList(CrocsProduct)}>
                위시버튼💚
              </button>
              <WishAddPopup />
              {/* <button
                                className="product-btn-cart"
                                onClick={() =>
                                    onProductAddCart({
                                        ...CrocsProduct,
                                        product_img: Array.isArray(CrocsProduct.product_img)
                                            ? CrocsProduct.product_img[0] // 대표 이미지
                                            : CrocsProduct.product_img,
                                        price: detailPrice, // ⭐ 장바구니에서도 동일 가격 사용
                                    })
                                }
                            >
                                장바구니
                            </button> */}
              <button
                className='product-btn-cart'
                onClick={() =>
                  onProductAddCart({
                    id: CrocsProduct.id,

                    // ⭐ CartStore에서 name 사용하므로 반드시 넣기
                    name: CrocsProduct.product,
                    title: CrocsProduct.product, // 혹시 title도 찾을 수 있으므로 같이 넣기

                    // ⭐ 할인 가격 or 정상 가격 반영
                    price: detailPrice,

                    // ⭐ 장바구니 수량
                    quantity: quantity,

                    // ⭐ 선택한 사이즈
                    size: selectedSize || null,

                    // ⭐ 대표 이미지
                    product_img: images[selectedImageIdx],

                    // product_img: Array.isArray(CrocsProduct.product_img)
                    //   ? CrocsProduct.product_img[0]
                    //   : CrocsProduct.product_img,
                  })
                }
              >
                장바구니
              </button>
              <WishAddPopup />
            </div>
          </div>
          {/* <div className="detail-info">
                        {/* 🔥 제품명 
                        <h2 className="detail-title">{CrocsProduct.product}</h2>

                        {/* 🔥 가격 
                        {/* <p className="detail-price">₩{CrocsProduct.prices?.[0] || '가격 없음'}</p> */}
          {/* <p className="detail-price">₩{detailPrice.toLocaleString()}</p>
                    {hasOriginal && (
                        <p className="detail-original">
                            <del>₩{originalPrice.toLocaleString()}</del>
                            {discountPercent !== null && (
                                <span className="detail-discount"> {discountPercent}%</span>
                            )}
                        </p>
                    )} */}
          {/* 🔥 사이즈 선택 
                        <div className="detail-sizes">
                            <h3>사이즈</h3>
                            <div className="size-buttons">
                                {categorySizes.map((size) => (
                                    <button
                                        key={size}
                                        className={selectedSize === size ? 'active' : ''}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => onAddWishList(CrocsProduct)}>위시버튼💚</button>
                        <button
                            className="product-btn-cart"
                            onClick={() => onProductAddCart(CrocsProduct)}
                        >
                            장바구니
                        </button>
                        <WishAddPopup />
                    </div> */}{" "}
          {/* detail-info 닫는 태그 */}
        </div>
      </div>
    </div>
  );
};
export default CrocsProductDetail;
