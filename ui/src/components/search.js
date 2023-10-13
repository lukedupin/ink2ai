import React, { useState } from 'react';
import { VStack, Box, Input, Text, LinkBox, LinkOverlay, useColorModeValue } from '@chakra-ui/react';

export const Search = ({ selectedHistory, onLinkClick, searchResults, onSearch }) => {
    const [search, setSearch] = useState("");
    const bg = useColorModeValue("gray.50", "gray.700");
    const color = useColorModeValue("black", "white");

    const hover = {
        bg: useColorModeValue("gray.100", "gray.600"),
        cursor: "pointer",
        transition: "0.3s"
    }

    const handleChange = (e) => {
        setSearch(e.target.value);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch(search);
            setSearch('')
        }
    }

    return (
        <VStack align="start"
                        spacing={3}
                        mb={6}
                        p={4}
                        bg={bg}
                        borderRadius="md"
                        boxShadow="xl"
                        borderColor="gray.200"
                        borderWidth={1}>
            <Input placeholder="Search..." size="lg" mb={4} borderColor="gray.300"
                   value={search}
                   onKeyDown={handleKeyDown}
                   onChange={handleChange}/>
            <Text fontSize="lg" fontWeight="bold" color={color}>
                Results for: {selectedHistory}
            </Text>
            {searchResults.map((result, i) => (
                <LinkBox
                    key={i}
                    onClick={() => onLinkClick(result)}
                    p={2}
                    borderRadius="md"
                    _hover={hover}
                    color={color}
                >
                    <LinkOverlay href="#">{result.title}</LinkOverlay>
                </LinkBox>
            ))}
        </VStack>
    );
}