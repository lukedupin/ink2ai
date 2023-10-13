import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import Util from '../helpers/util';
import { useStore } from '../store';

import DiscoverImg from "../assets/images/chest_powerup.jpg";
import MintImg from "../assets/images/robot_scan_qr.jpg";
import CollectImg from "../assets/images/robot_group.jpg";
import ClaimImg from "../assets/images/robot_place_qr_code.jpg";

export const HowItWorks = (props) => {
    const {onClick} = props

    return (
        <section className="work-part bg-pattern pt-50 pt-15" id="how_it_works">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 wow fadeInUp">
                        <div className="section-heading text-center">
                            <label className="sub-heading">How does it work?</label>
                            <h2 className="heading-title">Define your idea</h2>
                            <p className="heading-des pb-20">
                                Define your idea, review overlap, adjust, and export.
                            </p>
                            <ul className="check-list heading-des pt-25">
                                <li>
                                    <label className="sub-heading">Define</label>
                                    <p>
                                        Either create claims or an abstact of your new invention.
                                        If you choose to use high level language, claims will be suggested for you.
                                    </p>
                                    <img src={DiscoverImg} alt="feature" className="feature-img"/>
                                </li>
                                <li>
                                    <label className="sub-heading">Review</label>
                                    <p>
                                        Review the overlap between your idea and existing patents.
                                        Each claim of your IP is rated against overlapping patents.
                                        A matrix of overlaps is visualized.
                                    </p>
                                    <img src={MintImg} alt="feature" className="feature-img"/>
                                </li>
                                <li>
                                    <label className="sub-heading">Adjust</label>
                                    <p>
                                        Claims can be adjusted to find bluesky IP.
                                        As adjustments are made, the overlap matrix is updated in real-time.
                                        Repeat this process until a decision can be rendered.
                                    </p>
                                    <img src={CollectImg} alt="feature" className="feature-img"/>
                                </li>
                                <li>
                                    <label className="sub-heading">Export</label>
                                    <p>
                                        When your ready, export your IP as a PDF or share a link.
                                        The link can be shared with your team or clients.
                                        Attach your report to help expedite the patent process.
                                    </p>
                                    <img src={ClaimImg} alt="feature" className="feature-img"/>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="subscribe">
                        <div className="form-group">
                            <input type="button"
                                   name="submit"
                                   value="Get Started"
                                   className="btn"
                                   onClick={onClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}