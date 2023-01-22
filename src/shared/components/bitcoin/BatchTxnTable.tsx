import React, { useState } from 'react';


import {
  chakra,
  Icon,
  useToast,
} from '@chakra-ui/react';

import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';
import dayjs from 'dayjs';
import { MdDelete } from 'react-icons/md';


import { ClientCustomColumnDef, BatchTxn } from '@shared/types';
import { postCallProxy } from '@shared/services/api';
import ClientDataTable from '../ClientDataTable';
import ConfirmationDialog from '@shared/ConfirmationModal';

type BitcoinBatchTable = {
  data: BatchTxn[];
  isLoading: boolean;
  onRemove: () => void;
};

export const BatchTxnTable = ({
  data,
  isLoading,
  onRemove,
}: BitcoinBatchTable) => {

  console.log('Render: BitcoinBatchTable');

  const toast = useToast();
  const handleError = useErrorHandler();

  const [isRemoving, setIsRemoving] = useState(false);

  const SATS_IN_A_BITCOIN = 100000000;

  async function removeFromBatch(outputId: number) {
    

    setIsRemoving(true);
    try {
      const serverResp = await postCallProxy('removefrombatch', {outputId});
      if (!serverResp.ok) {
        // debugger;
        let errorString = serverResp.status + ': ' + serverResp.statusText;
        if (serverResp.body) {
          const serverError = await serverResp.json();
          // debugger;
          errorString = errorString + ': ' + (serverError.message ? serverError.message : JSON.stringify(serverError));
        }
        throw new Error(errorString);
      }
      const response = await serverResp.json();
      if (response.error !== null) {
        throw new Error(JSON.stringify(response));
      } else {
        toast({
          title: 'Removed from batch',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (err: unknown) {
      handleError(err);
    } finally {
      setIsRemoving(false);
      onRemove();
    }
  }

  const columns: ClientCustomColumnDef<BatchTxn>[] = [
    {
        id: 'outputId',
        accessorKey: 'outputId',
        header: () => <chakra.span> # </chakra.span>,
        cell: (info: any) => info.getValue(),
        width: '50px',
        enableColumnFilter: false,
        enableSorting: false,
        fieldType: 'text',
    },
    {
        id: 'date',
        accessorKey: 'addedTimestamp',
        header: () => <span> Date </span>,
        cell: (info: any) => dayjs(info.getValue()).format("DD-MMM-YYYY HH:mm:ss"),
        width: 'auto',
        fieldType: 'date',
    },
    {
        id: 'amount',
        accessorFn: (row: any) => row.amount,
        header: () => <span> Sats </span>,
        cell: (info: any) => info.getValue(),
        width: 'auto',
        fieldType: 'number',
    },
    {
        id: 'additional-actions',
        cell: (props: any) => (
          <ConfirmationDialog
            deleteTrigger={(props: any) => <Icon {...props} as={MdDelete} w={6} h={6} />}
            onDialogClose={(confirm: boolean) => {
              if(confirm) {
                removeFromBatch(props.row.original.outputId);
              }
            }}
            title="Remove confirmation"
            message="Are you sure, you want to remove this transaction?"
          />
        ),
        width: '50px',
    } as any,
  ];

  return (
    <ClientDataTable
      data={data}
      columnDef={columns}
      isLoading={isLoading || isRemoving}
      columnsToHideInMobile={["txnId", "fee"]}
    />
  )
}

const BitcoinBatchTableWithErrorBoundary = withErrorBoundary(BatchTxnTable, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Batch table' />)
});

export default BitcoinBatchTableWithErrorBoundary;
