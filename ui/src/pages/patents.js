import React, { useState, useRef, useEffect } from "react"
import { VStack, Box, Input, Text, LinkBox, LinkOverlay, useColorModeValue } from '@chakra-ui/react';
import TSNEPlot from "../components/TSNEPlot.js"
import {AbstractSimInput} from "../components/abstract_sim_input"
import * as Util from "../helpers/util.js"
import {BannerWidget} from "../components/banner_widget";

import { Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { History } from '../components/history';
import { Search } from '../components/search';
import { Overview } from "../components/overview";
import { closeWS, connectWS, sendWS } from "../helpers/util.js";
import { Claims } from "../components/claims";
import { PatentTable } from "../components/patent_table";
import {PatentAbstract} from "../components/patent_abstract";
import { ClaimCluster } from "../components/claim_cluster";
import { PatentDescription } from "../components/patent_description";
import { WS_URL } from "../settings";

export const Patents = (props) => {
    const {showToast} = props

    const [state, setState] = useState({
        connected: false,
        claims: {},
        claim_patent_strengths: {},
        patent_claim_matches: {},
        patents: {},
        clusters: {},
        history: [],
        history_idx: -1,
    })
    const { connected, claims, claim_patent_strengths, patent_claim_matches, patents, clusters, history, history_idx } = state

    const [socket, setSocket] = useState(null);

    const tooltipRef = useRef(null)

    const [abstract, setAbstract] = useState({
        abstractData: null,
        compareData: null,
        isLoadingAbstracts: false,
    })
    const {abstractData, compareData, isLoadingAbstracts} = abstract

    const claim_uids = (history_idx >= 0)? history[history_idx]: []

    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.scrollY;
        setScrollPosition(position);
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: false });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const _socket = connectWS( `${WS_URL}/ws/patent`, setSocket, {
            'claim_to_abstracts': recvAbstracts,
            'claim_to_clusters': recvClusters,
            'claim_to_patent_inline': recvPatentInline,
            'claim_search_complete': recvSearchComplete,
        })

        //Track the state of the socket
        _socket.onopen = () => {
            console.log("Socket connected")
            setState(prev => ({ ...prev, connected: true }))
        }
        _socket.onclose = () => {
            console.log("Socket closed")
            setState(prev => ({ ...prev, connected: false }))
        }

        return closeWS( socket )
    }, []);

    const handleSearch = (claim) => {
        const claim_uid = Util.hashStr( claim )

        //let { claims, clusters } = state
        //claims[claim_uid] = { claim, claim_uid, patent_strengths: [] }
        //clusters[ claim_uid ] = { radius: 0, coord: [0, 0], clusters: [] }

        //Push onto my history
        const hist = (history_idx >= 0)? [...history[history_idx], claim_uid]: [claim_uid]
        const _claims = state.claims
        _claims[claim_uid] = { claim }

        setState(prev => ({...prev,
            claims: _claims,
            history: [...history, hist],
            history_idx: history.length,
        }))

        //Initialize the search, this will return several responses
        sendWS( socket, 'search_claim', { claim, 'skip_patent_uids': Object.keys(patents) } )
    };

    const recvAbstracts = ({ claim_uid, strengths, patents }) => {
        const _claim_patent_strengths = state.claim_patent_strengths
        _claim_patent_strengths[claim_uid] = strengths

        const _patents = state.patents
        patents.forEach( patent => {
            if ( !(patent.uid in _patents) ) {
                _patents[patent.uid] = patent
            }
        })

        setState(prev => ({...prev,
            patents: _patents,
            claim_patent_strengths: _claim_patent_strengths,
        }))
    }

    const recvClusters = ({ claim_uid, radius, coord, clusters }) => {
        let _clusters = state.clusters
        _clusters[ claim_uid ] = { radius, coord, clusters }

        setState(prev => ({...prev,
            clusters: _clusters
        }))
    }

    const recvPatentInline = ({ claim_uid, patent_uid, description, strength, matches }) => {
        //Add the patent description data, there is typically a lot here, which is why it shows up later
        const _patents = state.patents
        if ( patent_uid in _patents ) {
            _patents[patent_uid].description = description
        }

        //Upadte the strength based on the best found in the token search?
        const _claim_patent_strengths = state.claim_patent_strengths
        if ( claim_uid in _claim_patent_strengths && strength > 0 ) {
            _claim_patent_strengths[claim_uid][patent_uid] = strength
        }

        //Pull the match data, append or set it, then re-assign back to the claim matches
        const _patent_claim_matches = state.patent_claim_matches
        const patent_matches = (patent_uid in _patent_claim_matches)? _patent_claim_matches[patent_uid]: {}
        patent_matches[claim_uid] = matches
        _patent_claim_matches[patent_uid] = patent_matches

        console.log( _patents )
        console.log( _patent_claim_matches )
        setState(prev => ({...prev,
            patents: _patents,
            claim_patent_strengths: _claim_patent_strengths,
            patent_claim_matches: _patent_claim_matches,
        }))
    }

    const recvSearchComplete = ({ claim_uid }) => {
        console.log( claim_uid )
    }

    const handleHistoryClick = (idx) => {
        setState(prev => ({...prev,
            history_idx: idx
        }))
    }

    const createPatentList = () => {
        //Concat all the strengths (patent uids), and create a patent -> [claim_uids]
        let strengths = []
        claim_uids.forEach( claim_uid => {
            if ( claim_uid in claim_patent_strengths ) {
                Object.entries( claim_patent_strengths[claim_uid] ).forEach( ( [patent_uid, strength] ) => {
                    strengths.push( { patent_uid, strength } )
                } )
            }
        })

        // Comparison function to sort objects by name
        strengths.sort( (a, b) => (b.strength - a.strength))

        //Build all patents that are "touched" in order by the most overlapped, to least
        let skip = {}
        const ret = []
        strengths.forEach( strength => {
            if ( strength.patent_uid in skip ) {
                return
            }
            skip[strength.patent_uid] = true

            //Get the patent
            ret.push( patents[strength.patent_uid])
        })

        return ret
    }
    const patent_list = createPatentList()

    const [selectedLink, setSelectedLink] = useState('');
    const templateColumns = useBreakpointValue({base: "1fr", md: "1fr 3fr"});

    const side_style = (scrollPosition < 85)? {}: {
        position: "fixed",
        width: "336px",
        top: "75px",
    }

    return (
        <Grid templateRows="auto 1fr" mt={36} mb={24}>
            <GridItem as="main" p={4}>
                <Grid templateColumns={templateColumns} gap={6}>
                    <GridItem>
                        <div style={side_style}>
                            <Overview onScroll={Util.scrollTo}/>
                            <History
                                historyData={history}
                                historyIdx={history_idx}
                                onHistoryClick={handleHistoryClick}
                            />
                        </div>
                    </GridItem>
                    <GridItem>
                        <Claims
                            id="claims"
                            claims={claims}
                            claimUids={claim_uids}
                            onLinkClick={setSelectedLink}
                            onSearch={handleSearch}
                        />

                        <PatentTable
                            id="patent_table"
                            claimUids={claim_uids}
                            patents={patent_list}
                            claimPatentStrengths={claim_patent_strengths}
                            />

                        <ClaimCluster
                            id="claim_cluster"
                            claimUid={""}
                            clusters={[]}
                        />

                        <PatentAbstract
                            id="patent_abstract"
                            patents={patent_list}
                            />

                        <PatentDescription
                            id="patent_description"
                            claimUids={claim_uids}
                            claims={claims}
                            patents={patent_list}
                            patentClaimMatches={patent_claim_matches}
                            />
                    </GridItem>
                </Grid>
            </GridItem>
        </Grid>
    );
}
/*

    return (
        <>
            <span id="search-header"></span>

            <BannerWidget
                title="Landscape Search"
                subtitle="Welcome to"
            />

            <section className="h-100 gradient-form dashboard-body">
                <div className="container patent-container">
                    <div className="row">
                        <div className="tsne-column">
                            { isLoadingAbstracts &&
                                <div className="abstract-search-container">
                                    <div className="spinner"></div>
                                </div>
                            }
                            { !isLoadingAbstracts &&
                                <TSNEPlot
                                    data={abstractData}
                                    compareData={compareData}
                                    tooltipRef={tooltipRef}
                                />
                            }
                            <div id="tooltip" className="tooltip" ref={tooltipRef} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 wow fadeInUp">
                            <div className="section-heading text-center pb-65 abstract-search-container">
                                <label className="sub-heading">Landscape Search</label>
                                <h2 className="heading-title">Abstract similarity</h2>

                                <AbstractSimInput
                                    onSubmit={handleAbstractSimSubmit}
                                />
                                {isLoading &&
                                    <div className="spinner"></div>
                                }

                                <div className="abstract-results">
                                    {compareData?.abstracts?.slice(0, nAbstracts).map((result, index) => (
                                    <div className="abstract-result" key={index}>
                                        <h2 className="heading-title">{result.code_value}</h2>
                                        <p>{result.abstract}</p>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
 */
