import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import Util from '../helpers/util';
import { useStore } from '../store';

import RobotTrackPointsImg from "../assets/images/robot_track_points.jpg"
import RobotTrophyImg from "../assets/images/robot_trophy.jpg";
import RobotProspectingImg from "../assets/images/robot_prospecting.jpg";
import RobotOwnershipImg from "../assets/images/robot_ownership.jpg";
import RobotCommunityImg from "../assets/images/robot_community.jpg";

export const WhatIsThisWidget = (props) => {
    const { onClick } = props;

    return (
        <section className="work-part ptb-50" id="beenthere_features">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 wow fadeInUp">
                        <div className="section-heading text-center pb-65">
                            <label className="sub-heading">What is this?</label>
                            <h2 className="heading-title">Patent Landscaping</h2>
                            {false && <h2 className="heading-title">D>J</h2>}
                            <p className="heading-des">
                            </p>
                            <ul className="check-list heading-des pt-25">
                                <li>
                                    <label className="sub-heading">
                                        Fast
                                    </label>
                                    <p>
                                        Typical patent landscaping takes 10-14 days.
                                        Landscape.chat works in real-time.
                                    </p>
                                    <img src={RobotTrackPointsImg} alt="feature"
                                         className="feature-img"/>
                                </li>
                                <li>
                                    <label
                                        className="sub-heading">Thorough</label>
                                    <p>
                                        Landscape.chat conceptually reads all patents at once and identifies the most relevant portions.
                                        This is a new approach to patent landscaping.
                                        Imagine the ability to ready every patent at once and consider your intellectual property in the context of the entire patent landscape.
                                    </p>
                                    <img src={RobotTrophyImg} alt="feature"
                                         className="feature-img"/>
                                </li>
                                <li>
                                    <label
                                        className="sub-heading">Dynamic</label>
                                    <p>
                                        Legacy patent searchs are typically static PDFs.
                                        Landscape.chat is a dynamic document.
                                        Update, test, and refine your patent landscape in real-time.
                                        When you are ready, download a PDF or share a link.
                                    </p>
                                    <img src={RobotProspectingImg} alt="feature"
                                         className="feature-img"/>
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