import React from 'react';
import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';

export const Overview = ({ onScroll }) => {
    const bg = useColorModeValue("gray.50", "gray.700");
    const color = useColorModeValue("black", "white");

    const hover = {
        bg: useColorModeValue("gray.100", "gray.600"),
        cursor: "pointer",
        transition: "0.3s"
    }

    return (
        <VStack align="start" spacing={3} p={4} bg={bg} borderRadius="md" boxShadow="xl" borderColor="gray.200" borderWidth={1}>
            <Text fontSize="lg" fontWeight="bold" color={color}>Overview</Text>
            <Box p={2} borderRadius="md" _hover={hover}>
                <Text onClick={e => onScroll('claims')}>Claims</Text>
            </Box>
            <Box p={2} borderRadius="md" _hover={hover}>
                <Text onClick={e => onScroll('patent_table')}>Overlap table</Text>
            </Box>
            <Box p={2} borderRadius="md" _hover={hover}>
                <Text onClick={e => onScroll('claim_cluster')}>Visualization</Text>
            </Box>
            <Box p={2} borderRadius="md" _hover={hover}>
                <Text onClick={e => onScroll('patent_abstract')}>Abstracts</Text>
            </Box>
            <Box p={2} borderRadius="md" _hover={hover}>
                <Text onClick={e => onScroll('patent_description')}>Patents</Text>
            </Box>
        </VStack>
    );
}
