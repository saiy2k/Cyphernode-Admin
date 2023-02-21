import React, { useEffect, useState } from 'react';

import {
  chakra,
  Flex,
  FormControl,
  InputGroup,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from '@chakra-ui/react';

import {
  ColumnFiltersState,
  PaginationState,
  ColumnFilter,
  SortingState,
} from '@tanstack/react-table';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { CustomColumnDef, SuccessResponse, Wasabi, WasabiInstance, WasabiTxn } from '@shared/types';
import { WasabiTxnDetail } from './WasabiTxnDetail';
import { dummyTxnDataForSkeleton } from '@shared/constants';
import { getCallProxy } from '@shared/services/api';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';
import { DebouncedInput } from 'shared/components/DebouncedInput';

import ServerDataTable, { FilterProps } from '@shared/components/ServerDataTable';

export const WasabiTxnTable = () => {

  console.log('Render: WasabiTxnTable');

  const [ txData, setTxData ] = useState<WasabiTxn[]>([]);
  const [ txnDataLoading, setTxnDataLoading ] = useState<boolean>(true);
  const [ pageCount, setPageCount ] = useState(0);

  const [ instanceId, setInstanceId ] = useState<WasabiInstance>("ALL");

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{
    id: "date",
    desc: true
  }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleError = useErrorHandler();

  useEffect(() => {

    setTxnDataLoading(true);

    (async() => {
      console.log('Home :: useEffect :: call API :: wasabi');
      try {

        const filters = reduceColumnFilters(columnFilters);
        const sortColumn = sorting.length === 1 ? sorting[0].id : '';
        const sortDirection = sorting.length === 1 ? sorting[0].desc ? 'DESC' : 'ASC' : '';

        const payload = {
          perPage: pageSize,
          page: pageIndex,
          ...filters,
          sortColumn,
          sortDirection,
        };

        if(instanceId && instanceId !== "ALL") {
          payload.instanceId = instanceId;
        }

        const response = await getCallProxy('wasabi', payload);
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

  }, [pageIndex, pageSize, columnFilters, sorting, instanceId]);

  function onInstanceIdChange(value: WasabiInstance) {
    setInstanceId(value);
  }

  return (
    <>
      <Flex justifyContent={{base: 'flex-end'}}>
        {instanceId}
        <RadioGroup _checked={{
        bg: 'white',
        borderColor: 'black',
      }} onChange={onInstanceIdChange} value={instanceId}>
          <Stack direction='row'>
            <Radio value={'ALL'}>ALL</Radio>
            <Radio value={'0'}>Instance 0</Radio>
            <Radio value={'1'}>Instance 1</Radio>
          </Stack>
        </RadioGroup>
      </Flex>

      <ServerDataTable<WasabiTxn>
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
    </>
  );

}

const columns = [
{
  id: 'type',
  accessorFn: (row: WasabiTxn) => row.amount > 0 ? "IN": "OUT",
  header: () => <chakra.span> Type </chakra.span>,
  cell: (info: any) => info.getValue(),
  fieldType: 'select',
  options: ["IN", "OUT"],
  width: 'auto',
  enableSorting: false,
},
{
  id: 'date',
  accessorFn: (row: WasabiTxn) => new Date(row.datetime),
  header: () => <span> Date </span>,
  cell: (info: any) => new Date((info.getValue() as any)).toLocaleString(),
  width: 'auto',
  fieldType: 'date',
},
{
  id: 'amount',
  accessorKey: 'amount',
  header: () => <span> Sats </span>,
  cell: (info: any) => (Math.abs(info.getValue() as any)).toFixed(8),
  fieldType: 'number',
  width: '150px',
},
{
  id: 'txid',
  accessorKey: 'tx',
  header: () => <span> Txn ID </span>,
  cell: (info: any) => (info.getValue() as any).slice(0, 12) + '...',
  enableSorting: true,
  width: 'auto',
}];

function Filter({
  column,
  table,
  selectedDates,
  setSelectedDates,
  loading
}: FilterProps<WasabiTxn>) {
  const columnFilterValue = column.getFilterValue()

  const columnDef = (column.columnDef as CustomColumnDef<WasabiTxn>);

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
      case 'date':
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
      case 'txid':
        prev['txid'] = cur.value.toLowerCase();
        break;
    }

    return prev;
  }, {} as any);


}
