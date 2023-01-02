'use client';

import { useState } from 'react';

import { Box, Button, Flex } from '@chakra-ui/react';

import { 
  BitcoinReceiveWidget,
  BitcoinSendWidget,
  BitcoinTxnTable,
  Widget
} from '@shared/components/index';

import OnChainBalance from '@shared/components/bitcoin/OnChainBalance';

export default function Bitcoin() {

  console.log('Render: Bitcoin page');
  const [showSend, setShowSend] = useState<boolean>(false);
  const [showReceive, setShowReceive] = useState<boolean>(false);

  return (
    <Widget>
      <Flex justifyContent='space-between' flexDirection={{base: 'column', sm: 'row'}} gap={{base: 10}} >

        <OnChainBalance />

        <Flex gap={30}>
          <Button width={{base: '50%', sm: 200}} h={12} onClick={() => setShowSend(!showSend) }> Send </Button>
          <Button width={{base: '50%', sm: 200}} h={12} onClick={() => setShowReceive(!showReceive) }> Receive </Button>
        </Flex>

      </Flex>

      <Box display='flex' flexDirection='column' gap='30px' marginTop={'30px'} marginX='auto' maxWidth={{base: '100%', xl: '80%', xxl: '45%'}}>
        {showSend ? <BitcoinSendWidget /> : null }
        {showReceive ? <BitcoinReceiveWidget /> : null }
      </Box>

      <h2 style={{marginTop: 30, marginBottom: 15}}> Transactions </h2>
      
      <BitcoinTxnTable />

    </Widget>
  )
}
