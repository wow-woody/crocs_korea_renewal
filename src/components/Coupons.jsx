import React from 'react';
import { loginAuthStore } from '../store/loginStore';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import './scss/Coupons.scss';

const Coupons = () => {
    const { user } = loginAuthStore();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    const coupons = user.coupons || [];
    const availableCoupons = coupons.filter((coupon) => !coupon.isUsed);
    const usedCoupons = coupons.filter((coupon) => coupon.isUsed);

    // 날짜 포맷 함수
    const formatDate = (date) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
            d.getDate()
        ).padStart(2, '0')}`;
    };

    // 만료 여부 확인
    const isExpired = (expiresAt) => {
        if (!expiresAt) return false;
        const expireDate = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
        return expireDate < new Date();
    };

    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="My Coupons" subTitle="보유하신 쿠폰을 확인하세요" />

                <div className="coupons_container">
                    {/* 사용 가능한 쿠폰 */}
                    <section className="coupon_section">
                        <h3>
                            사용 가능한 쿠폰{' '}
                            <span className="count">({availableCoupons.length})</span>
                        </h3>
                        <div className="coupon_list">
                            {availableCoupons.length === 0 ? (
                                <div className="empty_state">
                                    <p>사용 가능한 쿠폰이 없습니다.</p>
                                    <button onClick={() => navigate('/crocsclub')}>
                                        크록스 클럽 가입하고 쿠폰 받기
                                    </button>
                                </div>
                            ) : (
                                availableCoupons.map((coupon) => (
                                    <div
                                        key={coupon.id}
                                        className={`coupon_card ${
                                            isExpired(coupon.expiresAt) ? 'expired' : ''
                                        }`}
                                    >
                                        <div className="coupon_header">
                                            <div className="discount_badge">
                                                {coupon.discount}
                                                {coupon.type === 'percentage' ? '%' : '원'}
                                            </div>
                                            <div className="coupon_info">
                                                <h4>{coupon.name}</h4>
                                                <p className="coupon_code">코드: {coupon.code}</p>
                                            </div>
                                        </div>
                                        <div className="coupon_footer">
                                            <p className="issued_date">
                                                발급일: {formatDate(coupon.issuedAt)}
                                            </p>
                                            <p
                                                className={`expire_date ${
                                                    isExpired(coupon.expiresAt) ? 'expired' : ''
                                                }`}
                                            >
                                                {isExpired(coupon.expiresAt)
                                                    ? '만료됨'
                                                    : `유효기간: ${formatDate(
                                                          coupon.expiresAt
                                                      )}까지`}
                                            </p>
                                        </div>
                                        {!isExpired(coupon.expiresAt) && (
                                            <button
                                                className="use_coupon_btn"
                                                onClick={() => navigate('/products')}
                                            >
                                                쇼핑하러 가기
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* 사용한 쿠폰 */}
                    {usedCoupons.length > 0 && (
                        <section className="coupon_section used_section">
                            <h3>
                                사용 완료 <span className="count">({usedCoupons.length})</span>
                            </h3>
                            <div className="coupon_list">
                                {usedCoupons.map((coupon) => (
                                    <div key={coupon.id} className="coupon_card used">
                                        <div className="coupon_header">
                                            <div className="discount_badge">
                                                {coupon.discount}
                                                {coupon.type === 'percentage' ? '%' : '원'}
                                            </div>
                                            <div className="coupon_info">
                                                <h4>{coupon.name}</h4>
                                                <p className="coupon_code">코드: {coupon.code}</p>
                                            </div>
                                        </div>
                                        <div className="coupon_footer">
                                            <p className="used_badge">사용 완료</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Coupons;
