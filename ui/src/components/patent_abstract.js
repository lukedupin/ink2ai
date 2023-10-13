import React from 'react';
import { Divider, VStack, Box, useColorModeValue, Text } from '@chakra-ui/react';

export const PatentAbstract = (props) => {
    const {id, claimUids, patents} = props

    const bg = useColorModeValue("gray.50", "gray.700");
    const color = useColorModeValue("black", "white");
    const selected_color = useColorModeValue("green", "white");

    const hover = {
        bg: useColorModeValue("gray.100", "gray.600"),
        cursor: "pointer",
        transition: "0.3s"
    }

    if ( patents.length <= 0 ) {
        return (
            <></>
        )
    }

    //colorScheme="gray">
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
            <Text fontSize="lg" fontWeight="bold" color={color}>Order of Relevancy</Text>
            {Object.entries(patents).map(([idx, patent]) => (
            <Box key={idx} variant="striped">
                <Divider/>
                <Text fontSize="lg" fontWeight="bold" color={color}>
                    {patent.app_id} : Claim 1 [2], Claim 2 [3]
                </Text>
                <Divider/>

                <Text fontSize="sm" color={color}>Title: {patent.title} </Text>
                <Text fontSize="sm" color={color}>Inventors: {patent.inventors.join(', ')} </Text>
                <Text fontSize="sm" color={color}>Assignees: {patent.assignees.join(', ')} </Text>
                {patent.events.map((event, idx) => (
                <Text key={idx} fontSize="sm" color={color}>{event.event}: {event.date}</Text>
                ))}
                <Text mt={3} fontSize="sm" color={color}>
                    Abstract: {patent.abstract}
                </Text>
            </Box>
            ))}
        </VStack>
    );
};
