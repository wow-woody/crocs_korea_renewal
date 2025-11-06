import React from 'react';

const Title = ({ title, subTitle }) => {
    return (
        <div className="title_wrap">
            <h2 className="section_title">{title}</h2>
            <p className="section_sub_title">{subTitle}</p>
        </div>
    );
};

export default Title;
