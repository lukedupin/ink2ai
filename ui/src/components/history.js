import React from 'react';
import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';

export const History = ({ historyIdx, onHistoryClick, historyData }) => {
    const bg = useColorModeValue("gray.50", "gray.700");
    const color = useColorModeValue("black", "white");
    const selected_color = useColorModeValue("green", "white");

    const hover = {
        bg: useColorModeValue("gray.100", "gray.600"),
        cursor: "pointer",
        transition: "0.3s"
    }

    return (
        <VStack align="start" spacing={3} p={4} bg={bg} borderRadius="md" boxShadow="xl" borderColor="gray.200" borderWidth={1}>
            <Text fontSize="lg" fontWeight="bold" color={color}>History</Text>
            {historyData.length <= 0 &&
            <Box p={2} borderRadius="md" _hover={hover}>
                <Text>None</Text>
            </Box>
            }
            {Object.entries(historyData).reverse().map(([idx, item]) => (
                <Box
                    key={idx}
                    onClick={() => onHistoryClick(idx)}
                    p={2}
                    borderRadius="md"
                    _hover={hover}
                    color={(historyIdx == idx)? selected_color: color}
                >
                    <Text>{`${item.length} Claim${item.length != 1? 's': ''}`}</Text>
                </Box>
            ))}
        </VStack>
    );
}
