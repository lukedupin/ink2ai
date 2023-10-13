import React, { useState, useRef, useEffect } from "react"
import { VStack, Box, Input, Text, LinkBox, LinkOverlay, useColorModeValue } from '@chakra-ui/react';
import TSNEPlot from "../components/TSNEPlot.js"
import {AbstractSimInput} from "../components/abstract_sim_input"
import * as Util from "../helpers/util.js"
import {BannerWidget} from "../components/banner_widget";

import { Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { History } from '../components/history';
import { Search } from '../components/search';
import { SearchResults } from '../components/search_results';
import { closeWS, connectWS, sendWS } from "../helpers/util.js";
import { Claims } from "../components/claims";
import { PatentTable } from "../components/patent_table";
import {PatentAbstract} from "../components/patent_abstract";

export const ClaimCluster = (props) => {
    const {id, claimUid, clusters, showToast} = props

    const tooltipRef = useRef(null)

    const [abstract, setAbstract] = useState({
        abstractData: null,
        compareData: null,
        isLoadingAbstracts: false,
    })
    const {abstractData, compareData, isLoadingAbstracts} = abstract

    /*
    useEffect(() => {
        setAbstract(prev => ({
            ...prev,
            isLoadingAbstracts: true
        }))

        Util.scrollTo('search-header')

        //Load the abstract data
        Util.fetch_js('/api/patents/abstracts/', null,
            js => {
                setAbstract(prev => ({
                    ...prev,
                    abstractData: js,
                    isLoadingAbstracts: false
                }))
            },
            err => {
                showToast(err)
                setAbstract(prev => ({
                    ...prev,
                    isLoadingAbstracts: false
                }))
            })
    }, [])
     */

    /*
    const handleAbstractSimSubmit = (userInput) => {
        setCompare(prev => ({
            ...prev,
            isLoading: true
        }))

        //Grab some data!
        Util.fetch_js('/api/patents/compare_document/', {text: userInput},
            js => {
                setCompare(prev => ({
                    ...prev,
                    compareData: js,
                    isLoading: false
                }))
            },
            err => {
                showToast(err)
                setCompare(prev => ({
                    ...prev,
                    isLoading: false
                }))
            })
    }
     */

    const bg = useColorModeValue("gray.50", "gray.700");

    if ( clusters.length <= 0 ) {
        return (
            <></>
        )
    }

    return (
        <VStack align="start"
                id={id}
                spacing={3}
                mb={6}
                p={4}
                bg={bg}
                borderRadius="md"
                boxShadow="xl"
                borderColor="gray.200"
                borderWidth={1}>
            <div className="tsne-column">
                { isLoadingAbstracts &&
                    <div className="abstract-search-container">
                        <div className="spinner"></div>
                    </div>
                }
                { !isLoadingAbstracts && abstractData != null && compareData != null &&
                    <TSNEPlot
                        data={abstractData}
                        compareData={compareData}
                        tooltipRef={tooltipRef}
                    />
                }
                <div id="tooltip" className="tooltip" ref={tooltipRef} />
            </div>
        </VStack>
    );
}