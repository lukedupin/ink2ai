import React, { useState, useRef, useEffect } from "react"
import {
    VStack,
    Box,
    Input,
    Text,
    LinkBox,
    LinkOverlay,
    useColorModeValue,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td, Textarea
} from '@chakra-ui/react';
import TSNEPlot from "../components/TSNEPlot.js"
import {AbstractSimInput} from "../components/abstract_sim_input"
import * as Util from "../helpers/util.js"
import {BannerWidget} from "../components/banner_widget";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Document, Page } from 'react-pdf';

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
import { Button } from "react-bootstrap";

//import { pdfjs } from 'react-pdf'
//pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

export const Legislation = (props) => {
    const {legislation_uid, showToast} = props

    const params = useParams()

    const [state, setState] = useState({
        legislation: {},
        legislation_text: "...",
        question: "",
    })
    const { legislation, legislation_text, question } = state

    const [conversation, setConversation] = useState([])

    const [policy, setPolicy] = useState([])

    const [socket, setSocket] = useState(null);

    const billRef = useRef(null)

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
        const { legislation_uid } = params
        Util.fetch_js('/api/legislation/detail/', { legislation_uid },
            js => {
                setState(prev => ({...prev,
                    legislation: js.legislation,
                    legislation_text: js.legislation_text,
                }))
                console.log(js)
            }, showToast )

        const _socket = connectWS( `${WS_URL}/ws/legislation_chat`, setSocket, {
            'chat_ready': recvChatReady,
            'chat_response': recvChatResponse,
            'chat_policy': recvChatPolicy,
        })

        //Track the state of the socket
        _socket.onopen = () => {
            console.log("Socket connected")
            setState(prev => ({ ...prev, connected: true }))

            sendWS( _socket, 'chat_init', { legislation_uid } )
        }
        _socket.onclose = () => {
            console.log("Socket closed")
            setState(prev => ({ ...prev, connected: false }))
        }

        return closeWS( socket )
    }, []);

    const recvChatReady = ({}) => {
        console.log("Ready")
    }

    const recvChatResponse = ({ response }) => {
        setConversation(prev => [ ...prev, `AI: ${response}`, '' ] )
    }

    const recvChatPolicy = ({ claim, response }) => {
        setPolicy(prev => [ ...prev, {claim, response}])
    }

    const handleChange = (e) => {
        setState(prev => ({...prev,
            question: e.target.value
        }))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setConversation( prev => [ ...prev, `Me: ${question}` ] )
            sendWS( socket, 'chat_query', { question } )
            setState(prev => ({...prev,
                question: ""
            }))
        }
    }

    const handlePolicy = (e) => {
        sendWS( socket, 'chat_policy', {} )
    }

    const bg = useColorModeValue("gray.50", "gray.700");
    const color = useColorModeValue("black", "white");
    const selected_color = useColorModeValue("green", "white");

    const gap = 2
    const templateColumns = useBreakpointValue({ base: "2fr", md: `${gap+1}fr ${gap}fr` })

    const conversation_text = conversation.join('\n')

    return (
        <Grid templateRows="auto 1fr" mt={36} mb={24}>
            <GridItem as="main" p={4}>
                <Grid templateColumns={templateColumns} gap={6}>
                    <GridItem>
                        <VStack align="start"
                                spacing={3}
                                mb={6}
                                p={4}
                                h="full"
                                bg={bg}
                                borderRadius="md"
                                boxShadow="xl"
                                borderColor="gray.200"
                                borderWidth={1}>
                            <Text fontSize="lg" fontWeight="bold" color={color}>
                                Idaho {legislation.legislation_code}
                                &nbsp;
                                &nbsp;
                                &nbsp;
                                <a href={legislation.raw_content} target="_blank">
                                    PDF
                                </a>
                            </Text>
                            <Textarea
                                ref={billRef}
                                color={"black"}
                                bg="white"
                                h={"70vh"}
                                borderColor={"#3182ce"}
                                borderWidth={2}
                                isDisabled={true}
                                value={legislation_text}/>
                        </VStack>
                    </GridItem>
                    <GridItem>
                        <VStack align="start"
                                spacing={3}
                                mb={6}
                                p={4}
                                h="full"
                                bg={bg}
                                borderRadius="md"
                                boxShadow="xl"
                                borderColor="gray.200"
                                borderWidth={1}>
                            <Text fontSize="lg" fontWeight="bold" color={color}>
                                Document Chat
                            </Text>
                            <Textarea
                                h="full"
                                isDisabled={true}
                                value={conversation_text}/>

                            <Input placeholder="Chat with the document..." size="lg" mb={4} borderColor="gray.300"
                                   value={question}
                                   onKeyDown={handleKeyDown}
                                   onChange={handleChange}/>
                        </VStack>
                    </GridItem>
                </Grid>
            </GridItem>


            <GridItem as="main" p={4}>
                <VStack align="start"
                        spacing={3}
                        mb={6}
                        p={4}
                        bg={bg}
                        borderRadius="md"
                        boxShadow="xl"
                        borderColor="gray.200"
                        borderWidth={1}>
                    <Button
                        variant="primary"
                        onClick={handlePolicy}>
                        Platform Analysis
                    </Button>

                    {policy.map((policy, idx) =>
                        <VStack
                            key={`policy_${idx}`}
                            align="start"
                            spacing={3}
                            mb={6}
                            p={4}
                            bg={bg}
                            borderRadius="md"
                            boxShadow="xl"
                            borderColor="gray.200"
                            borderWidth={1}>
                            <Text fontSize="lg" fontWeight="bold" color={color}>
                                {policy.claim.raw_claim}
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color={color}>
                                {policy.response}
                            </Text>
                        </VStack>
                    )}
                </VStack>
            </GridItem>
        </Grid>
    );
}