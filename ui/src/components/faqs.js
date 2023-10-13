import React, { useState, useEffect, useRef } from 'react';

import Feature1 from "../assets/images/feature-1.png"
import Feature2 from "../assets/images/feature-2.png"
import Feature4 from "../assets/images/feature-4.png"
import Feature6 from "../assets/images/feature-6.png"
import Feature8 from "../assets/images/feature-8.png"
import Feature9 from "../assets/images/feature-9.png"
import Team1 from "../assets/images/team-1.jpg"
import Team2 from "../assets/images/team-2.jpg"
import Team3 from "../assets/images/team-3.jpg"
import Blog1 from "../assets/images/blog-1.jpg"
import Blog2 from "../assets/images/blog-2.jpg"

export const Faqs = (props) => {
    const [tab, setTab] = useState( 1 )

    const klass = ( kls, cur_tab ) => {
        return `${kls} ${(cur_tab == tab)? 'active': ''}`
    }

    return (
        <section id="faq" className="faq-part">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 wow fadeInUp">
                        <div className="section-heading text-center pb-65">
                            <label className="sub-heading">Faq</label>
                            <h2 className="heading-title">Frequently Asked Questions</h2>
                            <p className="heading-des">
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 wow fadeInUp">
                        <ul className="nav nav-tab Frequently-tabs pb-55">
                            <li>
                                <a className={klass("tab-link", 1)} data-tab="tab-1" onClick={() => setTab(1)}>
                                    general
                                </a>
                            </li>
                            <li>
                                <a className={klass("tab-link", 2)} data-tab="tab-2" onClick={() => setTab(2)}>
                                    Open trail project
                                </a>
                            </li>
                            <li>
                                <a className={klass("tab-link", 3)} data-tab="tab-3" onClick={() => setTab(3)}>
                                    DAO
                                </a>
                            </li>
                            <li>
                                <a className={klass("tab-link", 4)} data-tab="tab-4" onClick={() => setTab(4)}>
                                    legal
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 wow fadeInUp">
                        <div className="tab-content">
                            <div className={klass("tab-panel", 1)}
                                 id="tab-1">
                                <div className="row">
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">Why is BeenThere?</a>
                                            <p className="qus-des pt-10">
                                                Been There is designed specifically for hikers who love the thrill of reaching mountain peaks.
                                                The platform is created to keep track of your hiking achievements and as an inspiration to push yourself further.
                                                With Been There, you can create a profile and start tracking the mountain peaks you've conquered.
                                                The platform allows users to see the peaks they've acquired on a map and share their accomplishments with friends and fellow hikers.
                                                In addition to tracking accomplishments, Been There also offers tips and advice on hiking and mountaineering, as well as a community of like-minded individuals who share a passion for the outdoors.
                                                Whether you're a seasoned hiker or just starting, Been There will help you complete new challenges and find your inner peace.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">Badges, Challenges, and Achievement</a>
                                            <p className="qus-des pt-10">
                                                Been There gamifies hiking by offering badges, challenges, and achievements.
                                                Badges are awarded for completing specific challenges, such as hiking a certain number of peaks or reaching a certain elevation.
                                                Challenges are badges that must be completed in a limited amount of time; typically, a month.
                                                Achievements are individual accomplishments, such as hiking a specific peak or completing a sponsored event.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">Community Ownership</a>
                                            <p className="qus-des pt-10">
                                                Been There is a community-owned DAO (decentralized autonomous organization).
                                                Been There users can become voting by minting digital land that is defined by the Hexagonal hierarchical geospatial indexing system.
                                                This gives members the right to create and vote on referendums that will direct the future of the platform.
                                                The platform is built on the principles of community ownership and customer driven development.
                                                This approach ensures that decisions are made in the best interests of the community and creates a sense of shared responsibility and ownership.
                                                By becoming a member of Been There, you can not only track your hiking accomplishments but also play an active role in shaping the future of the platform.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">Buying QR codes and Digital Land</a>
                                            <p className="qus-des pt-10">
                                                Peaks are minted as NFTs (non-fungible tokens).
                                                QR Codes can be purchased on the Been There website.
                                                Executing a virgin QR code will mint a new NFT and assign it to the user's wallet.
                                                Owning digital land allows users to create and vote on referendums.
                                                All following users that scan the QR code will be assigned an achievement badge of that peak.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={klass("tab-panel", 2)}
                                 id="tab-2">
                                <div className="row">
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">What is the Open Trail Project?</a>
                                            <p className="qus-des pt-10">
                                                The Open Trail Project (OTP) is an innovative initiative that uses blockchain technology for data storage, ensuring that all trail information is secure and accessible to everyone.
                                                OTP is a decentralized and free organization that aims to document all trails across the entire world in a public and open format.
                                                By leveraging blockchain technology, OTP ensures that the data is tamper-proof and cannot be altered or deleted by anyone, making it a highly reliable and trustworthy resource.
                                                In addition, the blockchain-based system also ensures that the trail data is accessible to everyone, regardless of what services or apps they are willing to pay for.
                                                The Open Trail Project is a prime example of how blockchain technology can be used to create valuable resources for communities, fostering transparency, collaboration, and accessibility.
                                                Whether you're an avid hiker or a casual outdoor enthusiast, the Open Trail Project provides a wealth of information that is free and open to all, thanks to the power of blockchain technology.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">What does BeenThere have to do with OTP?</a>
                                            <p className="qus-des pt-10">
                                                BeenThere is powered by the Open Trail Project.
                                                When users import data in BeenThere, that data is stored on the OTP blockchain, improving the accuracy of the trail data and making it more accessible to everyone.
                                                A core part of BeenThere's mission is to make hiking more accessible to everyone.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">I can't find any other information on OTP? </a>
                                            <p className="qus-des pt-10">
                                                The Open Trail Project is a new initiative that is still in the early stages of development.
                                                The project is currently being developed by a small team of developers and is not yet ready for public release.
                                                The best way to assist the project is to join the BeenThere community and stay up to date on the latest developments.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={klass("tab-panel", 3)}
                                 id="tab-3">
                                <div className="row">
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a  className="qus-title">What is a DAO?</a>
                                            <p className="qus-des pt-10">
                                                A DAO, or decentralized autonomous organization, is a type of organization that operates through smart contracts on a blockchain network.
                                                A DAO is decentralized because it is not controlled by a central authority or individual, but rather governed by a group of stakeholders who hold voting rights based on their ownership of a specific cryptocurrency or token.
                                                The rules of a DAO are encoded in computer programs and executed automatically on the blockchain, eliminating the need for traditional hierarchical management structures.
                                                The decision-making process in a DAO is usually democratic, with members voting on proposals and decisions via a consensus mechanism built into the smart contracts.
                                                DAOs are often used for community-driven projects, where members collaborate and work towards a common goal, such as creating a platform, managing a fund, or even managing a physical space.
                                                DAOs are gaining popularity due to their ability to foster transparency, accountability, and trust among members, as well as their potential to disrupt traditional organizational structures.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">Is BeenThere a DAO?</a>
                                            <p className="qus-des pt-10">
                                                BeenThere will be a DAO when it reaches beta.
                                                Currently BeenThere is a prototype platform that is being developed by a small team of developers.
                                                The platforms first goal is to create a community of hikers and outdoor enthusiasts that are passionate about the outdoors.
                                                Once community interest is proven, the platform will be developed into a DAO.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">Why make BeenThere a DAO?</a>
                                            <p className="qus-des pt-10">
                                                BeenThere is a platform that is built to record your effort.
                                                It would feel wrong to have a platform based on your effort and then not give you a say in how that platform is run.
                                                A DAO is the best way to ensure that the platform is run by the community, for the community.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={klass("tab-panel", 4)}
                                 id="tab-4">
                                <div className="row">
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">Terms and services</a>
                                            <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">Privacy policy</a>
                                            <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 pb-65">
                                        <div className="faq-tab">
                                            <a className="qus-title">Health and safety</a>
                                            <p className="qus-des pt-10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. remaining essentially unchanged.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
