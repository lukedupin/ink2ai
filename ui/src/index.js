import React, { useState, useEffect, useRef } from 'react';
import {
    Route, Routes, BrowserRouter, useLocation, useNavigation, useNavigate
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react"

import { createRoot } from 'react-dom/client';

import { Toast } from "./components/toast";

import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Dashboard } from "./pages/dashboard";
import {Profile} from "./pages/profile";

import { Landing } from "./pages/landing";

import { CommunityVoice } from "./pages/community_voice";
import {Signup} from "./pages/signup";
import {Roadmap} from "./pages/roadmap";

import { useStore } from "./store"

import './assets/css/style.css'
import './assets/css/color.css'
import './assets/css/responsive.css'
import './assets/scss/theme1.scss'
//import './assets/scss/theme2.scss'
import "./assets/css/TSNEPlot.css"
import Logo from './assets/images/logo.png'

import * as Util from './helpers/util';
import { PrivacyPolicy } from "./pages/privacy_policy";
import {Patents} from "./pages/patents";

export const App = (props) => {
    const [state, setState] = useState({
        preloaded: false,
        delay_loading: false,
        slow: false,
        err: false,
        toast: { msg: "", status: "" },
    })
    const { preloaded, delay_loading, err, slow, toast } = state

    const { setCsrfIfEmpty } = useStore( x => x )

    useEffect(() => {
        setTimeout(() => {
            setState(prev => ({...prev,
                delay_loading: true,
            }))
        }, 600)

        setTimeout(() => {
            setState(prev => ({...prev,
                slow: "Communication is taking longer than expected."
            }))
        }, 3000)

        return

        //Assign the csrf token if I was given one
        if ( props.csrf.indexOf("csrf_token") < 0
             //&& props.stripe_pk.indexOf("stripe_pk") < 0
        ) {
            setCsrfIfEmpty( props.csrf )
            //setStripeKey( props.stripe_pk )
            //setStripePromise( loadStripe( props.stripe_pk ))
        }
    }, [])

    const handleLoaded = () => {
        setState(prev => ({...prev,
            preloaded: true,
        }))
    }

    const handleToast = ( msg, status ) => {
        if ( status == undefined || status == null ) {
            status = "failure"
        }

        const toast = { msg, status };
        setState(prev => ({ ...prev, toast }))
    }

    const handleToastComplete = () => {
        const toast = { msg: "", status: "" };
        setState(prev => ({ ...prev, toast }))
    }

    //Main entry into program
    return (
        <BrowserRouter>
            {(!delay_loading || !preloaded) &&
                <Preload
                    msg={err || slow}
                    handleToast={handleToast}
                    onLoaded={handleLoaded}
                />
            }
            {preloaded &&
            <Core
                handleToast={handleToast}
            />
            }

            <Toast msg={toast.msg}
                   status={toast.status}
                   timeout="5000"
                   onComplete={handleToastComplete}
            />
        </BrowserRouter>
    );
}

export const Preload = (props) => {
    const { msg, handleToast, onLoaded } = props

    const { setUsrInfo, setCsrfIfEmpty } = useStore( x => x )

    const navigate = useNavigate()

    useEffect(() => {
        onLoaded() // No user account stuff right now

        /*
        Util.fetch_js('/api/human/is_valid/', {},
            js => {
                console.log(js)
                if ( js.logged_in ) {
                    setUsrInfo( js.human )

                setCsrfIfEmpty( js.csrf_token )
                onLoaded()
            })
         */
    }, [])

    return (
        <div id="preloader" className="flex-all-center">
            <img src={Logo} alt="preloader" className="preload-img"/>
            <p className="preload-msg">{msg}</p>
        </div>
    )
}

//This odd nesting is required because I need to load the path and that can only happen inside the router
export const Core = (props) => {
    const { handleToast } = props

    const [state, setState] = useState({
        show_header: false,
        show_footer: false,
    })
    const { show_header, show_footer } = state

    const location = useLocation()

    useEffect(() => {
        const path = `${window.location.pathname}`.replace(/^\//, '').replace(/\/.*$/, '').toLowerCase()
        const show_header = true
        const show_footer = true //(['landing', 'community-voice', 'roadmap', 'privacy-policy'].indexOf(path) >= 0) || (path == '')

        //Title controls
        if ( path == 'landing' || path == '' ) {
            document.title = `Ink2Ai`
        }
        else {
            document.title = `Ink2Ai | ${Util.namify( path )}`
        }

        //Ensure we can scroll, this is an issue if a modal was opened and the user navs away
        if ( document.body.classList.contains('no-scroll-mondays') ) {
            document.body.classList.remove('no-scroll-mondays')
        }

        //Update my state
        setState(prev => ({...prev,
            show_header,
            show_footer,
        }))
    }, [location])

    //Main entry into program
    return (
        <>
            {show_header &&
                <Header
                    showToast={handleToast}
                />
            }

            <Routes>
                <Route path="/dashboard" element={
                    <Dashboard
                        showToast={handleToast} />
                }/>
                <Route path="/patents" element={
                    <Patents
                        showToast={handleToast} />
                }/>
                <Route path="/signup" element={
                    <Signup
                        showToast={handleToast} />
                }/>
                <Route path="/profile" element={
                    <Profile
                        showToast={handleToast} />
                }/>

                <Route path="/community-voice" element={
                    <CommunityVoice
                        showToast={handleToast} />
                }/>
                <Route path="/roadmap" element={
                    <Roadmap
                        showToast={handleToast} />
                }/>
                <Route path="/privacy-policy" element={
                    <PrivacyPolicy
                        showToast={handleToast} />
                }/>
                <Route path='*' element={
                    <Landing
                        showToast={handleToast} />
                }/>
            </Routes>

            {show_footer && false &&
                <Footer
                    showToast={handleToast} />
            }
        </>
    );
}

//*** This is the part that inserts the react app into the dom
const app = document.getElementById('app');
const root = createRoot(app);

const csrf = app.getAttribute("csrf");

root.render(
    <React.StrictMode>
        <ChakraProvider>
            <App csrf={csrf} />
        </ChakraProvider>
    </React.StrictMode>
)
