import React from "react";

function InfoTooltip(props) {
  return (
    <div className={`popup ${props.isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button
          className="popup__close"
          type="button"
          onClick={props.onClose}
        ></button>
        <img className="popup-info__image" />
        <h2 className="popup-info__title">
          {`${
            props.status
              ? "Вы успешно зарегистрировались!"
              : "Что-то пошло не так! Попробуйте ещё раз."
          }`}
        </h2>
      </div>
    </div>
  );
}
export default InfoTooltip;
