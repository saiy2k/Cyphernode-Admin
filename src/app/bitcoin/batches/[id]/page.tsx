'use client';

import { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Box, Button, Flex, Skeleton, SkeletonText, useToast } from '@chakra-ui/react';

import {
  LoaderOverlay,
  Widget
} from '@shared/components/index';
import BatchForm from '@shared/components/bitcoin/BatchForm';
import { postCallProxy } from '@shared/services/api';
import { Batch } from '@shared/types';
import { useErrorHandler } from 'react-error-boundary';
import BatchTxnTable from '@shared/components/bitcoin/BatchTxnTable';
import dayjs from 'dayjs';
import BatchTxnForm from '@shared/components/bitcoin/BatchTxnForm';
import ConfirmationDialog from '@shared/ConfirmationModal';

const initialData: Batch = {
  batcherId: 0,
  batcherLabel: '',
  confTarget: 0,
  nbOutputs: 0,
  oldest: '',
  total: 0,
  txid: '',
  hash: '',
  outputs: [],
};

type BatchesProps = {
  params?: {
    id?: string;
  };
};

export default function Batches({
  params,
}: BatchesProps) {
  const router = useRouter();

  const id = params?.id;

  const [showBatchForm, setShowBatchForm] = useState<boolean>(false);
  const [showBatchTxnForm, setShowBatchTxnForm] = useState<boolean>(false);

  const [ data, setData ] = useState<Batch>(initialData);
  const [ dataLoading, setDataLoading ] = useState<boolean>(true);

  const [ executeLoading, setExecuteLoading ] = useState<boolean>(false);

  const handleError = useErrorHandler();

  const toast = useToast();

  const details = [
    {
      key: 1,
      left: {
        label: 'Label',
        value: data.batcherLabel,
      },
      right: {
        label: 'Txn count',
        value: data.nbOutputs,
      },
    },
    {
      key: 2,
      left: {
        label: 'Conf Target',
        value: data.confTarget,
      },
      right: {
        label: 'Amount',
        value: data.total,
      },
    },
    {
      key: 3,
      left: {
        label: 'Executed on',
        value: dayjs(data.oldest).format("DD-MMM-YYYY HH:mm:ss"),
      },
      right: {
        label: 'Approx. Savings',
        // TODO replace arbitrary savings with proper savings
        value: '73%'
      },
    },
  ];

  async function getBatch() {
    if(!id) {
      return;
    }

    try {
      const endpoint = "getbatchdetails";

      const response = await postCallProxy(endpoint, {batcherId: Number(id)});
      if (!response.ok) {
        const bodyResp = await response.json();
        throw new Error(response.status + ': ' + response.statusText + ': ' + JSON.stringify(bodyResp));
      }
      const batches = await response.json();
      return batches.result;
    } catch(err) {
      handleError(err);
      return initialData;
    } finally {
      setDataLoading(false);
    }
  }

  async function executeBatch() {
    setExecuteLoading(true);

    try {
      const endpoint = "batchspend";

      const response = await postCallProxy(endpoint, {batcherId: Number(id), confTarget: data.confTarget});
      if (!response.ok) {
        const bodyResp = await response.json();
        throw new Error(response.status + ': ' + response.statusText + ': ' + JSON.stringify(bodyResp));
      }
      const batches = await response.json();
      if (batches.error !== null) {
        throw new Error(JSON.stringify(batches));
      } else {
        toast({
          title: 'Executed batch',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch(err) {
      handleError(err);
      return initialData;
    } finally {
      setExecuteLoading(false);
      getAndSetBatch();
    }
  }

  async function getAndSetBatch() {
    setDataLoading(true);
    const batch = await getBatch()
    console.log('getAndSetBatch => ', batch);
    setData(batch);
    setDataLoading(false);
  }

  useEffect(() => {
    (async() => {
      getAndSetBatch();
    })();
  }, []);

  return (
    <Widget>
      <Flex justifyContent='end' flexDirection={{base: 'column', sm: 'row'}} gap={{base: 10}} >
        <ConfirmationDialog
          deleteTrigger={(props: any) => <Button {...props} width={{base: '50%', sm: 200}} h={12}> Execute </Button>}
          onDialogClose={(confirm: boolean) => {
            if(confirm) {
              executeBatch();
            }
          }}
          title="Execute confirmation"
          message="Are you sure, you want to execute transactions this batch?"
        />
        <Button width={{base: '50%', sm: 200}} h={12} onClick={() => setShowBatchTxnForm(!showBatchTxnForm) }> + Add transaction </Button>
        <Button width={{base: '50%', sm: 200}} h={12} onClick={() => setShowBatchForm(!showBatchForm) }> + Add a batch </Button>
      </Flex>

      <Box display='flex' flexDirection='column' gap='30px' marginTop={'30px'} marginX='auto' maxWidth={{base: '100%', xl: '80%', xxl: '45%'}}>
        {
          showBatchTxnForm
          ? <BatchTxnForm
            batchId={Number(id)}
            onAddToBatch={() => getAndSetBatch()}
            />
          : null
        }

        {
          showBatchForm
          ? <BatchForm
              onBatchSave={() => router.push("/bitcoin/batches")}
            />
          : null
        }
      </Box>

      <Widget marginY="30px" variant="border">
        <Flex flexDirection='column' gap='10px'>
        {
            dataLoading
            ? details.map(detail => (
                <Flex key={detail.key} gap='20px' flexDirection={{base: 'column', sm: 'row'}}>
                  {
                    !(detail.left)
                    ? null
                    : (
                        <Flex flex={1} gap='10px' flexDirection={{base: 'column', sm: 'row'}}>
                          <Skeleton borderRadius='5px' height='25px' width="200px" />
                        </Flex>
                      )
                  }
                  {
                    !(detail.right)
                    ? null
                    : (
                        <Flex flex={1} gap='10px' flexDirection={{base: 'column', sm: 'row'}}>
                          <Skeleton borderRadius='5px' height='25px' width="200px" />
                        </Flex>
                      )
                  }
                </Flex>
              ))
            : details.map(detail => (
                <Flex key={detail.key} gap='20px' flexDirection={{base: 'column', sm: 'row'}}>
                  {
                    !(detail.left)
                    ? null
                    : (
                        <Flex flex={1} gap='10px' flexDirection={{base: 'column', sm: 'row'}}>
                          <Box fontWeight="bold">{detail.left.label}</Box>
                          <Box>{detail.left.value}</Box>
                        </Flex>
                      )
                  }
                  {
                    !(detail.right)
                    ? null
                    : (
                        <Flex flex={1} gap='10px' flexDirection={{base: 'column', sm: 'row'}}>
                          <Box fontWeight="bold">{detail.right.label}</Box>
                          <Box>{detail.right.value}</Box>
                        </Flex>
                      )
                  }
                </Flex>
            ))
          }

        </Flex>
      </Widget>

      <Flex justifyContent='stretch'>
        <div style={{width: '100%'}}>
          <h2 style={{marginTop: 10, marginBottom: 15}}> Transactions </h2>
          { useMemo(() => (
              <BatchTxnTable
                isLoading={dataLoading}
                data={data.outputs || []}
                onRemove={() => getAndSetBatch()}
              />
            ), [data, dataLoading]) }
        </div>
      </Flex>

      {executeLoading ? <LoaderOverlay> Executing batch... </LoaderOverlay>: null }
    </Widget>
  )
}
