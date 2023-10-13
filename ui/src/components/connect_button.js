import React, {useEffect, useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import { useStore } from '../store';
import Util from '../helpers/util';
import { LoginType } from "../helpers/consts";
import { ModalBase } from "../modals/modal_base";

export const ConnectButton = (props) => {
    const { showToast, id, onClick } = props;

    const { usr_info } = useStore(x => x)

    const navigate = useRef(useNavigate())

    const handleWallet = () => {
        navigate.current('/profile')
        onClick()
    }

    const is_valid = usr_info && 'name' in usr_info

    return (
        <div className="signin">
            <a className="btn" onClick={handleWallet}>
                {is_valid ? 'Profile': 'Login'}
            </a>
        </div>
    );
}
