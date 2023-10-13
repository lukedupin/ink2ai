import React, { useState } from 'react';

//Define my view common
export const InputModal = (props) => {
    const {onClose} = props;
    const {title, placeholder, message, usr, add_button} = props;

    let message_safe = message
    if ( message_safe == null || message_safe == undefined ) {
        message_safe = ""
    }

    const [state, setState] = useState({ msg: message_safe });
    const { msg } = state;

    const handleChange = (e) => {
        setState({
            ...state,
            msg: e.target.value
        })
    }

    return (
        <div className="basic-modal basic-modal--add-category">
            <div className="basic-modal__head"
                 onClick={() => onClose("", usr)}>
                <h4>{title}</h4>
                <svg className="basic-modal__close-button" width="12"
                     height="11" viewBox="0 0 12 11" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M7.93359 5.375L10.8633 2.44531C11.2441 2.09375 11.2441 1.50781 10.8633 1.15625L10.2188 0.511719C9.86719 0.130859 9.28125 0.130859 8.92969 0.511719L6 3.44141L3.04102 0.511719C2.68945 0.130859 2.10352 0.130859 1.75195 0.511719L1.10742 1.15625C0.726562 1.50781 0.726562 2.09375 1.10742 2.44531L4.03711 5.375L1.10742 8.33398C0.726562 8.68555 0.726562 9.27148 1.10742 9.62305L1.75195 10.2676C2.10352 10.6484 2.68945 10.6484 3.04102 10.2676L6 7.33789L8.92969 10.2676C9.28125 10.6484 9.86719 10.6484 10.2188 10.2676L10.8633 9.62305C11.2441 9.27148 11.2441 8.68555 10.8633 8.33398L7.93359 5.375Z"
                        fill="currentColor"></path>
                </svg>
            </div>

            <div className="basic-modal__field-container basic-modal__field-container--add-category">
                <div
                    className="basic-modal__field basic-modal__field--add-category">
                    <label className="basic-modal__label" htmlFor="newCategoryName">
                        {placeholder}
                    </label>
                    <input
                        className="basic-modal__input basic-modal__input--add-category"
                        type="text" id="newCategoryName"
                        placeholder={placeholder}
                        value={msg}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="basic-modal__button-container">
                <button className="basic-modal__button basic-modal__button--clear"
                        onClick={() => onClose("", usr)}>
                    Cancel
                </button>
                <button className="basic-modal__button basic-modal__button--solid"
                        onClick={() => onClose( msg, usr )}>
                    {add_button}
                </button>
            </div>
        </div>
    );
}
