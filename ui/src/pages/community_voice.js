import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";

import Util from '../helpers/util';
import { useStore } from '../store';

import {DiscordWidget} from "../components/discord_widget";

export const CommunityVoice = (props) => {
    const { showToast } = props;
    const [tab, setTab] = useState( 1 )

    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        setScrollPosition( window.scrollY )
    };

    const navigate = useRef( useNavigate())

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const tabClass = ( kls, cur_tab ) => {
        return `${kls} ${(cur_tab == tab)? 'active': ''}`
    }

    return (
        <>
            <section className="home-banner darkblue parallax"
                     id="banner"
                     style={{backgroundPosition: `50% ${-scrollPosition}px`}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-6 position-u wow fadeInLeft">
                            <div className="banner-contain">
                                <h1 className="banner-heading">Community Voice</h1>
                                <p className="banner-des">To be defined. The goal of this project is to be community lead through decentralized voting.</p>
                                {/*<Link to='/community_list' className="btn">Start Here</Link>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <DiscordWidget />


            {/*<section id="faq" className="faq-part white pt-50">*/}
            {/*    <div className="container">*/}
            {/*        <div className="row">*/}
            {/*            <div className="col-md-12 wow fadeInUp">*/}
            {/*                <div className="section-heading text-center pb-65">*/}
            {/*                    <label className="sub-heading">Faqs</label>*/}
            {/*                    <h2 className="heading-title">Frequently Asked questions</h2>*/}
            {/*                    <p className="heading-des">*/}
            {/*                    </p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="row">*/}
            {/*            <div className="col-md-12 wow fadeInUp">*/}
            {/*                <ul className="nav nav-tab Frequently-tabs pb-55">*/}
            {/*                    <li>*/}
            {/*                        <a className={tabClass("tab-link", 1)} data-tab="tab-1" onClick={() => setTab(1)}>general</a>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <a className={tabClass("tab-link", 2)} data-tab="tab-2" onClick={() => setTab(2)}>pre-project & Project</a>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <a className={tabClass("tab-link", 3)} data-tab="tab-3" onClick={() => setTab(3)}>Community</a>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <a className={tabClass("tab-link", 4)} data-tab="tab-4" onClick={() => setTab(4)}>clients</a>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <a className={tabClass("tab-link", 5)} data-tab="tab-5" onClick={() => setTab(5)}>legal</a>*/}
            {/*                    </li>*/}
            {/*                </ul>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="row">*/}
            {/*            <div className="col-md-12 wow fadeInUp">*/}
            {/*                <div className="tab-content">*/}
            {/*                    <div className={tabClass("tab-panel", 1)}*/}
            {/*                         id="tab-1">*/}
            {/*                        <div className="row">*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">Why BeenThere?</a>*/}
            {/*                                    <p className="qus-des pt-10">*/}
            {/*                                        Supporting content creators is a form of speech.*/}
            {/*                                        We believe speech should be unfettered.*/}
            {/*                                        BeenThere is built from the ground up to run on L1 decentralized technologies.*/}
            {/*                                        Running systems on L1 means there is no central authority that can intervene.*/}
            {/*                                        The only way to ensure speech is free, is to remove the middle-man.*/}
            {/*                                    </p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">What cryptocurrencies does BeenThere run on? </a>*/}
            {/*                                    <p className="qus-des pt-10">*/}
            {/*                                        Purchasing SOL can be done through exchanges and then used to support content creators.*/}
            {/*                                    </p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">What about illegal behavior?</a>*/}
            {/*                                    <p className="qus-des pt-10">*/}
            {/*                                        Cryptocurrencies work via a public ledger.*/}
            {/*                                        That means all transactions are public record (viewable by anyone).*/}
            {/*                                        BeenThere is a decentralized service that just preforms an action.*/}
            {/*                                        If illegal activity occurs on BeenThere, there will be a public record of the transaction.*/}
            {/*                                        Agencies equipped to deal with crime will address the issue higher up the stack, like at an exchange.*/}
            {/*                                        Put simply, BeenThere doesn't condone illegal activity and all of your activities will be public record for law enforcement to use against you.*/}
            {/*                                    </p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <div className={tabClass("tab-panel", 2)}*/}
            {/*                         id="tab-2">*/}
            {/*                        <div className="row">*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">How can I participate in the BeenThere Token sale?</a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">What is BeenThere NFT?</a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">What cryptocurrencies can I use to purchase? </a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <div className={tabClass("tab-panel", 3)}*/}
            {/*                         id="tab-3">*/}
            {/*                        <div className="row">*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a  className="qus-title">How can I participate in the BeenThere Token sale?</a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">What cryptocurrencies can I use to purchase? </a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">What is BeenThere Crypto?</a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <div className={tabClass("tab-panel", 4)}*/}
            {/*                         id="tab-4">*/}
            {/*                        <div className="row">*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">How can I participate in the BeenThere Token sale?</a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">What cryptocurrencies can I use to purchase? </a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">How do I benefit from the BeenThere Token?</a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">What is BeenThere Crypto?</a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <div className={tabClass("tab-panel", 5)}*/}
            {/*                         id="tab-5">*/}
            {/*                        <div className="row">*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">What cryptocurrencies can I use to purchase? </a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">How do I benefit from the BeenThere Token?</a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div className="col-md-6 pb-65">*/}
            {/*                                <div className="faq-tab">*/}
            {/*                                    <a className="qus-title">What is BeenThere Crypto?</a>*/}
            {/*                                    <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
        </>
    );
};

