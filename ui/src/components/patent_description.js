import React from 'react';
import { Divider, VStack, Box, useColorModeValue, Text } from '@chakra-ui/react';

export const PatentDescription = (props) => {
    const {id, claimUids, claims, patents, patentClaimMatches} = props

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
            <Text fontSize="lg" fontWeight="bold" color={color}>Patents</Text>
            {patents.filter(x => x.uid in patentClaimMatches ).map((patent, idx) => (
            <Box key={idx} variant="striped">
                <Divider/>
                <Text fontSize="lg" fontWeight="bold" color={color}>
                    Reference {patent.app_id}
                </Text>
                <Divider/>

                {claimUids.filter(x => x in patentClaimMatches[patent.uid]).map((claim_uid, idx) => {
                    const matches = patentClaimMatches[patent.uid][claim_uid]
                    return (
                        <Box key={`patent_${idx}`}>
                            <Text mb={3} fontSize="sm" fontWeight="bold" color={color}>Claim {idx+1}: {claims[claim_uid].claim} </Text>
                            {matches.map((match, idx) => (
                                <Text key={`match_${idx}`} mb={3} fontSize="sm" color={color}>
                                    {patent.description.substring(match.min_match, match.max_match)}
                                </Text>
                            ))}
                        </Box>
                    )
                })}
            </Box>
            ))}
        </VStack>
    );
};
