import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collaboAuthStore } from '../store/authStore';
// import Title from '../components/Title';

const JibbitzCollaboProductDetail = () => {
    const { id } = useParams();
    const { jibbitzItems } = collaboAuthStore();
    console.log('jibbitzItems:', jibbitzItems);

    //찾은 상품을 저장할 변수
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (!id || jibbitzItems.length === 0) return;
        //뿌려질 제품 찾기
        const findItem = jibbitzItems.find((item) => String(item.id) === String(id));
        console.log('findItem:', findItem);
        setProduct(findItem);
        console.log('들어왔나?');
    }, [id, jibbitzItems]);

    if (!product) {
        return <div>상품 정보를 불러오고 있으니 기다리라 ㅡㅡ </div>;
    }

    return (
        <div className="sub_page">
            <div className="inner">
                <div className="product-detail-wrap">
                    {/* <Title title="women" /> */}
                    <h2>상품 예시입니당 💚</h2>
                </div>
            </div>
        </div>
    );
};
console.log('왜 안나오니??');
export default JibbitzCollaboProductDetail;
