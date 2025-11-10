import React from 'react';

const ButtonWrap = ({ btnText, onClick }) => {
    return (
        <div className="btn_wrap">
            <button onClick={onClick}>
                <span>{btnText}</span>
            </button>
        </div>
    );
};

export default ButtonWrap;
