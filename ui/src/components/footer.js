import React, { useEffect, useState } from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

export const Footer = () => {
    const bg = useColorModeValue("blue.600", "blue.300");
    const color = useColorModeValue("white", "gray.800");

    //Doesn't have a valid this, so we can just se the value inside of this
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.scrollY;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Box bg={bg}
             w="100%"
             p={5}
             color={color}
             boxShadow="2xl"
             className={`footer transition ${(scrollPosition >= 50)? " fixed": ""}`}
             transition="0.3s">
            <Text fontSize="sm">
                © 2023 Ephae
            </Text>
        </Box>
    );
}