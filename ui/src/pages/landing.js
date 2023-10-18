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
    Td,
    Textarea,
    HStack,
    Progress
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
        cn_weight: 900,
        cn_steps: 35,
        cn_start: 0,
        cn_end: 100,
        filename: '',
        clean_img: true,
        raw_file: null,
        usr_img: null,
        result_size: 0,
        result_images: [],
        queue: -1,
        queue_current: -1,
    })
    const { connected, sdxl_loaded, prompt, negative, cn_weight, cn_steps, cn_start, cn_end, filename, clean_img, raw_file, usr_img, result_size, result_images, queue, queue_current } = state

    const [socket, setSocket] = useState(null);

    const [fileData, setFileData] = useState([]); // File data in base64 format

    const [progress, setProgress] = useState(-1); // Progress of file upload

    const [updateDraw, setUpdateDraw] = useState(null);

    //File ref required to access the file browser
    const fileRef = React.useRef();

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);


    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.scrollY;
        setScrollPosition(position);
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: false });

        setTimeout( clearCanvas, 750 )

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const _socket = connectWS( `${WS_URL}/ws/stable_diff_xl`, setSocket, {
            'sdxl_ready': recvSdxlReady,
            'sdxl_user_image': recvSdxlUserImage,
            'sdxl_file_size': recvSdxlFilesize,
            'sdxl_progress': recvSdxlProgress,

            'sdxl_generate': recvErr,
            'sdxl_queue_update': recvSdxlQueueUpdate,

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

    const recvSdxlProgress = ({progress}) => {
        setProgress( progress )
    }

    const binSdlxFile = ( data ) => {
        const current = fileData.reduce((sum, x) => sum + x.byteLength, 0 ) + data.byteLength

        //Store data until we have everything
        if ( result_size != 0 && current < result_size ) {
            setFileData( prev => ([...prev, data]) )
        }
        //We have everything, display the image
        else {
            const buffer = combineArrayBuffers( [...fileData, data])
            const blob = new Blob([buffer], { type: 'image/png' });
            setState(prev => ({...prev,
                result_images: [ URL.createObjectURL(blob), ...prev.result_images ],
            }))
        }
    }

    const recvErr = ({resp}) => {
        console.log( resp )
    }

    const recvSdxlQueueUpdate = ({queue, queue_current}) => {
        console.log( queue, queue_current)
        setState(prev => ({...prev,
            queue,
            queue_current,
        }))
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
        if ( file_mb > 15 ) {
            showToast( 'Files need to be less than 15MB', 'failure')
            return
        }
        else if ( file_mb > 10 ) {
            showToast( 'Files larger than 10MB impacts performance', 'failure')
        }

        //Start the upload
        //handleUpload( raw_file )
        loadFileIntoCanvas( raw_file )

        //update the state
        setState(prev => ({...prev,
            filename: raw_file.name,
            raw_file,
            usr_img: URL.createObjectURL( raw_file ),
        }))
    };

    const loadFileIntoCanvas = (raw_file) => {
        const canvas = canvasRef.current
        if ( canvas == null ) {
            return
        }
        const context = canvas.getContext('2d');

        const image = new window.Image();
        image.src = URL.createObjectURL( raw_file )

        image.onload = () => {
            // Draw the image on the canvas at position (0, 0)
            context.drawImage(image, 0, 0, 512, 512);

            //Upload the canvas
            handleUploadCanvas()
        };
    }

    const handleUpload = ( raw_file ) => {
        if ( !connected ) {
            showToast( 'Not connected', 'failure')
            return;
        }

        // Check file size
        const file_mb = raw_file.size / (1024 * 1024)
        if ( file_mb > 15 ) {
            return
        }

        Util.sendWS( socket, 'sdxl_user_file_size', { file_size: raw_file.size })

        Util.sendFileWS( socket, raw_file )
    };

    const handleUploadCanvas = () => {
        if ( canvasRef.current == null ) {
            return
        }
        const canvas = canvasRef.current

        canvas.toBlob((blob) => {
            const raw_file = new File([blob], 'dirty_canvas.png', { type: 'image/png' });
            //setState(prev => ({ ...prev, filename: raw_file.name, raw_file, }))

            handleUpload( raw_file )
        }, 'image/png');
    }

    const handleRunSDXL = () => {
        if ( !connected || !sdxl_loaded ) {
            showToast( 'Not connected', 'failure')
            return;
        }

        Util.sendWS( socket, 'sdxl_generate', {
            prompt,
            negative,
            cn_steps,
            cn_weight: cn_weight / 1000,
            cn_start: cn_start / 100,
            cn_end: cn_end / 100,
        })
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if ( canvas == null ) {
            return
        }
        const context = canvas.getContext('2d');
        //context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        //Draw back the image ?
        if ( !clean_img && raw_file ) {
            loadFileIntoCanvas( raw_file )
            setState(prev => ({ ...prev,
                clean_img: true,
            }))
        }
    };

    const getClientXY = (e) => {
        let { clientX, clientY } = e
        if ( 'touches' in e ) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        }

        return [ clientX, clientY ]
    }

    const startDrawing = (e) => {
        const canvas = canvasRef.current
        if ( canvas == null ) {
            return
        }
        const context = canvas.getContext('2d');

        const [ x, y ] = getClientXY( e )

        setIsDrawing(true);
        context.beginPath();
        context.moveTo(
            x - canvas.getBoundingClientRect().left,
            y - canvas.getBoundingClientRect().top
        );

        //Cancel any pending updates
        if ( updateDraw ) {
            clearTimeout( updateDraw )
        }
        setUpdateDraw( null )
        setState(prev => ({ ...prev,
            clean_img: false,
        }))

        e.preventDefault()
    };

    const drawCanvas = (e) => {
        const canvas = canvasRef.current
        if ( canvas == null || !isDrawing ) {
            return
        }
        const context = canvas.getContext('2d');

        const [ x, y ] = getClientXY(e)

        context.lineTo(
            x - canvas.getBoundingClientRect().left,
            y - canvas.getBoundingClientRect().top
        );
        context.stroke();

        e.preventDefault()
    };

    const stopDrawing = (e) => {
        const canvas = canvasRef.current
        if ( canvas == null || !isDrawing ) {
            return
        }
        const context = canvas.getContext('2d');

        setIsDrawing(false);
        context.closePath();

        e.preventDefault()

        //Create a delayed update
        if ( updateDraw ) {
            clearTimeout( updateDraw )
        }
        setUpdateDraw( setTimeout( handleUploadCanvas, 1000 ))
    };

    const bg = useColorModeValue("gray.50", "gray.700");
    const color = useColorModeValue("black", "white");
    const selected_color = useColorModeValue("green", "white");

    const gap = 6
    const templateColumns = useBreakpointValue({ base: "2fr", md: `${gap+1}fr ${gap}fr` })

    if ( !connected ) {
        return (
            <Grid templateRows="auto 1fr" mt={36} mb={24}>
                <GridItem as="main" p={4}>
                    <Text fontSize="lg" fontWeight="bold" color="red">
                        Server connection lost. Please refresh the page.
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
                                p={1}
                                bg={"#f0f0f0"}
                                height={680}
                                borderRadius="md"
                                boxShadow="xl"
                                borderColor="gray.200"
                                borderWidth={1}>
                            <Text fontSize="lg" fontWeight="bold" mt={3} ml={3} color={color}>
                                Draw on canvas or Upload your PNG
                            </Text>
                            <input
                                type='file'
                                ref={fileRef}
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <HStack align="start" ml={3}>
                                <Button onClick={handleFileClick}>
                                    Choose File
                                </Button>
                                <Button onClick={clearCanvas}>
                                    Clear
                                </Button>
                            </HStack>
                            <Box boxSize='sm'>
                                <canvas
                                    style={{touchAction: 'none'}}
                                    ref={canvasRef}
                                    width="512"
                                    height="512"
                                    onMouseUp={stopDrawing}
                                    onMouseMove={drawCanvas}
                                    onMouseDown={startDrawing}
                                    onMouseLeave={stopDrawing}

                                    onTouchStart={startDrawing}
                                    onTouchMove={drawCanvas}
                                    onTouchCancel={stopDrawing}
                                    onTouchEnd={stopDrawing}
                                    />
                            </Box>
                        </VStack>
                    </GridItem>

                    <GridItem as="main" width="full" height={680}>
                        <VStack align="start"
                                spacing={3}
                                mb={6}
                                p={4}
                                bg={bg}
                                width="full"
                                height={680}
                                overflow={'auto'}
                                borderRadius="md"
                                boxShadow="xl"
                                borderColor="gray.200"
                                borderWidth={1}>
                            <Button
                                algin="start"
                                height={40}
                                variant="primary"
                                onClick={handleRunSDXL}>
                                Generate Image
                            </Button>
                            <VStack height={640} width={"full"}>
                                {progress >= 0 &&
                                    <GridItem as="main" p={4}>
                                        <Text fontSize="sm" fontWeight="bold" color={color}>
                                            {progress == 0?
                                                ((queue > queue_current)? "Queue position "+ (queue - queue_current): "Starting render"):
                                                "Generating Image"}
                                        </Text>
                                        <Progress width="full" hasStripe value={progress} />
                                    </GridItem>
                                }
                                {result_images.map( (img, i) => (
                                    <GridItem key={`sd_img_${i}`} as="main" p={4}>
                                        <a href={img} target="_blank">
                                            <Image src={img} alt='SD XL' key={`result_${i}`} />
                                        </a>
                                        <a href={img} download={`result_${i}.png`}>Download</a>
                                    </GridItem>
                                ))}
                            </VStack>
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
                                {id == 'prompt' &&
                                    <> (Describe the image you want)</>
                                }
                                {id == 'negative' &&
                                    <> (Things you don't want in your image)</>
                                }
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
                        CN Weight (How much to use your drawing)
                    </Text>
                    <Slidey
                        id={"cn_weight"}
                        value={cn_weight}
                        min={0}
                        max={3000}
                        marker_start_end={true}
                        markers={6}
                        marker_cb={ (value) => value / 1000 }
                        onChange={handleChange}
                    />

                    <Text fontSize="sm" fontWeight="bold" color={color}>
                        CN Start (% to start using your drawing)
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
                        CN End (% to stop using your drawing)
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

                    <Text fontSize="sm" fontWeight="bold" color={color}>
                        Steps (More is slower)
                    </Text>
                    <Slidey
                        id={"cn_steps"}
                        value={cn_steps}
                        min={5}
                        max={50}
                        marker_start_end={true}
                        markers={6}
                        marker_cb={ (value) => Math.floor(value) }
                        onChange={handleChange}
                    />
                </VStack>
            </GridItem>
        </Grid>
    );
}
