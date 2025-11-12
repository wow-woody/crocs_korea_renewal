import React from 'react';

const InstagramPrevButton = ({ onClick }) => {
  return (
    <div className="instagram__video-prev">
      <a href="#" className="instagram__video-prev-link" onClick={onClick}>
        <span className="prev_line"></span>
        <span className="prev_line"></span>
        <p className="prev_text">prev</p>
      </a>
    </div>
  );
};

export default InstagramPrevButton;
