import React from 'react';
import Title from '../components/Title';
import JibbitzProductListPage from '../components/JibbitzProductListPage';

const Jibbitz = () => {
    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="jibbitz" />
                <JibbitzProductListPage />
            </div>
        </div>
    );
};

export default Jibbitz;
