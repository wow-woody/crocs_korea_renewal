import React from 'react';

const ButtonWrap = ({ btnText, onClick }) => {
    return (
        <div className="btn_wrap">
<<<<<<< HEAD
            <button onClick={onClick}>
=======
            <button className="monthly_btn" onClick={onClick}>
>>>>>>> 7e8c2c77746530933c16fbb40c876986979575d2
                <span>{btnText}</span>
            </button>
        </div>
    );
};

export default ButtonWrap;
