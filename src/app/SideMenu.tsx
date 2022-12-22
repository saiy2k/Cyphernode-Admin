import {
  Box,
  useColorModeValue
} from "@chakra-ui/react";

export default function SideMneu() {

  return (
    <Box 
      p={5} w='320px' 
      display={{base: 'none', lg: 'flex'}} 
      height='100%' 
      minW={200} 
      maxW={250} 
      flexDirection='column' 
      bg={useColorModeValue('gray.100', 'gray.700')}
      flex={1}>
      Side menu
    </Box>
  );
}
