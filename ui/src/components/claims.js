import React, { useState } from 'react';
import { VStack, Box, Checkbox, Input, Text, LinkBox, LinkOverlay, useColorModeValue } from '@chakra-ui/react';

export const Claims = (props) => {
    const { id, claims, claimUids, onLinkClick, onSearch } = props;

    const [state, setState] = useState({
        search: '',
        edit_claim_uid: null,
    })
    const { search, edit_claim_uid } = state;

    const bg = useColorModeValue("gray.50", "gray.700");
    const color = useColorModeValue("black", "white");

    const hover = {
        bg: useColorModeValue("gray.100", "gray.600"),
        cursor: "pointer",
        transition: "0.3s"
    }

    const handleChange = (e) => {
        setState(prev => ({ ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch(search);
            setState(prev => ({ ...prev,
                search: ''
            }))
        }
    }

    const handleLinkClick = (claim) => {
        setState(prev => ({ ...prev,
            edit_claim_uid: claim.claim_uid
        }))
    }

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
            <Input placeholder="Search claim..." size="lg" mb={4} borderColor="gray.300"
                   name="search"
                   value={search}
                   onKeyDown={handleKeyDown}
                   onChange={handleChange}
                   autoFocus/>
            {claimUids.length > 0 &&
            <Text fontSize="lg" fontWeight="bold" color={color}>
                Features
            </Text>
            }
            {Object.entries(claimUids).map(([idx, claim_uid]) => (
                <LinkBox
                    key={idx}
                    onClick={() => handleLinkClick(claim_uid)}
                    p={2}
                    borderRadius="md"
                    _hover={hover}
                    color={color}
                >
                    {false && <Checkbox isChecked={edit_claim_uid === claim_uid} colorScheme="green" size="lg" mr={2} />}
                    <LinkOverlay href="#">{parseInt(idx)+1}. {claims[claim_uid].claim}</LinkOverlay>
                </LinkBox>
            ))}
        </VStack>
    );
}
