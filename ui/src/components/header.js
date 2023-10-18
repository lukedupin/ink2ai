import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import {ConnectButton} from "./connect_button";
import { useStore } from '../store';
import Util from '../helpers/util';
import { LoginType } from "../helpers/consts";

import Logo from '../assets/images/logo.png'
import Discord from '../assets/images/discord-logo-blue.png'
import { DISCORD_URL } from "../settings";

export const Header = (props) => {
    const { showToast } = props;
    const fixed = props.fixed || false

    const [state, setState] = useState({
        active_menu: false,
    })
    const { active_menu } = state

    const { usr_info } = useStore( x => x )

    //Doesn't have a valid this, so we can just se the value inside of this
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.scrollY;
        setScrollPosition(position);
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo( 0, 0 )
    }

    const handleToggle = () => {
        setState({ ...state, active_menu: !active_menu })
    }

    const handleClose = () => {
        setState({ ...state, active_menu: false })
    }

    const is_logged_in = usr_info && 'name' in usr_info

    //Configure my links based on the user login status
    let nav = []
    if ( !is_logged_in ) {
        nav = [
            //['/', 'Home'],
        ]
    }
    else {
        nav = [
            ['/', 'Home'],
            ['/roadmap', 'Roadmap'],
            ['/community-voice', 'D.A.O.'],
            ['/map', 'Map'],
            ['/dashboard', 'Dashboard'],
            ['/badge/', 'Badges'],
        ]
    }

    return (
        <>
            <div className={`top-scroll transition ${(scrollPosition > 50)? " fixed": ""}`}
                 onClick={handleScrollToTop}>
                <a href="#banner" className="scrollTo">
                    <i className="fa fa-angle-up" aria-hidden="true"></i>
                </a>
            </div>

            <header className={`transition ${(scrollPosition > 50 || fixed)? " fixed": ""}`}>
                <div className="container">
                    <div className="row flex-align">
                        <div className="logo">
                                <Link to={is_logged_in? "/map": "/"}>
                                    <img src={Logo} className="transition" alt="Been There"/>
                            </Link>
                        </div>
                        <div className="nav-wrapper">
                            <div className={`menu-toggle ${active_menu? "active": ""}`}>
                                <span></span>
                                <div className="nav-wrapper-click-friendly" onClick={handleToggle}></div>
                            </div>
                            <div className="menu" style={{display: (active_menu)? 'block': ''}}>
                                <ul>
                                    {nav.map(([path, name]) => (
                                        <li key={`key_${path}`}>
                                            <Link to={path} onClick={handleClose}>{name}</Link>
                                        </li>
                                    ))}
                                    <li>
                                        <Link to={DISCORD_URL} target="_blank" onClick={handleClose}>
                                            <img style={{ marginTop: "6px", width: '164px' }} src={Discord} alt="Discord"/>
                                        </Link>
                                    </li>
                                </ul>

                                <ConnectButton
                                    showToast={showToast}
                                    onClick={handleClose}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
