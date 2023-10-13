import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import Util from '../helpers/util';
import { useStore } from '../store';

import PlanImg from "../assets/images/robot_plan.jpg";
import PlayImg from "../assets/images/robot_hiker.jpg";
import LevelUpImg from "../assets/images/robot_level_up.jpg";

export const FeaturesWidget = (props) => {
    const { desc, onClick } = props;

    return (
        <section className="work-part ptb-50" id="beenthere_features">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 wow fadeInUp">
                        <div className="section-heading text-center pb-65">
                            <label className="sub-heading">Features</label>
                            <h2 className="heading-title">Search, Compare, Speed</h2>
                            <p className="heading-des">
                                Level-Up your patent agency.
                            </p>
                            <ul className="check-list heading-des pt-25">
                                <li>
                                    <label className="sub-heading">Search</label>
                                    <p>
                                        Legacy systems function but executing syntax searches (word matches).
                                        Conduct semantic searches on the entire patent landsacpe.
                                        Semantic searches function by understanding the meaning, and then comparing meanings..
                                    </p>
                                    <img src={PlanImg} alt="feature"
                                         className="feature-img"/>
                                </li>
                                <li>
                                    <label className="sub-heading">Compare</label>
                                    <p>
                                        Compare your patent portfolio to the entire patent landscape.
                                        Test scenario and refine your patent strategy.
                                    </p>
                                    <img src={PlayImg} alt="feature"
                                         className="feature-img"/>
                                </li>
                                <li>
                                    <label
                                        className="sub-heading">Speed</label>
                                    <p>
                                        Recover your lost time.
                                        Legacy services take 10-14 days; this is akin to executing google searchs through the US mail.
                                        Landscape.chat works in real-time.
                                        How much $$$ is your time worth?
                                        Opportunity cost is real.
                                    </p>
                                    <img src={LevelUpImg} alt="feature"
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