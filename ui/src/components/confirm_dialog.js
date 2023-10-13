import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link } from "react-router-dom";

import { useStore } from '../store';
import Util from '../helpers/util';

//Define my view compon
//class Klass extends React.Component {
export const ConfirmDialog = (props) => {
    const { yesTxt, noTxt, msg, onYes, onNo } = props;

    const safeValue = (msg, _default) => {
        return (typeof (msg) == 'undefined' || msg == null) ? _default : msg;
    };

    const [state, setState] = useState({
        yes_txt: safeValue(yesTxt, "Okay"),
        no_txt: safeValue(noTxt, "Cancel"),
        message: safeValue(msg, "Are you sure?"),
    });
    const { yes_txt, no_txt, message } = state;

    return (
        <div className="popup-modal">
            <div className="delete-user-modal">
                <div className="delete-user-wrap">
                    <p className="delete-user-message">{message}</p>
                    <div className="delete-user-buttons">
                        <button className="clear-button" type="button" name="cancel" onClick={onNo}>
                            {no_txt}
                        </button>
                        <button className="solid-button" type="button" name="confirm" onClick={onYes}>
                            {yes_txt}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
