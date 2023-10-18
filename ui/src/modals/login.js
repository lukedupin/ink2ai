import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import * as Util from "../helpers/util"
import { useStore } from "../store"
import Close from "../assets/images/close.svg"
import ProfileImg from '../assets/images/logo.png'
import bannerIntro from "../assets/images/banner.png"
import bushWrecker from "../assets/images/bushwrecker.jpg"
import trailJunk from "../assets/images/trailrunner.jpg"
import knoob from "../assets/images/hiker.jpg"
import Logo from "../assets/images/logo_icon.png"
import Refresh from "../assets/images/refresh.png"

export const Login = (props) => {
    const { showToast, onClose } = props;

    const { setUsrInfo } = useStore( x => x )

    const [state, setState] = useState({
        phone: "",
        access_code: "",
        name_signin_valid: false,
        show_access_code: false,
    })
    const { phone, access_code, name_signin_valid, show_access_code } = state

    const handleSendAccess = () => {
    }

    const handleCreate = () => {
    }

    const handlePhoneChange = (e) => {
        handleChange(e)
    }

    const handleChange = (e) => {
        setState(prev => ({...prev,
            [e.target.name]: e.target.value
        }))
    }

    const is_phone_valid = (phone.replaceAll(/[^0-9]/g, '').replace(/^1/, '').length == 10)

    return (
        <div className="container py-5 h-100">
            {onClose != undefined &&
            <img src={Close}
                 className="close-btn"
                 onClick={() => onClose(false)}/>
            }
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-xl-12">
                    <div className="col-lg-12 d-flex align-items-center">
                        <div className="px-3 p-md-5 mx-md-4" style={{ width: '100%' }}>
                            <h4 className="mb-4 login-title">
                                <img src={Logo} alt="Been There" style={{ width: '48px' }}/>
                                Login
                                <div style={{ width: '48px' }}></div>
                            </h4>
                            <div className="row g-4">
                                <div className="col-lg-3 width-100">
                                    {!name_signin_valid && show_access_code &&
                                    <img src={Refresh}
                                         className="logo_refresh"
                                         onClick={handleSendAccess}
                                    />
                                    }
                                    <input type="text"
                                           className="form-control singup-input"
                                           placeholder="Phone or Nickname"
                                           name="phone"
                                           value={phone}
                                           onChange={handlePhoneChange}
                                           aria-label="Phone or Nickname"/>
                                </div>
                                {!name_signin_valid && show_access_code &&
                                    <div className="col-lg-3 width-100">
                                        <input type="text"
                                               className="form-control singup-input"
                                               placeholder="Access Code"
                                               name="access_code"
                                               value={access_code}
                                               onChange={handleChange}
                                               aria-label="Access Code"/>
                                    </div>
                                }
                                {!name_signin_valid && !show_access_code &&
                                    <div className="col-lg-3 form-single width-100">
                                        <button type="button"
                                                onClick={handleSendAccess}
                                                disabled={!is_phone_valid}
                                                style={!is_phone_valid? { borderColor: '#999', background: '#999'}: {}}
                                                className="btn btn-lg">
                                            Send Code
                                        </button>
                                    </div>
                                }
                                {!name_signin_valid && show_access_code &&
                                    <div className="col-lg-3 flex_row_center width-100">
                                        <button type="button"
                                                onClick={handleCreate}
                                                className="btn btn-lg">
                                            Sign in
                                        </button>
                                    </div>
                                }
                                {name_signin_valid &&
                                    <div className="col-lg-3 flex_row_center width-100">
                                        <button type="button"
                                                onClick={handleCreate}
                                                className="btn btn-lg">
                                            Sign in
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
