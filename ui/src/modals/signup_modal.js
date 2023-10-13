import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import * as Util from "../helpers/util";
import Refresh from "../assets/images/refresh.png";
import { useStore } from "../store";
import Close from "../assets/images/close.svg";
import {DiscordWidget} from "../components/discord_widget";

export const SignupModal = (props) => {
    const { onAlreadyMember, onClose, showToast } = props;
    const show_close = (props.show_close == undefined || props.show_close)

    const [state, setState] = useState({
        name: "",
        email: "",
        phone: "",
        access_code: "",
        show_access_code: false,
    })
    const { name, phone, email, access_code, show_access_code } = state

    const { setUsrInfo } = useStore( x => x )

    const handleSendAccess = () => {
        Util.fetch_js('/api/human/request_reset_code/', { phone },
            js => {
                showToast('Sent', 'success')
            },
            showToast )

        setState(prev => ({...prev,
            access_code: "",
            show_access_code: true,
        }))
    }

    const handleCreate = () => {
        Util.fetch_js('/api/human/create/', { name, email, phone, access_code },
            js => {
                setUsrInfo( js )
                showToast('Success', 'success')
                setTimeout(() => { onClose( true ) }, 100 )
            },
            showToast )
    }

    const handleChange = (e) => {
        setState(prev => ({...prev,
            [e.target.name]: e.target.value
        }))
    }

    const invalid_phone = (phone.replaceAll(/[^0-9]/g, '').replace(/^1/, '').length != 10)

    return (
        <div className="row d-flex justify-content-center h-100 mt-25">
            {show_close &&
                <img src={Close}
                     className="close-btn"
                     onClick={() => onClose(false)}/>
            }
            <div className="col-xl-12">
                <div className="col-lg-12 d-flex align-items-center greenColor-signup">
                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                        <h4 className="mb-4 community-title">Plan, Play, Level-Up</h4>
                        <p>Stop missing out. Register and start getting credit for capturing your peaks.</p>

                        {onAlreadyMember &&
                        <div className="row g-4 pt-25">
                            <div className="col-lg-3">
                                <Link to={'#'}
                                      className="signin-login"
                                      onClick={onAlreadyMember}>
                                    Already a member?
                                </Link>
                            </div>
                        </div>
                        }

                        <div className="row g-4 pt-25">
                            <div className="col-lg-3">
                                <input type="text"
                                       className="form-control singup-input"
                                       placeholder="Nickname"
                                       name="name"
                                       value={name}
                                       aria-label="Nickname"
                                       onChange={handleChange} />
                            </div>
                            {false &&
                            <div className="col-lg-3">
                                <input type="text"
                                       className="form-control singup-input"
                                       placeholder="Email"
                                       name="email"
                                       value={email}
                                       aria-label="Email"
                                       onChange={handleChange} />
                            </div>
                            }
                            <div className="col-lg-3">
                                {show_access_code &&
                                    <img src={Refresh}
                                         className="logo_refresh"
                                         onClick={handleSendAccess}
                                    />
                                }
                                <input type="text"
                                       className="form-control singup-input"
                                       placeholder="Phone"
                                       name="phone"
                                       value={phone}
                                       style={invalid_phone? {'background': 'orangered'}: {}}
                                       aria-label="Phone"
                                       onChange={handleChange} />
                            </div>
                            {show_access_code &&
                                <div className="col-lg-3">
                                    <input type="text"
                                           className="form-control singup-input"
                                           placeholder="Access Code"
                                           aria-label="Access Code"
                                           name="access_code"
                                           value={access_code}
                                           onChange={handleChange} />
                                </div>
                            }
                        </div>

                        <div className="row g-4 mt-15">
                            {!show_access_code && !invalid_phone &&
                            <div className="col-lg-3">
                                <button type="button"
                                        className="btn btn-lg"
                                        onClick={handleSendAccess}>
                                    Send Code
                                </button>
                            </div>
                            }

                            {show_access_code &&
                            <div className="col-lg-3">
                                <button type="button"
                                        disabled={access_code.length < 4}
                                        className="btn btn-lg"
                                        onClick={handleCreate}>
                                    Create
                                </button>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
