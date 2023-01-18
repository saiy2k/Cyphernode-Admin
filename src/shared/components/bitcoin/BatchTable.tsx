import React, { useEffect, useState } from 'react';

import { default as NLink } from 'next/link';

import {
  chakra,
  Flex,
  Select,
  useToast,
} from '@chakra-ui/react';

import {
  ColumnFiltersState,
  PaginationState,
  ColumnFilter,
  SortingState,
} from '@tanstack/react-table';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { CustomColumnDef, Batch, ClientCustomColumnDef } from '@shared/types';
import { getCallProxy, postCallProxy } from '@shared/services/api';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';

import ServerDataTable, { FilterProps } from '../ServerDataTable';

import { DebouncedInput } from 'shared/components/DebouncedInput';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import ClientDataTable from '../ClientDataTable';
import { BatchDetail } from './BatchTableDetail';

type BitcoinBatchTable = {
  data: Batch[];
  isLoading: boolean;

  onEdit?: (batchObject: Batch) => void;
};

export const BitcoinBatchTable = ({
  data,
  isLoading,
  onEdit,
}: BitcoinBatchTable) => {

  console.log('Render: BitcoinBatchTable');

  const toast = useToast();
  const handleError = useErrorHandler();

  const [isUpdating, setIsUpdating] = useState(false);

  const columns: ClientCustomColumnDef<Batch>[] = [{
    id: 'batcherId',
    accessorKey: 'batcherId',
    header: () => <chakra.span> # </chakra.span>,
    cell: (info: any) => info.getValue(),
    width: '50px',
    enableColumnFilter: false,
    enableSorting: false,
    fieldType: 'text',
  }, {
    id: 'batcherLabel',
    accessorKey: 'batcherLabel',
    header: () => <span> Label </span>,
    cell: (info: any) => <NLink style={{textDecoration: 'underline'}} href={`/bitcoin/batches/${info.row.original.batcherId}`}>{(info.getValue() as any).slice(0, 12) + '...'}</NLink>,
    width: 'auto',
    fieldType: 'text',
  }, {
    id: 'confTarget',
    accessorKey: 'confTarget',
    header: () => <span> Target </span>,
    cell: (info: any) => info.getValue(),
    width: 'auto',
    fieldType: 'number',
  }, {
    id: 'status',
    accessorKey: 'status',
    header: () => <span> Status </span>,
    cell: (info: any) => info.getValue(),
    width: 'auto',
    fieldType: 'select',
    options: [{
      id: 'active',
      text: 'Active'
    },{
      id: 'executed',
      text: 'Executed'
    }]
  }, {
    id: 'nbOutputs',
    accessorKey: 'nbOutputs',
    header: () => <span> Txn Count </span>,
    cell: (info: any) => info.getValue(),
    width: 'auto',
    fieldType: 'number',
  }, {
    id: 'total',
    accessorKey: 'total',
    header: () => <span> Amount </span>,
    cell: (info: any) => info.getValue(),
    width: 'auto',
    fieldType: 'number',
  }];

  const updateBatch = async (batch: Batch) => {
    setIsUpdating(true);

    const payload = {
      batcherId: batch.batcherId,
      confTarget: Number(batch.confTarget),
      batcherLabel: batch.batcherLabel,
    }

    try {
      const serverResp = await postCallProxy("updatebatcher", payload);
      console.log("serverResp", serverResp);
      if (!serverResp.ok) {
        let errorString = serverResp.status + ": " + serverResp.statusText;
        if (serverResp.body) {
          const serverError = await serverResp.json();
          errorString =
            errorString +
            ": " +
            (serverError.message
              ? serverError.message
              : JSON.stringify(serverError));
        }
        throw new Error(errorString);
      }
      // const response = await serverResp.json();
      toast({
        title: "Updated batch",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <ClientDataTable
      data={data}
      columnDef={columns}
      isLoading={isLoading}
      columnsToHideInMobile={["confTarget", "nbOutputs", "total"]}
      detailComp={(props) => (
        <BatchDetail
          {...props}
          isUpdating={isUpdating}
          onEdit={async (batchObject: Batch) => {
            await updateBatch(batchObject);

            if(onEdit) {
              onEdit(batchObject);
            }

            props.closeHandler();
          }}
        />
      )}
    />
  )
}

const BitcoinBatchTableWithErrorBoundary = withErrorBoundary(BitcoinBatchTable, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Batch table' />)
});

export default BitcoinBatchTableWithErrorBoundary;