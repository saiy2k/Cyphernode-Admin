'use client';

import {
  Button,
  chakra,
  Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup,
  Text,
  Box,
} from '@chakra-ui/react';
import { Widget } from '@shared/components';
import GetInfo from '@shared/components/ots/GetInfo';
import Stamp from '@shared/components/ots/Stamp';

const WIDTH = {
  base: '90%',
  md: '75%'
};

export default function Ots() {
  return (
    <Flex minH='30vh' align='center' justify='center' flexDirection='column' gap={5}>
      <Box width={WIDTH} marginTop={10}>
        <Text as='h2' marginBottom={15}> OTS </Text>
      </Box>

      <Flex flexDirection='column' width={WIDTH} gap={10}>
        <Stamp />
        <GetInfo />
      </Flex>
    </Flex>
  )
}
