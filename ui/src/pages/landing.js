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
import {
    closeWS, combineArrayBuffers,
    connectWS,
    sendWS
} from "../helpers/util.js";
import { WS_URL } from "../settings";
import {Button} from "react-bootstrap";

import * as RobotLevelUp from '../assets/images/robot_level_up.png'
import {Slidey} from "../components/slidey";

export const Landing = (props) => {
    const {showToast} = props

    const [state, setState] = useState({
        sdxl_loaded: false,
        connected: false,
        prompt: "",
        negative: "low quality, bad quality, sketches",
        cn_weight: 500,
        cn_start: 0,
        cn_end: 100,
        filename: '',
        raw_file: null,
        usr_img: null,
        result_size: 0,
        result_images: [],
    })
    const { connected, sdxl_loaded, prompt, negative, cn_weight, cn_start, cn_end, filename, raw_file, usr_img, result_size, result_images } = state

    const [socket, setSocket] = useState(null);

    const [fileData, setFileData] = useState([]); // File data in base64 format

    //File ref required to access the file browser
    const fileRef = React.useRef();

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
        const _socket = connectWS( `${WS_URL}/ws/stable_diff_xl`, setSocket, {
            'sdxl_ready': recvSdxlReady,
            'sdxl_user_image': recvSdxlUserImage,
            'sdxl_file_size': recvSdxlFilesize,
            'file': binSdlxFile,
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
        setState(prev => ({ ...prev, sdxl_loaded: true }))
        console.log("Ready")
    }

    const recvSdxlUserImage = ({status}) => {
        console.log( status )
    }

    const recvSdxlFilesize = ({file_size}) => {
        setState(prev => ({ ...prev, result_size: file_size }))
    }

    const binSdlxFile = ( data ) => {
        const current = fileData.reduce((sum, x) => sum + x.byteLength, 0 ) + data.byteLength

        //Store data until we have everything
        if ( result_size != 0 && current < result_size ) {
            console.log(data)
            setFileData( prev => ([...prev, data]) )
        }
        //We have everything, display the image
        else {
            console.log( fileData)
            console.log( data)
            const buffer = combineArrayBuffers( [...fileData, data])
            console.log( buffer )
            const blob = new Blob([buffer], { type: 'image/png' });
            console.log(blob)
            setState(prev => ({...prev,
                result_images: [...prev.result_images, URL.createObjectURL(blob)],
            }))
        }
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prev => ({...prev,
            [id]: value
        }))
    }

    //Funky pass through to open the file browse
    const handleFileClick = () => {
        if ( !connected ) {
            showToast( 'Not connected', 'failure');
            return;
        }

        fileRef.current.value = null;
        fileRef.current.click();
    };

    //We have a selected file
    const handleFileChange = e => {
        if ( !connected ) {
            showToast( 'Not connected', 'failure')
            return;
        }

        const raw_file = e.target.files[0];

        // Check file size
        const file_mb = raw_file.size / (1024 * 1024)
        console.log( file_mb )
        if ( file_mb > 150 ) {
            showToast( 'Files need to be less than 150MB', 'failure')
            return
        }
        else if ( file_mb > 100 ) {
            showToast( 'Files larger than 100MB impacts performance', 'failure')
        }

        //Start the upload
        handleUpload( raw_file )

        //update the state
        setState(prev => ({...prev,
            filename: raw_file.name,
            raw_file,
            usr_img: URL.createObjectURL( raw_file ),
        }))
    };

    const handleUpload = ( raw_file ) => {
        if ( !connected ) {
            showToast( 'Not connected', 'failure')
            return;
        }

        // Check file size
        const file_mb = raw_file.size / (1024 * 1024)
        if ( file_mb > 150 ) {
            return
        }

        Util.sendWS( socket, 'sdxl_user_file_size', { file_size: raw_file.size })

        Util.sendFileWS( socket, raw_file )
    };

    const handleRunSDXL = () => {
        if ( !connected || !sdxl_loaded ) {
            showToast( 'Not connected', 'failure')
            return;
        }

        if ( !raw_file ) {
            showToast( 'No file selected', 'failure')
            return;
        }

        Util.sendWS( socket, 'sdxl_generate', {
            prompt,
            negative,
            cn_weight: cn_weight / 1000,
            cn_start: cn_start / 100,
            cn_end: cn_end / 100,
        })
    }

    const bg = useColorModeValue("gray.50", "gray.700");
    const color = useColorModeValue("black", "white");
    const selected_color = useColorModeValue("green", "white");

    const gap = 2
    const templateColumns = useBreakpointValue({ base: "2fr", md: `${gap}fr ${gap}fr` })

    if ( !connected ) {
        return (
            <Grid templateRows="auto 1fr" mt={36} mb={24}>
                <GridItem as="main" p={4}>
                    <Text fontSize="lg" fontWeight="bold" color="red">
                        Server connection error
                    </Text>
                </GridItem>
            </Grid>
        )
    }

    if ( connected && !sdxl_loaded ) {
        return (
            <Grid templateRows="auto 1fr" mt={36} mb={24}>
                <GridItem as="main" p={4}>
                    <Text fontSize="lg" fontWeight="bold" color={color}>
                        SD XL warming up... This might take 30 seconds...
                    </Text>
                </GridItem>
            </Grid>
        )
    }

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
                            <input
                                type='file'
                                ref={fileRef}
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <Button onClick={handleFileClick}>
                                Choose File
                            </Button>
                            <Box boxSize='sm'>
                                <Image src={usr_img} alt='Your hand drawn image' />
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
                            <Text fontSize="lg" fontWeight="bold" mb={6} color={color}>
                                Tuning param
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color={color}>
                                CN Weight
                            </Text>
                            <Slidey
                                id={"cn_weight"}
                                value={cn_weight}
                                min={0}
                                max={5000}
                                marker_start_end={true}
                                markers={6}
                                marker_cb={ (value) => value / 1000 }
                                onChange={handleChange}
                            />

                            <Text fontSize="sm" fontWeight="bold" color={color}>
                                CN Start
                            </Text>
                            <Slidey
                                id={"cn_start"}
                                value={cn_start}
                                min={0}
                                max={100}
                                markers={3}
                                marker_cb={ (value) => value + "%" }
                                onChange={handleChange}
                            />

                            <Text fontSize="sm" fontWeight="bold" color={color}>
                                CN End
                            </Text>
                            <Slidey
                                id={"cn_end"}
                                value={cn_end}
                                min={0}
                                max={100}
                                markers={3}
                                marker_cb={ (value) => value + "%" }
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
                    variant="primary"
                    onClick={handleRunSDXL}>
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
                    {result_images.map( (img, i) => (
                    <GridItem key={`sd_img_${i}`} as="main" p={4}>
                        <Image src={img} alt='SD XL' key={`result_${i}`} />
                        <a href={img} download={`result_${i}.png`}>Download</a>
                    </GridItem>
                    ))}
                </HStack>
            </GridItem>
        </Grid>
    );
}
