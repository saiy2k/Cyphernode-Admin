'use client';
import { useMemo, useState } from 'react';

import {
  Box,
  Button,
  Flex,
} from '@chakra-ui/react';

import { Widget, WasabiTxnTable } from '@shared/components';
import WasabiSendForm from '@shared/components/wasabi/WasabiSendForm';
import WasabiReceive from '@shared/components/wasabi/WasabiReceive';
import WasabiBalances from '@shared/components/wasabi/WasabiBalance';

export default function Wasabi() {

  console.log('Render: Wasabi page');
  const [showSend, setShowSend] = useState<boolean>(false);
  const [showReceive, setShowReceive] = useState<boolean>(false);

  return (
    <Widget>
      <Flex justifyContent='space-between' flexDirection={{base: 'column', xl: 'row'}} gap={{base: 10}} >

      <WasabiBalances />

        <Flex gap={30} justifyContent='center'>
          <Button width={{base: '50%', sm: 200}} h={12} onClick={() => setShowSend(!showSend) }> Send </Button>
          <Button width={{base: '50%', sm: 200}} h={12} onClick={() => setShowReceive(!showReceive) }> Receive </Button>
        </Flex>

      </Flex>

      <Box display='flex' flexDirection='column' gap='30px' marginTop={'30px'} marginX='auto' maxWidth={{base: '100%', xl: '80%', xxl: '45%'}}>
        {showSend ? <WasabiSendForm /> : null }
        {showReceive ? <WasabiReceive /> : null }
      </Box>

      <h2 style={{marginTop: 10, marginBottom: 15}}> Transactions </h2>
      
      { useMemo(() =>  <WasabiTxnTable />, []) }

    </Widget>
  )
}
