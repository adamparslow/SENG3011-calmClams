import React from 'react';
import './button.css';
//TODO: Add typescript typing
const Button = (props) => {
  let className = 'btn';
  if (props.hover) {
    className += ' hover';
  }
  return (
    <button
      onClick={props.onClick}
      className={`${className} ${props.className}`}
    >
      <span>{props.children}</span>
    </button>
  );
};

export default Button;
