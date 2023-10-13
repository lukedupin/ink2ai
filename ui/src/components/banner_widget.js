import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import * as Util from '../helpers/util';

import { useStore } from '../store';


export const BannerWidget = (props) => {
    const { title, subtitle, button, banner, onClick, showToast } = props;

    const [state, setState] = useState({
        peak: null,
    })
    const { peak } = state

    useEffect(() => {
        //Get the latest peak
        Util.fetch_js('/api/peak/latest/', {},
            js => {
                setState(prev => ({...prev,
                    peak: js.peak,
                }))
            },
            showToast)

    }, [])

    let buttons = props.buttons || []
    if ( button != null && button != undefined ) {
        buttons = [ { name: 'button', value: button }]
    }

    let banner_img = {}
    if ( banner ) {
        banner_img = { background: `url( ${banner} )` }
    }
    else if ( peak && peak.img_url ) {
        banner_img = { background: `url( ${peak.img_url} )` }
    }

    return (
        <section className="sub-page-banner parallax greenColor"
                 id="banner"
                 style={banner_img}>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 wow fadeInUp">
                        <div
                            className="page-banner text-center blur-background">
                            <label className="sub-heading">{subtitle}</label>
                            <h1 className="sub-banner-title">
                                {title}
                            </h1>
                        </div>
                    </div>
                </div>

                {Object.entries(buttons).map(([key, btn]) =>
                    <div key={`buttons_${key}`}
                         className="flex-all-center pt-25">
                        <div className="form-group">
                            <input type="button"
                                   name={btn.name}
                                   value={btn.value}
                                   className="btn"
                                   onClick={onClick}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
