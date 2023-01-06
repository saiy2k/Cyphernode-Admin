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
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { Widget, Cell } from '@shared/components/index';
import { CustomColumnDef, Txn, SuccessResponse } from '@shared/types';
import { TxnDetail } from './TxnTableDetail';
import { dummyTxnDataForSkeleton } from '@shared/constants';
import { getCallProxy } from '@shared/services/api';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';
import { DebouncedInput } from 'shared/components/DebouncedInput';

import { LoadingTable } from './TxnLoadingTable';

// TODO: Move this file, TxnLoadingTable into /shared/components/txn-table/*
export const BitcoinTxnTable = () => {

  console.log('Render: BitcoinTxnTable');

  const [ txData, setTxData ] = useState<Txn[]>([]);
  const [ txnDataLoading, setTxnDataLoading ] = useState<boolean>(true);
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

  const breakpoint = useBreakpoint({ssr: false});
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);

  const handleError = useErrorHandler();

  useEffect(() => {

    setTxnDataLoading(true);

    (async() => {
      console.log('Home :: useEffect :: call API :: txns');
      try {

        const filters = reduceColumnFilters(columnFilters);
        const sortColumn = sorting.length === 1 ? sorting[0].id : '';
        const sortDirection = sorting.length === 1 ? sorting[0].desc ? 'DESC' : 'ASC' : '';

        const response = await getCallProxy('txns', { perPage: pageSize, page: pageIndex, ...filters, sortColumn, sortDirection });
        if (!response.ok) {
          const bodyResp = await response.json();
          throw new Error(response.status + ': ' + response.statusText + ': ' + JSON.stringify(bodyResp));
        }
        const txns: SuccessResponse = await response.json();
        setTxData(txns.data);
        setPageCount(txns.meta.pageCount);
        setTxnDataLoading(false);
      } catch(err) {
        setTxnDataLoading(false);
        setTxData([]);
        setPageCount(0);
        handleError(err);
      }
    })();

  }, [pageIndex, pageSize, columnFilters, sorting]);

  const columns = useMemo<CustomColumnDef<Txn>[]>(() => [{
    id: 'type',
    accessorKey: 'category',
    header: () => <chakra.span> Type </chakra.span>,
    cell: info => info.getValue(),
    fieldType: 'select',
    options: ["generate", "immature", "receive", "send"],
    width: 'auto',
  }, {
    id: 'time',
    accessorKey: 'time',
    header: () => <span> Time </span>,
    cell: info => new Date((info.getValue() as any) * 1000).toLocaleString(),
    width: 'auto',
  }, {
    id: 'amount',
    accessorKey: 'amount',
    header: () => <span> btc </span>,
    cell: info => (info.getValue() as any).toFixed(8),
    fieldType: 'number',
    width: '150px',
  }, {
    id: 'txid',
    accessorKey: 'txid',
    header: () => <span> Tx id </span>,
    cell: info => (info.getValue() as any).slice(0, 12) + '...',
    enableSorting: true,
    width: 'auto',
  }, {
    id: 'confirmations',
    // accessorKey: 'confirmations',
    accessorFn: (row) => (Boolean(row.confirmations) && row.confirmations > 0) ?'Confirmed': 'Pending',
    header: () => <span> Status </span>,
    cell: (info) => info.cell.row.original.confirmations ===0 ? 'Pending': `Confirmation(${info.cell.row.original.confirmations})`,
    fieldType: 'select',
    options: ["pending", "confirmed"],
    width: 'auto',
  }, {
    id: 'actions',
    cell: props => props.row.index === selectedRowIndex ? <Icon as={MdExpandMore} w={6} h={6} />: <Icon as={MdExpandLess} w={6} h={6} />,
    width: '50px'
  }], [selectedRowIndex]);

  useEffect(() => {
    const columnsToToggle = ['txid', 'confirmations'];

    if(['base', 'sm', 'md'].includes(breakpoint)) {
      table.getAllColumns().map(column => {
        if(columnsToToggle.includes(column.id)) {
          column.toggleVisibility(false);
        }
      });
    } else {
      table.getAllColumns().map(column => {
        if(columnsToToggle.includes(column.id)) {
          column.toggleVisibility(true);
        }
      });
    }
  }, [breakpoint]);


  const table = useReactTable({
    data: txnDataLoading ? dummyTxnDataForSkeleton: txData,
    columns,
    state: {
      columnFilters,
      pagination: { pageIndex, pageSize },
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount,
    onSortingChange: setSorting,
  });

  const hydrated = useRef(false);

  useEffect(() => {
    if(!hydrated.current) {
      hydrated.current = true;
    }
  }, []);

  return (
    <Widget variant='border' style={{ position: 'relative', overflowX: 'auto' }}>
      <table>

        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const columnDef = (header.column.columnDef as CustomColumnDef<Txn>);
                return (
                  <th key={header.id} style={{width: columnDef.width}}>
                    {header.isPlaceholder
                      ? null
                      :
                      (
                        <Flex flexDirection='column' gap={'5px'} marginBottom={'15px'}>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                                onClick: header.column.getToggleSortingHandler(),
                            }}
                            style={{textAlign: 'center'}}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {
                              header.column.getCanSort()
                                ? header.column.getIsSorted()
                                ? header.column.getIsSorted() === 'asc'
                                ? <Icon as={IoChevronUpCircle} />
                                : <Icon as={IoChevronDownCircle} />
                                : <Icon as={IoChevronDownCircleOutline} />
                                : null
                            }
                          </div>
                          {header.column.getCanFilter() ? (
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                              <Filter selectedDates={selectedDates} setSelectedDates={setSelectedDates} column={header.column} table={table} loading={!hydrated.current || txnDataLoading} />
                            </div>
                          ) : null}
                        </Flex>
                      )
                    }
                  </th>
              )})}
            </tr>
          ))}
        </thead>

        {
          !hydrated.current || txnDataLoading
          ?
            <LoadingTable table={table} />
          :
            <tbody>

            {table.getCoreRowModel().rows.length === 0 ? <tr> <chakra.th colSpan={5} textAlign="center" pt={12} pb={8}>
              <h2> Empty results </h2> 
              <h6> Refine your filters </h6> 
            </chakra.th> </tr> : null }

            {table.getCoreRowModel().rows.map((row, index: number) => (

              <React.Fragment key={row.id}>
                <tr onClick={ () => selectedRowIndex === index ? setSelectedRowIndex(-1) : setSelectedRowIndex(index) } style={{ 'cursor': 'pointer' }}>
                  {row.getVisibleCells().map(cell => (
                    <Cell key={cell.id} textAlign={cell.id.includes('actions') ? 'left': 'center'}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Cell>
                  ))}
                </tr>

                { index === selectedRowIndex ? <tr>
                  <td colSpan={5}>
                    <TxnDetail row={row} />
                  </td>
                </tr>: null}

              </React.Fragment>

            ))}
          </tbody>
        }

      </table>

      <Paginator table={table} />

    </Widget>
  )
}

