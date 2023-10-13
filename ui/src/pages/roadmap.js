import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import stepOne from "../assets/images/step-one.jpg";
import stepTwo from "../assets/images/step-two.jpg";
import stepThree from "../assets/images/step-three.jpg";
import stepFour from "../assets/images/step-four.jpg";
import stepFive from "../assets/images/step-five.jpg";
import bushWrecker from "../assets/images/bushwrecker.jpg";
import {BannerWidget} from "../components/banner_widget";

export const Roadmap = (props) => {
    return (
        <>
            <BannerWidget
                title="Roadmap"
                subtitle="Path to Peaks"
            />

            <section>
                <div className="container py-5 mt-100">
                    <div className="main-timeline-2">
                        <div className="timeline-2 left-2">
                            <div className="card-roadmap">
                                <img src={stepOne} alt="banner"/>
                                    <div className="card-body p-4">
                                        <h4 className="fw-bold mb-4 work-process-title">Launch Prototype</h4>
                                        <p className="text-muted mb-4">
                                            <i className="far fa-clock" aria-hidden="true"></i> April 2023</p>
                                        <p className="mb-0">
                                            Launch BeenThere in Coeur D'Alene.
                                            Place 50 to 100 QR codes on mountains peaks around the greater Coeur D'Alene area.
                                            Confirm interest in the concept and begin to build out the community.
                                            Gather usage numbers, feedback, and scope out market interest.
                                            Create enough market interest to validate a national launch.
                                        </p>
                                    </div>
                            </div>
                        </div>
                        <div className="timeline-2 right-2">
                            <div className="card-roadmap">
                                <img src={stepTwo} alt="banner"/>
                                    <div className="card-body p-4">
                                        <h4 className="fw-bold mb-4 work-process-title">Alpha</h4>
                                        <p className="text-muted mb-4"><i className="far fa-clock"
                                                                          aria-hidden="true"></i> June 2023</p>
                                        <p className="mb-0">
                                            Contact 150 club leaders across 40 states.
                                            Capture 3,000 peaks across the US.
                                            Begin to building the mobile app.
                                        </p>
                                    </div>
                            </div>
                        </div>
                        <div className="timeline-2 left-2">
                            <div className="card-roadmap">
                                <img src={stepThree} alt="banner"/>
                                    <div className="card-body p-4">
                                        <h4 className="fw-bold mb-4 work-process-title">Beta</h4>
                                        <p className="text-muted mb-4"><i className="far fa-clock"
                                                                          aria-hidden="true"></i> August 2023</p>
                                        <p className="mb-0">
                                            Community directed development.
                                        </p>
                                    </div>
                            </div>
                        </div>
                        <div className="timeline-2 right-2">
                            <div className="card-roadmap">
                                <img src={stepFour} alt="banner"/>
                                    <div className="card-body p-4">
                                        <h4 className="fw-bold mb-4 work-process-title">Pre-production</h4>
                                        <p className="text-muted mb-4"><i className="far fa-clock"
                                                                          aria-hidden="true"></i>October 2023</p>
                                        <p className="mb-0">At vero eos et accusamus et iusto odio dignissimos ducimus
                                            qui blanditiis
                                            praesentium voluptatum deleniti atque corrupti quos dolores et quas
                                            molestias excepturi sint
                                            occaecati cupiditate non provident, similique sunt in culpa qui officia
                                            deserunt mollitia animi,
                                            id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
                                            expedita distinctio.</p>
                                    </div>
                            </div>
                        </div>
                        <div className="timeline-2 left-2">
                            <div className="card-roadmap">
                                <img src={stepFive} alt="banner"/>
                                    <div className="card-body p-4">
                                        <h4 className="fw-bold mb-4 work-process-title">V1</h4>
                                        <p className="text-muted mb-4"><i className="far fa-clock"
                                                                          aria-hidden="true"></i> January 2023</p>
                                        <p className="mb-0">Temporibus autem quibusdam et aut officiis debitis aut rerum
                                            necessitatibus
                                            saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
                                            Itaque earum rerum
                                            hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores
                                            alias consequatur aut
                                            perferendis doloribus asperiores repellat.</p>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
