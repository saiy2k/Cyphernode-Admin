'use client';

import { useEffect, useMemo, useState } from 'react';

import { Box, Button, Flex, useToast } from '@chakra-ui/react';

import { 
  BitcoinBatchTable,
  Widget
} from '@shared/components/index';
import BatchForm from '@shared/components/bitcoin/BatchForm';
import { getCallProxy } from '@shared/services/api';
import { Batch } from '@shared/types';
import { useErrorHandler } from 'react-error-boundary';
import BatchTxnForm from '@shared/components/bitcoin/BatchTxnForm';

const emptyArray: Batch[] = [];
export default function Batches() {

  console.log('Render: Bitcoin batches page');
  
  const [showBatchForm, setShowBatchForm] = useState<boolean>(false);
  const [showBatchTxnForm, setShowBatchTxnForm] = useState<boolean>(false);

  const [ data, setData ] = useState<Batch[]>(emptyArray);
  const [ dataLoading, setDataLoading ] = useState<boolean>(true);

  const handleError = useErrorHandler();

  const toast = useToast();

  async function getBatches() {
    try {

      const endpoint = "listbatchers/1000";

      const response = await getCallProxy(endpoint);
      if (!response.ok) {
        const bodyResp = await response.json();
        throw new Error(response.status + ': ' + response.statusText + ': ' + JSON.stringify(bodyResp));
      }
      const batches = await response.json();
      // console.log(batches);
      return batches.result;
    } catch(err) {
      handleError(err);
      return emptyArray;
    }
  }

  async function getAndSetBatches() {
    setDataLoading(true);
    const batches = await getBatches();
    setData(batches);
    setDataLoading(false);
  }

  useEffect(() => {
    (async() => {
      getAndSetBatches();
    })();
  }, []);

  return (
    <Widget>
      <Flex justifyContent='end' flexDirection={{base: 'column', sm: 'row'}} gap={{base: 10}} >
      <Button width={{base: '50%', sm: 200}} h={12} onClick={() => setShowBatchTxnForm(!showBatchTxnForm) }> + Add transaction </Button>
          <Button width={{base: '50%', sm: 200}} h={12} onClick={() => setShowBatchForm(!showBatchForm) }> + Add a batch </Button>
      </Flex>

      <Box display='flex' flexDirection='column' gap='30px' marginTop={'30px'} marginX='auto' maxWidth={{base: '100%', xl: '80%', xxl: '45%'}}>
        {
          showBatchTxnForm
          ? <BatchTxnForm
              batches={data}
              onAddToBatch={() => {
                setShowBatchTxnForm(false);
                getAndSetBatches();
              }}
            />
          : null
        }

        {
          showBatchForm
          ? <BatchForm
              onBatchSave={getAndSetBatches}
            />
          : null
        }
      </Box>

      <Flex justifyContent='stretch'>
        <div style={{width: '100%'}}>
          <h2 style={{marginTop: 10, marginBottom: 15}}> Batches </h2>
          { useMemo(() => <BitcoinBatchTable isLoading={dataLoading} data={data} onEdit={(batchObject: Batch) => getAndSetBatches()} />, [data, dataLoading]) }
        </div>
      </Flex>

    </Widget>
  )
}
