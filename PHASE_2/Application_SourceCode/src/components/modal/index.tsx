import React from 'react';
import './modal.css';

const handleModal = () => {
    var modals = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;
    modals[0].style.display = 'none';
}

const Modal = (props) => {
    let className = 'modal';
    return (
      <div
        className={`${className} ${props.className}`}
      >
        <div className="modal-content">
          <span className="close" onClick={handleModal} >&times;</span>
          <h1>WARNING!</h1>
          <br></br>
          <p></p>
        </div>
      </div>
    );
  };
  
  export default Modal;