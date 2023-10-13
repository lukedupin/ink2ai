import React, { useState, useRef, useEffect } from "react"
import {
    VStack,
    Box,
    Input,
    Text,
    LinkBox,
    LinkOverlay,
    useColorModeValue, Table, Thead, Tr, Th, Tbody, Td
} from '@chakra-ui/react';
import TSNEPlot from "../components/TSNEPlot.js"
import {AbstractSimInput} from "../components/abstract_sim_input"
import * as Util from "../helpers/util.js"
import {BannerWidget} from "../components/banner_widget";
import { Link, useNavigate } from "react-router-dom";

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

export const Landing = (props) => {
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

        legislations: [],
    })
    const { connected, claims, claim_patent_strengths, patent_claim_matches, patents, clusters, history, history_idx, legislations } = state

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

        Util.fetch_js('/api/legislation/list/', { government_uid: '' },
            js => {
                setState(prev => ({
                    ...prev,
                    legislations: js.legislations
                }))
            }, showToast)

    }, [])

    const bg = useColorModeValue("gray.50", "gray.700");
    const color = useColorModeValue("black", "white");
    const selected_color = useColorModeValue("green", "white");

    return (
        <Grid templateRows="auto 1fr" mt={36} mb={24}>
            <GridItem as="main" p={4}>
                <Grid gap={6}>
                    <GridItem>
                        <VStack align="start"
                                spacing={3}
                                mb={6}
                                p={4}
                                bg={bg}
                                borderRadius="md"
                                boxShadow="xl"
                                borderColor="gray.200"
                                borderWidth={1}>
                            <Text fontSize="lg" fontWeight="bold" color={color}>Idaho Legislation</Text>
                            <Table variant="striped">
                                {false &&
                                <Thead>
                                    <Tr>
                                        <Th>Idaho</Th>
                                        <Th>Legislation</Th>
                                    </Tr>
                                </Thead>
                                }
                                <Tbody>
                                {legislations.map((legislation, idx) =>
                                    <Tr key={`legislation_${idx}`}>
                                        <Td>
                                            <Link to={`/legislation/${legislation.uid}`}>
                                                {legislation.legislation_code}
                                            </Link>
                                        </Td>
                                        <Td>
                                            <Link to={`/legislation/${legislation.uid}`}>
                                                {legislation.title}
                                            </Link>
                                        </Td>
                                    </Tr>
                                )}
                                </Tbody>
                            </Table>
                        </VStack>
                    </GridItem>
                </Grid>
            </GridItem>
        </Grid>
    );
}
