'use client';

import { useMemo, useState } from 'react';

import { Box, Button, Flex } from '@chakra-ui/react';

import { 
  BitcoinWatchTable,
  Widget
} from '@shared/components/index';
import WatchForm from '@shared/components/bitcoin/WatchForm';

export default function Watches() {

  console.log('Render: Bitcoin watches page');
  const [showWatchForm, setShowWatchForm] = useState<boolean>(true);

  return (
    <Widget>
      <Flex justifyContent='end' flexDirection={{base: 'column', sm: 'row'}} gap={{base: 10}} >
          <Button width={{base: '50%', sm: 200}} h={12} onClick={() => setShowWatchForm(!showWatchForm) }> + Add a watch </Button>
      </Flex>

      <Box display='flex' flexDirection='column' gap='30px' marginTop={'30px'} marginX='auto' maxWidth={{base: '100%', xl: '80%', xxl: '45%'}}>
        {
          showWatchForm
          ? <WatchForm />
          : null
        }
      </Box>

      <Flex justifyContent='stretch' gap='10px'>
        <div>
          <h2 style={{marginTop: 10, marginBottom: 15}}> By address </h2>
          { useMemo(() => <BitcoinWatchTable />, []) }
        </div>
        <div>
          <h2 style={{marginTop: 10, marginBottom: 15}}> By *pub </h2>
          { useMemo(() => <BitcoinWatchTable />, []) }
        </div>
      </Flex>

    </Widget>
  )
}
