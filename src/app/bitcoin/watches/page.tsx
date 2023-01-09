'use client';

import { useState } from 'react';

import { Button, Flex } from '@chakra-ui/react';

import { 
  BitcoinWatchTable,
  Widget
} from '@shared/components/index';

export default function Watches() {

  console.log('Render: Bitcoin watches page');
  const [showSend, setShowSend] = useState<boolean>(false);
  const [showReceive, setShowReceive] = useState<boolean>(false);

  return (
    <Widget>
      <Flex justifyContent='end' flexDirection={{base: 'column', sm: 'row'}} gap={{base: 10}} >
          <Button width={{base: '50%', sm: 200}} h={12} onClick={() => setShowSend(!showSend) }> + Add a watch </Button>
      </Flex>

      <Flex justifyContent='stretch' gap='10px'>
        <div>
          <h2 style={{marginTop: 10, marginBottom: 15}}> By address </h2>
          <BitcoinWatchTable />
        </div>
        <div>
          <h2 style={{marginTop: 10, marginBottom: 15}}> By *pub </h2>
          <BitcoinWatchTable />
        </div>
      </Flex>

    </Widget>
  )
}
