import React, { useEffect, useState } from 'react';

import {
  chakra,
  Flex,
  Select,
} from '@chakra-ui/react';

import {
  ColumnFiltersState,
  PaginationState,
  ColumnFilter,
  SortingState,
} from '@tanstack/react-table';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { CustomColumnDef, Wasabi } from '@shared/types';
import { WasabiTxnDetail } from './WasabiTxnDetail';
import { dummyTxnDataForSkeleton } from '@shared/constants';
import { getCallProxy } from '@shared/services/api';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';
import { DebouncedInput } from 'shared/components/DebouncedInput';

import ServerDataTable, { FilterProps } from '@shared/components/ServerDataTable';

export const WasabiTxnTable = () => {

  console.log('Render: WasabiTxnTable');

  const [ txData, setTxData ] = useState<Wasabi[]>([]);
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

  const handleError = useErrorHandler();

  useEffect(() => {

    setTxnDataLoading(true);

    (async() => {
      console.log('Home :: useEffect :: call API :: txns');
      try {

        // const filters = reduceColumnFilters(columnFilters);
        // const sortColumn = sorting.length === 1 ? sorting[0].id : '';
        // const sortDirection = sorting.length === 1 ? sorting[0].desc ? 'DESC' : 'ASC' : '';

        // const response = await getCallProxy('txns', { perPage: pageSize, page: pageIndex, ...filters, sortColumn, sortDirection });
        // if (!response.ok) {
        //   const bodyResp = await response.json();
        //   throw new Error(response.status + ': ' + response.statusText + ': ' + JSON.stringify(bodyResp));
        // }
        // const txns: SuccessResponse = await response.json();
        // setTxData(txns.data);
        // setPageCount(txns.meta.pageCount);
        setPageCount(10);
        setTxData([
          {
            date: "2023-01-30T07:25:05.592Z",
            fee: 300,
            sats: 5000,
            status: "confirmed",
            txnId: "tx928492850298520",
            type: "IN",
            inputAddress: "bc1qfl6822wnkvhq4gza64rmv7spwdlpwq8n2yfke4wq8n2yfke4",
            outputAddress: "bc1qxj93vd2n3nkycne4c4hmydzfqr4p2tznqka2uz2tznqka2uz",
            confirmations: 10,
            confirmedBlock: 100,
          },
          {
            date: "2022-12-30T07:25:05.592Z",
            fee: 300,
            sats: 3000,
            status: "pending",
            txnId: "tx928492850298520",
            type: "OUT",
            inputAddress: "bc1qfl6822wnkvhq4gza64rmv7spwdlpwq8n2yfke4wq8n2yfke4",
            outputAddress: "bc1qxj93vd2n3nkycne4c4hmydzfqr4p2tznqka2uz2tznqka2uz",
            confirmations: 15,
            confirmedBlock: 150,
          },
          {
            date: "2022-11-30T07:25:05.592Z",
            fee: 300,
            sats: 7000,
            status: "confirmed",
            txnId: "tx928492850298520",
            type: "IN",
            inputAddress: "bc1qfl6822wnkvhq4gza64rmv7spwdlpwq8n2yfke4wq8n2yfke4",
            outputAddress: "bc1qxj93vd2n3nkycne4c4hmydzfqr4p2tznqka2uz2tznqka2uz",
            confirmations: 20,
            confirmedBlock: 200,
          },
          {
            date: "2022-10-30T07:25:05.592Z",
            fee: 300,
            sats: 9000,
            status: "pending",
            txnId: "tx928492850298520",
            type: "OUT",
            inputAddress: "bc1qfl6822wnkvhq4gza64rmv7spwdlpwq8n2yfke4wq8n2yfke4",
            outputAddress: "bc1qxj93vd2n3nkycne4c4hmydzfqr4p2tznqka2uz2tznqka2uz",
            confirmations: 25,
            confirmedBlock: 250,
          }
        ]);
        setTxnDataLoading(false);
      } catch(err) {
        setTxnDataLoading(false);
        setTxData([]);
        setPageCount(0);
        handleError(err);
      }
    })();

  }, [pageIndex, pageSize, columnFilters, sorting]);

  return (
    <ServerDataTable
      data={txData} 
      dummyDataForSkeleton={dummyTxnDataForSkeleton}
      isLoading={txnDataLoading}
      columnDef={columns}
      columnsToHideInMobile={['txid', 'confirmations']}
      pageCount={pageCount}

      FilterControl={Filter}
      columnFilters={columnFilters}
      pageIndex={pageIndex}
      pageSize={pageSize}
      sorting={sorting}

      onColumnFiltersChange={setColumnFilters}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}

      DetailComp={WasabiTxnDetail}
    />
  );

}

const columns = [
{
  id: 'type',
  accessorKey: 'type',
  header: () => <chakra.span> Type </chakra.span>,
  cell: (info: any) => info.getValue(),
  fieldType: 'select',
  options: ["IN", "OUT"],
  width: 'auto',
},
{
  id: 'date',
  accessorKey: 'date',
  header: () => <span> Date </span>,
  cell: (info: any) => new Date((info.getValue() as any)).toLocaleString(),
  width: 'auto',
  fieldType: 'date',
},
{
  id: 'sats',
  accessorKey: 'sats',
  header: () => <span> Sats </span>,
  cell: (info: any) => (info.getValue() as any).toFixed(8),
  fieldType: 'number',
  width: '150px',
},
{
  id: 'fee',
  accessorKey: 'fee',
  header: () => <span> Fee </span>,
  cell: (info: any) => (info.getValue() as any).toFixed(8),
  fieldType: 'number',
  width: '150px',
},
{
  id: 'txnId',
  accessorKey: 'txnId',
  header: () => <span> Txn ID </span>,
  cell: (info: any) => (info.getValue() as any).slice(0, 12) + '...',
  enableSorting: true,
  width: 'auto',
},
{
  id: 'status',
  accessorKey: 'status',
  header: () => <chakra.span> Status </chakra.span>,
  cell: (info: any) => info.getValue(),
  fieldType: 'select',
  options: ["pending", "confirmed"],
  width: 'auto',
}];

function Filter({
  column,
  table,
  selectedDates,
  setSelectedDates,
  loading
}: FilterProps<Wasabi>) {
  const columnFilterValue = column.getFilterValue()

  const columnDef = (column.columnDef as CustomColumnDef<Wasabi>);

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
  ) : columnDef.fieldType === "date" ? (
    <div className='range-date-picker' style={{ marginLeft: '20px' }}>
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

const WasabiTxnTableWithErrorBoundary = withErrorBoundary(WasabiTxnTable, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Transaction table' />)
});

export default WasabiTxnTableWithErrorBoundary;

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