type PaginatorProps = PropsWithChildren & {
  table: Table<Txn>
};

const Paginator = ({table}: PaginatorProps) => {
  return (
    <>
      <Flex flexDirection={{base: 'column-reverse', md: 'row'}} my={2} w='100%' justifyContent='end' alignItems={{base: 'flex-start',md: 'center'}} gap={5} marginTop={'25px'}>

        <chakra.span justifySelf='start'>
          <span>Page: </span>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </chakra.span>

        <span className="flex items-center gap-1">
          Go to
          <Input
            size='sm'
            ml={2}
            width='100px'
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
          />
        </span>
        <Select
          size='sm'
          w='120px'
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 25, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </Select>

        <Flex gap={2}>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

type FilterProps = PropsWithChildren & {
  column: Column<any, unknown>,
  table: Table<Txn>,
  selectedDates: Date[],
  setSelectedDates: Function,
  loading?: boolean
};

function Filter({
  column,
  table,
  selectedDates,
  setSelectedDates,
  loading
}: FilterProps) {
  const columnFilterValue = column.getFilterValue()

  const columnDef = (column.columnDef as CustomColumnDef<Txn>);

  const disabled = loading;

  return columnDef.fieldType === "select"
  ? (
    <div>
      <Select
        disabled={disabled}
        placeholder='Select a value'
        onChange={(e) => {
          column.setFilterValue(e.target.value);
        }}
        width={{base: '175px', md: '175px'}}
      >
        {
          columnDef.options?.map(value => <option style={{textTransform: 'capitalize'}} key={value}>{value}</option>)
        }
      </Select>
    </div>
  )
  : columnDef.fieldType === 'number' ? (
    <div>
      <Flex gap={'10px'} className="flex space-x-2" justifyContent='center' marginLeft='20px'>
        <DebouncedInput
          disabled={disabled}
          type="number"
          width={{base: '100px', md: '82px'}}
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>{
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          disabled={disabled}
          width={{base: '100px', md: '82px'}}
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>{
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
      </Flex>
      <div className="h-1" />
    </div>
  ) : column.id === "time" ? (
    <div style={{ marginLeft: '20px' }}>
      <RangeDatepicker
        disabled={disabled}
        propsConfigs={{
          inputProps: {
            width: '225px'
          }
        }}
        selectedDates={selectedDates}
        onDateChange={(selectedDateRange: Date[]) => {
          let dates = selectedDateRange;

          if(selectedDateRange.length === 1) {
            dates = [selectedDateRange[0], new Date()];
          }

          column.setFilterValue(() => dates.map((date: Date) => (date.valueOf()/1000)));
          setSelectedDates(selectedDateRange);
        }}
      />
      <div className="h-1" />
    </div>
  ) : (
    <div style={{ marginLeft: '20px', marginRight: '20px' }}>
      <DebouncedInput
        disabled={disabled}
        width={{base: '150px', md: '200px'}}
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => {
          column.setFilterValue(value)
        }}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </div>
  )
}

const BitcoinTxnTableWithErrorBoundary = withErrorBoundary(BitcoinTxnTable, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Transaction table' />)
});

export default BitcoinTxnTableWithErrorBoundary;

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
