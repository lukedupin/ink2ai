import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import Util from '../helpers/util';
import { useStore } from '../store';

import DiscordImg from "../assets/images/discord.png";

export const DiscordWidget = (props) => {
    const handleDiscord = () => {
        //window.open('https://discord.gg/jzEuYTaD', '_blank')
    }

    return (
        <section id="community" className="mt-50 mb-50">
            <div className="container">
                <div className="row flex-all-center">
                    <div className="col-lg-12 col-md-6 position-u wow fadeInRight">
                        <div>
                            <div className="section-heading text-center">
                                <label className="sub-heading">HUB</label>
                                <h2 className="heading-title">Community</h2>
                            </div>
                        </div>
                    </div>

                    <img src={DiscordImg} style={{cursor: 'pointer', width: '84px',}} onClick={handleDiscord}/>
                    <p className="work-des reset-width" style={{cursor: 'pointer'}} onClick={handleDiscord}>
                        Join Discord
                    </p>
                </div>
            </div>
        </section>
    )
}
