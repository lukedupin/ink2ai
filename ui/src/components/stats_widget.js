import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import Util from '../helpers/util';
import { useStore } from '../store';

import StatsImage from "../assets/images/robot_ice_hiker.jpg"

export const StatsWidget = (props) => {
    const { totals } = props
    const { scan_count, peak_count, human_count } = totals

    const numberToUnits = (value) => {
        let units = ''

        //Scale the number
        if (value >= 1000000000) {
            value /= 1000000000
            units = 'B'
        }
        else if (value >= 1000000) {
            value /= 1000000
            units = 'M'
        }
        else if (value >= 1000) {
            value /= 1000
            units = 'K'
        }

        const zero = value.toFixed(1).search(/[.]0$/)
        return { value: (value >= 100 || zero >= 0) ? Math.round(value): value.toFixed(1), units }
    }

    const contents = [
        { title: 'Patent database', ...numberToUnits(scan_count) },
        { title: 'Claims searched',  ...numberToUnits(peak_count) },
        { title: 'Happy Humans', ...numberToUnits(human_count) },
    ]

    return (
        <section id="community-stats" className="mt-100 mb-50">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-6 position-u wow fadeInRight">
                        <div>
                            <div className="section-heading text-center">
                                <label className="sub-heading">Network</label>
                                <h2 className="heading-title">Changing the landscape of landscaping</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 position-u wow fadeInRight">
                            <img src={StatsImage} alt="banner" className="banner-img-item"/>
                    </div>
                    <div className="col-lg-6 col-md-6 position-u wow fadeInRight">
                        <div className="banner-img-stats">
                            <h1 className="banner-heading-stats">Stats</h1>
                            {Object.entries(contents).map(([key, value]) =>
                                <span key={`stats_widget_content_${key}`}>
                                    <div className="d-inline p-2 text-black width-200">
                                        {value.value} <span className="inClassText">{value.units}</span>
                                    </div>
                                    <div className="p-2 work-des">{value.title}</div>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
