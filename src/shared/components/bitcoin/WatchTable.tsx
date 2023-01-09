import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';

import {
  chakra,
  Button,
  Flex,
  Icon,
  Input,
  Select,
  useBreakpoint,
} from '@chakra-ui/react';

import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { IoChevronDownCircleOutline, IoChevronDownCircle, IoChevronUpCircle } from 'react-icons/io5';
import {
  Column,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  Table,
  useReactTable,
  PaginationState,
  ColumnFilter,
  SortingState,
} from '@tanstack/react-table';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { Widget, Cell } from '@shared/components/index';
import { CustomColumnDef, Watch, SuccessResponse } from '@shared/types';
import { TxnDetail } from './TxnTableDetail';
import { dummyWatchDataForSkeleton } from '@shared/constants';
import { getCallProxy } from '@shared/services/api';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';
import { DebouncedInput } from 'shared/components/DebouncedInput';

import { LoadingTable } from './TxnLoadingTable';
import ServerDataTable from '../ServerDataTable';
import {WatchDetail} from './WatchTableDetail';

// TODO: Move this file, TxnLoadingTable into /shared/components/txn-table/*
export const BitcoinWatchTable = () => {

  console.log('Render: BitcoinWatchTable');

  const [ watchData, setWatchData ] = useState<Watch[]>([]);
  const [ dataLoading, setDataLoading ] = useState<boolean>(true);
  const [ pageCount, setPageCount ] = useState(0);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{
    id: "time",
    desc: true
  }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);

  const handleError = useErrorHandler();

  useEffect(() => {

    setDataLoading(true);

    (async() => {
      console.log('Home :: useEffect :: call API :: getactivewatches');
      try {

        const filters = reduceColumnFilters(columnFilters);
        const sortColumn = sorting.length === 1 ? sorting[0].id : '';
        const sortDirection = sorting.length === 1 ? sorting[0].desc ? 'DESC' : 'ASC' : '';

        const response = await getCallProxy('getactivewatches');
        if (!response.ok) {
          const bodyResp = await response.json();
          throw new Error(response.status + ': ' + response.statusText + ': ' + JSON.stringify(bodyResp));
        }
        const watches = await response.json();
        setWatchData(watches.watches);
        setPageCount(watches.watches.pageCount);
        setDataLoading(false);
      } catch(err) {
        setDataLoading(false);
        setWatchData([]);
        setPageCount(0);
        handleError(err);
      }
    })();

  }, [pageIndex, pageSize, columnFilters, sorting]);

  const columns = [{
    id: 'id',
    accessorKey: 'id',
    header: () => <chakra.span> # </chakra.span>,
    cell: (info: any) => info.getValue(),
    width: '50px',
    enableColumnFilter: false,
    enableSorting: false,
  }, {
    id: 'address',
    accessorKey: 'address',
    header: () => <span> Address </span>,
    cell: (info: any) => (info.getValue() as any).slice(0, 12) + '...',
    width: 'auto',
  }, {
    id: 'label',
    accessorKey: 'label',
    header: () => <span> Label </span>,
    cell: (info: any) => info.getValue(),
    width: 'auto',
  }];

  return (
    <ServerDataTable
      data={watchData} 
      isLoading={false}
      columnDef={columns}

      columnFilters={columnFilters}
      pageIndex={pageIndex}
      pageSize={pageSize}
      sorting={sorting}

      onColumnFiltersChange={setColumnFilters}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}

      DetailComp={WatchDetail}
    />
  )
}

const BitcoinWatchTableWithErrorBoundary = withErrorBoundary(BitcoinWatchTable, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Watch table' />)
});

export default BitcoinWatchTableWithErrorBoundary;

function reduceColumnFilters(columnFilters: ColumnFiltersState) {
  return columnFilters.reduce((prev: any, cur: ColumnFilter & {value: any}) => {
    switch(cur.id) {
      case 'type':
      prev['type'] = cur.value.toLowerCase();
        break;
      case 'time':
      if(cur.value[0] !== undefined) {
        prev['start'] = new Date(cur.value[0] * 1000).toISOString();
      }

        if(cur.value[1] !== undefined) {
          prev['end'] = new Date(cur.value[1] * 1000).toISOString();
        }
        break;
      case 'amount':
      if(cur.value[0]) {
        prev['amountMin'] = Number(cur.value[0]);
      }

        if(cur.value[1]) {
          prev['amountMax'] = Number(cur.value[1]);
        }
        break;
      case 'confirmations':
      prev['status'] = cur.value.toLowerCase();
        break;
    }

    return prev;
  }, {} as any);


}
