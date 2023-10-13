import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import ProfileImg from '../assets/images/logo_icon.svg'
import {useStore} from "../store";
import * as Util from "../helpers/util";
import {ModalBase} from "../modals/modal_base";
import {Login} from "../modals/login";
import {AvatarModal} from "../modals/avatar_modal";
import Refresh from "../assets/images/refresh.png";

export const Profile = (props) => {
    const { showToast, onAttemptLogin } = props;

    const { usr_info, setUsrInfo } = useStore( x => x )

    const og_phone = (usr_info && usr_info.phone)? usr_info.phone: ''

    const [state, setState] = useState({
        profile_url: ProfileImg,
        name: (usr_info && usr_info.name)? usr_info.name: '',
        phone: (usr_info && usr_info.phone)? usr_info.phone: '',
        email: (usr_info && usr_info.email)? usr_info.email: '',
        access_code: '',
        bio: "",
        show_update: false,
        filename: '',
        raw_file: null,
        avatar: null,
        show_avatar: false,
        show_access_code: false,
    })
    const { profile_url, name, phone, email, access_code, bio, show_update, filename, raw_file, avatar, show_avatar, show_access_code } = state

    const fileRef = useRef()
    const navigate = useRef(useNavigate())

    useEffect(() => {
        console.log( usr_info )
        if ( 'name' in usr_info && usr_info.name != null ) {
            setState(prev => ({...prev,
                profile_url: usr_info.profile_url || ProfileImg,
                name: usr_info.name || "",
                phone: usr_info.phone || "",
                email: usr_info.email || "",
                bio: usr_info.bio || "",
            }))
        }
    }, [usr_info]);

    //Funky pass through to open the file browse
    const handleFileClick = () => {
        fileRef.current.click();
    };

    //We have a selected file
    const handleFileChange = e => {
        if ( e.target.files.length <= 0 || e.target.files[0] == null ) {
            return
        }

        const raw_file = e.target.files[0];

        setState(prev => ({...prev,
            show_update: true,
            filename: raw_file.name,
            raw_file
        }))
    };

    const handlePickAvatar = () => {
        setState(prev => ({ ...prev,
            show_avatar: true,
        }))
    }

    const handleLogin = (success, obj) => {
        if ( success ) {
            if ( obj != undefined && obj.phone != null && obj.phone.length == 10 ) {
                navigate.current('/dashboard')
            }
            else {
                showToast("Insecure account", "failure")
            }
        }
        else {
            navigate.current('/')
        }
    }

    const handleLogout = () => {
        Util.fetch_js('/api/human/logout/', {},
            js => {
                setUsrInfo({})
                navigate.current('/')
            },
            err => {
                showToast(err, "failure")
            })
    }

    const handleUpdate = () => {
        let payload = {
            name,
            phone,
            email,
            bio,
            access_code,
        }
        /*
        if ( raw_file != null ) {
            payload.profile_image = raw_file
        }
        */
        if ( avatar != null ) {
            payload.avatar_uid = avatar.uid
        }

        setState(prev => ({ ...prev,
            show_update: false,
        }))

        Util.fetch_js("/api/human/modify/", payload,
            js => {
                //setUsrInfo( js )
                setState(prev => ({...prev,
                    name: js.name || "",
                    phone: js.phone || "",
                    email: js.email || "",
                    bio: js.bio || "",
                }))

                showToast("Updated", "success")
            },
            err => {
                setState(prev => ({ ...prev,
                    show_update: true,
                }))
                showToast(err, "failure")
            })
    }

    const handleChange = (e) => {
        setState(prev => ({...prev,
            show_update: true,
            [e.target.name]: e.target.value
        }))
    }

    const handleAvatarSelected = (avatar) => {
        setState(prev => ({ ...prev,
            avatar,
            profile_url: avatar.img_url,
            show_update: true,
            show_avatar: false,
        }))
    }

    const handleSendAccess = () => {
        Util.fetch_js("/api/human/request_reset_code/", { phone },
            js => {
                setState(prev => ({ ...prev,
                    show_access_code: true,
                }))
                showToast("Sent", "success")
            }, showToast )
    }

    //const profile_img = ((raw_file != null)? URL.createObjectURL(raw_file) : usr_info.profile_url) || ProfileImg
    const logged_in = (usr_info && 'phone' in usr_info)
    const invalid_name = (name.length < 3)
    const invalid_email = false
    const invalid_phone = (phone.replaceAll(/[^0-9]/g, '').replace(/^1/, '').length != 10)

    const show_access_button = (!invalid_phone && phone != og_phone && access_code.length != 5)

    return (
        <>
            <section id="profile" className="profile pt-100">
                <div className="container">

                    <div className="row justify-center">
                        <img className="profile-image"
                            src={profile_url || ProfileImg}
                            onClick={handlePickAvatar} />
                        <input
                            type='file'
                            accept='image/*'
                            ref={node => (fileRef.current = node)}
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-12 wow fadeInUp">
                            <div className="section-heading text-center">
                                <h2 className="heading-title">Profile</h2>
                            </div>
                        </div>
                    </div>

                    <div className="profile-container">
                        <div className="main-profile col-md-6">
                            <div className="row">
                                <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Nickname {invalid_name? "*Invalid": ""}</label>
                                            <input type="name"
                                                   style={invalid_name? {'background': 'orangered'}: {}}
                                                   className="form-control"
                                                   placeholder="Name"
                                                   name="name"
                                                   value={name}
                                            onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Phone</label>
                                            <input type="phone"
                                                   style={invalid_phone? {'background': 'orangered'}: {}}
                                                   className="form-control"
                                                   placeholder="Phone number"
                                                   name="phone"
                                                   value={phone}
                                                   onChange={handleChange}/>
                                            {invalid_phone && <>
                                                <p>Anyone can access your account.</p>
                                                <p>Please save a phone number for validation.</p>
                                            </>
                                            }
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Email {invalid_email? "*Invalid": ""}</label>
                                        <input type="email"
                                               style={invalid_email? {'background': 'orangered'}: {}}
                                               className="form-control"
                                               placeholder="Email address"
                                               name="email"
                                               value={email}
                                               onChange={handleChange}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <textarea type="bio"
                                               className="form-control"
                                               placeholder="Bio"
                                               name="bio"
                                               value={bio}
                                               onChange={handleChange}/>
                                    </div>
                                </div>
                            </div>
                            {show_access_code && show_update &&
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Access Code</label>
                                            <input type="number"
                                                   style={(access_code.length != 5)? {'background': 'orangered'}: {}}
                                                   className="form-control"
                                                   placeholder="Access code"
                                                   name="access_code"
                                                   value={access_code}
                                                   onChange={handleChange}/>
                                        </div>
                                    </div>
                                </div>
                            }
                            {show_access_button &&
                                <div className="row">
                                    <div className="col-md-12">
                                        <input type="button"
                                               name="submit"
                                               value="Request Access Code"
                                               className="button"
                                               style={{ display: 'block', margin: 'auto' }}
                                               onClick={handleSendAccess} />
                                    </div>
                                </div>
                            }
                            <div className="row">
                                <div className="col-md-12">
                                    <input type="button"
                                        name="submit"
                                        value="Update"
                                        className="button"
                                        style={{
                                            display: (show_update && !show_access_button) ? 'block' : 'none',
                                            margin: 'auto',
                                        }}
                                        onClick={handleUpdate} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="profile" className="profile">
                <div className="container">
                    <div className="row text-center">
                        {logged_in &&
                            <p className="heading-des notice-action"
                               onClick={handleLogout}>
                                Logout
                            </p>
                        }
                    </div>
                </div>
            </section>

            <ModalBase blackout={true} centered={!logged_in}>
                {show_avatar &&
                    <AvatarModal
                        target="humans"
                        showToast={showToast}
                        onSelect={handleAvatarSelected}
                        onClose={() => setState(prev => ({...prev, show_avatar: false }) )}
                    />
                }
                {!logged_in &&
                    <Login showToast={showToast}
                           onClose={handleLogin}
                    />
                }
            </ModalBase>
        </>
    );
};
