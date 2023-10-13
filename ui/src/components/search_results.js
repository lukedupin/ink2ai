import React from 'react';
import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';

export const SearchResults = ({ selectedLink }) => {
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
                <Text>Claims</Text>
            </Box>
            <Box p={2} borderRadius="md" _hover={hover}>
                <Text>Overlap table</Text>
            </Box>
            <Box p={2} borderRadius="md" _hover={hover}>
                <Text>Visualization</Text>
            </Box>
        </VStack>
    );
}
