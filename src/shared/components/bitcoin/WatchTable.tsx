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
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { CustomColumnDef, Watch } from '@shared/types';
import { getCallProxy } from '@shared/services/api';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';

import ServerDataTable, { FilterProps } from '../ServerDataTable';
import { WatchDetail } from './WatchTableDetail';

import { DebouncedInput } from 'shared/components/DebouncedInput';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';

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
    // <ServerDataTable
    //   data={watchData} 
    //   isLoading={false}
    //   columnDef={columns}

    //   columnFilters={columnFilters}
    //   pageIndex={pageIndex}
    //   pageSize={pageSize}
    //   sorting={sorting}

    //   onColumnFiltersChange={setColumnFilters}
    //   onPaginationChange={setPagination}
    //   onSortingChange={setSorting}

    //   dummyDataForSkeleton={[]}
    //   pageCount={0}

    //   DetailComp={WatchDetail}
    // />
    <h1>TODO: Fix DetailComp prop</h1>
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

function Filter({
  column,
  table,
  selectedDates,
  setSelectedDates,
  loading
}: FilterProps<Watch>) {
  const columnFilterValue = column.getFilterValue()

  const columnDef = (column.columnDef as CustomColumnDef<Watch>);

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

