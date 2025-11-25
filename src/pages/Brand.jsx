import React from 'react';
import Title from '../components/Title';
import './scss/brand.scss';

const Brand = () => {
    return (
        <div className="sub_page brand_page">
            <div className="brand_banner_wrap">
                <img src="/images/brand_img_01.png" alt="brand_page_banner" />
            </div>
            <div className="inner">
                <Title title="brand" />

                <div className="about_crocs_wrap">
                    <div className="img_box">
                        <img src="/images/brand_img_02.png" alt="brand_img" />
                    </div>
                    <div className="text_box">
                        <h4 className="about_title">BRAND CROCS</h4>
                        <div className="about_text">
                            미국 콜로라도 볼더에서 소박하면서도 편안한 보트 슈즈로 시작한 크록스™
                            슈즈는 오늘날 수백스타일의 남성용, 여성용, 어린이용 스타일이 전세계에서
                            판매되고 있습니다. 차별화된 컬렉션을 가지고 있는 크록스는 사계절,
                            어느때나 잘 어울리며 컬러풀하고 가벼워 편안함을 드립니다. 모든 크록스™
                            신발은 Croslite™라는 크록스 고유의 밀폐형 셀 수지를 사용하여 디자인되고
                            제작됩니다. Croslite™는 크록스를 신는 분들이 알고있고 사랑하는, 부드럽고
                            편안하며 가벼우면서 냄새와 미끄러짐에 강한 크록스만의 특징을 제공해
                            드립니다. 크록스™ 신발은 전문적 용도 및 여가 활동 뿐 아니라 캐주얼
                            스타일에도 아주 잘 어울립니다. 현재까지 크록스™ 신발은 1억 켤레 이상이
                            판매되었습니다. 이렇게 많은 사람들에게 사랑받아온 크록스를 착용해보시고
                            “사랑을 느끼세요™” . 그리고 크록스™를 한번 신어 보세요. 여러분의 발이
                            여러분에게 고마움을 느끼게 될지도 모릅니다.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Brand;
