import React, { useState, useRef, useEffect } from "react"
import {
    VStack,
    Box,
    Input,
    Text,
    LinkBox,
    LinkOverlay,
    useColorModeValue, Table, Thead, Tr, Th, Tbody, Td, Textarea, HStack
} from '@chakra-ui/react';
import { Image } from '@chakra-ui/react'
import * as Util from "../helpers/util.js"
import { Link, useNavigate } from "react-router-dom";

import { Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { closeWS, connectWS, sendWS } from "../helpers/util.js";
import { WS_URL } from "../settings";
import {Button} from "react-bootstrap";

import * as RobotLevelUp from '../assets/images/robot_level_up.png'
import {Slidey} from "../components/slidey";

export const Landing = (props) => {
    const {showToast} = props

    const [state, setState] = useState({
        connected: false,
        prompt: "",
        negative: "low quality, bad quality, sketches",
        cn_weight: 500,
        cn_start: 0,
        cn_end: 100,
    })
    const { connected, prompt, negative, cn_weight, cn_start, cn_end } = state

    const [socket, setSocket] = useState(null);

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
        const _socket = connectWS( `${WS_URL}/ws/legislation_chat`, setSocket, {
            'sdxl_ready': recvSdxlReady,
            'sdxl_image': recvSdxlImage,
        })

        //Track the state of the socket
        _socket.onopen = () => {
            console.log("Socket connected")
            setState(prev => ({ ...prev, connected: true }))

            sendWS( _socket, 'sdxl_init', {} )
        }
        _socket.onclose = () => {
            console.log("Socket closed")
            setState(prev => ({ ...prev, connected: false }))
        }

        return closeWS( socket )
    }, []);

    const recvSdxlReady = () => {
        console.log("Ready")
    }

    const recvSdxlImage = ( image ) => {
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prev => ({...prev,
            [id]: value
        }))
    }

    const bg = useColorModeValue("gray.50", "gray.700");
    const color = useColorModeValue("black", "white");
    const selected_color = useColorModeValue("green", "white");

    const gap = 2
    const templateColumns = useBreakpointValue({ base: "2fr", md: `${gap}fr ${gap}fr` })

    return (
        <Grid templateRows="auto 1fr" mt={36} mb={24}>
            <GridItem as="main" p={4}>
                <Grid templateColumns={templateColumns} gap={6}>
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
                            <Text fontSize="lg" fontWeight="bold" color={color}>
                                Upload your image (Image will be resized to 1024x1024)
                            </Text>
                            <Box boxSize='sm'>
                                <Image src='' alt='Dan Abramov' />
                            </Box>
                        </VStack>
                    </GridItem>


                    <GridItem>
                        <VStack align="start"
                                spacing={3}
                                mb={6}
                                p={4}
                                bg={bg}
                                width={"full"}
                                borderRadius="md"
                                boxShadow="xl"
                                borderColor="gray.200"
                                borderWidth={1}>
                            <Text fontSize="lg" fontWeight="bold" color={color}>
                                CN Weight
                            </Text>
                            <Slidey
                                id={"cn_weight"}
                                value={cn_weight}
                                min={0}
                                max={5000}
                                markers={[1,2,3,4]}
                                onChange={handleChange}
                            />

                            <Text fontSize="lg" fontWeight="bold" color={color}>
                                CN Start
                            </Text>
                            <Slidey
                                id={"cn_start"}
                                value={cn_start}
                                min={0}
                                max={100}
                                markers={["25%", "50%", "75%"]}
                                onChange={handleChange}
                            />

                            <Text fontSize="lg" fontWeight="bold" color={color}>
                                CN End
                            </Text>
                            <Slidey
                                id={"cn_end"}
                                value={cn_end}
                                min={0}
                                max={100}
                                markers={["25%", "50%", "75%"]}
                                onChange={handleChange}
                            />
                        </VStack>
                    </GridItem>
                </Grid>
            </GridItem>

            <GridItem as="main" p={4}>
                <Grid templateColumns={templateColumns} gap={6}>
                    {['prompt', 'negative'].map( (id, i) => (
                    <GridItem key={`prompts_${i}`}>
                        <VStack align="start"
                                spacing={3}
                                mb={6}
                                p={4}
                                bg={bg}
                                borderRadius="md"
                                boxShadow="xl"
                                borderColor="gray.200"
                                borderWidth={1}>
                            <Text fontSize="lg" fontWeight="bold" color={color}>
                                {Util.capitalize(id)}
                            </Text>
                            <Textarea
                                id={id}
                                value={state[id]}
                                onChange={handleChange}
                                />
                        </VStack>
                    </GridItem>
                    ))}
                </Grid>
            </GridItem>

            <GridItem as="main" p={4} width="full">
                <Button
                    variant="primary">
                    Generate Image
                </Button>
                <HStack align="start"
                        spacing={3}
                        mb={6}
                        p={4}
                        bg={bg}
                        width="full"
                        borderRadius="md"
                        boxShadow="xl"
                        borderColor="gray.200"
                        borderWidth={1}>
                    <Text fontSize="lg" fontWeight="bold" color={color}>
                        Platform Analysis
                    </Text>
                </HStack>
            </GridItem>
        </Grid>
    );
}
