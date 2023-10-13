import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";

import * as Util from "../helpers/util";
import achievementIcon from "../assets/images/achievement.svg";
import qrIcon from "../assets/images/qr-code.svg";
import calIcon from "../assets/images/calendar.svg";
import { ModalBase } from "../modals/modal_base";


export const Dashboard = (props) => {
    const { showToast } = props;

    const [state, setState] = useState({
        logs: [],
        owned_peaks: [],
        peaks_created: 0,
        my_scan_count: 0,
        my_peak_count: 0,
        accounts_days: [],
        scans_days: [],
        show_detail: null,
    })
    const { logs, owned_peaks, peaks_created, my_scan_count, my_peak_count, accounts_days, scans_days, show_detail } = state

    const navigate = useRef(useNavigate())

    useEffect(() => {
        Util.fetch_js('/api/dashboard/view/', {},
            js => {
                setState(prev => ({...prev,
                    logs: js.logs,
                    owned_peaks: js.owned_peaks,
                    peaks_created: js.peaks_created,
                    my_scan_count: js.my_scan_count,
                    my_peak_count: js.my_peak_count,
                    accounts_days: js.totalized_days.accounts,
                    scans_days: js.days.scans,
                }))
            },
            showToast)
    }, [])

    const handlePeak = peak => {
        Util.fetch_js('/api/peak/details/', { peak_uid: peak.uid },
            js => {
                setState(prev => ({...prev,
                    show_detail: js,
                }))
            },
            showToast)
    }

    const handleClose = () => {
        setState(prev => ({...prev,
            show_detail: null,
        }))
    }

    return (
        <section className="h-100 gradient-form dashboard-body">
            <div className="container">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="user-stats">
                        <div className="card">
                            <img className="icon" src={achievementIcon} />
                            <div className="title">Peaks<br />Captured</div>
                            <div className="stats">{my_peak_count}</div>
                            <label>Completed</label>
                        </div>
                        <div className="card">
                            <img className="icon" src={qrIcon} />
                            <div className="title">Scans<br />Total</div>
                            <div className="stats">{my_scan_count}</div>
                            <label>Scanned</label>
                        </div>
                        <div className="card">
                            <img className="icon" src={calIcon} />
                            <div className="title">Peaks<br />Created</div>
                            <div className="stats">{peaks_created}</div>
                            <label>Created</label>
                        </div>
                    </div>
                    <div className="card-col">
                    </div>
                </div>
            </div>

            <ModalBase blackout={true}>
            </ModalBase>
        </section>
    );
};
