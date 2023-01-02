import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';

import {
  chakra,
  Button,
  Flex,
  Icon,
  Input,
  Select,
  useBreakpoint,
  InputProps,
} from '@chakra-ui/react';

import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { IoChevronDownCircleOutline, IoChevronDownCircle, IoChevronUpCircle } from 'react-icons/io5';
import {
  Column,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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

import { LoadingTable } from './TxnLoadingTable';

// TODO: Move this file, TxnLoadingTable into /shared/components/txn-table/*
export const BitcoinTxnTable = () => {

  console.log('BitcoinTxnTable :: Load');

  const [ txData, setTxData ] = useState<Txn[]>([]);
  const [ pageCount, setPageCount ] = useState(0);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [ filters, setFilters ] = useState({
    type: '',
    start: '',
    end: '',
    amountMin: 0,
    amountMax: 0,
    status: ''
  });

  const [ sort, setSort ] = useState({
    sortColumn: '',
    sortDirection: ''
  });

  useEffect(() => {

    setTxnDataLoading(true);

    (async() => {
      console.log('Home :: useEffect :: call API :: txns');
      try {
        const response = await getCallProxy('txns', { perPage: pageSize, page: pageIndex, ...filters, ...sort });
        const txns: SuccessResponse = await response.json();
        console.log(txns);
        setTxData(txns.data);
        setPageCount(txns.meta.pageCount);
      } catch(err) {
        console.log(err);
      } finally {
        setTxnDataLoading(false);
      }
    })();
  }, [pageIndex, pageSize, filters, sort]);


  const onPaginationChange = (pagination: {pageSize: number, pageIndex: number}) => {
    console.log('onPaginationChange');
    setPagination({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    });
  }

  const onFilterChange = (filters: {type: string, start: string, end: string, amountMin: number, amountMax: number, status: string}) => {
    console.log('onFilterChange');
    // setFilters(filters);
  }

  const onSortChange = (sortObj: {column: string, direction: string}) => {
    console.log('onSortChange');
    setSort({
      sortColumn: sortObj.column,
      sortDirection: sortObj.direction
    });
  }

  const [txnDataLoading, setTxnDataLoading] = useState<boolean>(true);
  const handleError = useErrorHandler();

  const breakpoint = useBreakpoint({ssr: false});
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const [sorting, setSorting] = React.useState<SortingState>([])

  const columns = useMemo<CustomColumnDef<Txn>[]>(() => [{
    id: 'type',
    accessorKey: 'category',
    header: () => <chakra.span> Type </chakra.span>,
    cell: info => info.getValue(),
    fieldType: 'select',
    options: ["generate", "immature", "receive", "send"]
  }, {
    id: 'time',
    accessorKey: 'time',
    header: () => <span> Time </span>,
    cell: info => new Date((info.getValue() as any) * 1000).toLocaleString(),
    filterFn: 'inNumberRange'
  }, {
    id: 'amount',
    accessorKey: 'amount',
    header: () => <span> btc </span>,
    cell: info => (info.getValue() as any).toFixed(8),
    fieldType: 'number'
  }, {
    id: 'txid',
    accessorKey: 'txid',
    header: () => <span> Tx id </span>,
    cell: info => (info.getValue() as any).slice(0, 12) + '...',
  }, {
    id: 'confirmations',
    // accessorKey: 'confirmations',
    accessorFn: (row) => (Boolean(row.confirmations) && row.confirmations > 0) ?'Confirmed': 'Pending',
    header: () => <span> Status </span>,
    cell: (info) => info.cell.row.original.confirmations ===0 ? 'Pending': `Confirmation(${info.cell.row.original.confirmations})`,
    fieldType: 'select',
    options: ["pending", "confirmed"]
  }, {
    id: 'actions',
    cell: props => props.row.index === selectedRowIndex ? <Icon as={MdExpandMore} w={6} h={6} />: <Icon as={MdExpandLess} w={6} h={6} />

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


  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    onPaginationChange({pageIndex, pageSize});
  }, [pageIndex, pageSize]);

  useEffect(() => {
    const filterObj = columnFilters.reduce((prev: any, cur: ColumnFilter & {value: any}) => {
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

    onFilterChange(filterObj);
  }, [columnFilters]);


  useEffect(() => {
    const sortObj = {
      column: '',
      direction: ''
    };

    if(sorting.length === 1) {
      sortObj.column = sorting[0].id;
      sortObj.direction = sorting[0].desc ? 'DESC' : 'ASC';
    }

    onSortChange(sortObj);
  }, [sorting]);


  const table = useReactTable({
    data: Array.isArray(txData) && txData.length === 0 ? dummyTxnDataForSkeleton: txData,
    columns,
    state: {
      columnFilters,
      pagination,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount,
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    onSortingChange: setSorting,
  });

  const hydrated = useRef(false);

  useEffect(() => {
    if(!hydrated.current) {
      hydrated.current = true;
    }
  }, []);

  // Returns loading on first render, so the client and server match
  if (!hydrated.current || txnDataLoading) {
    return <LoadingTable table={table} />;
  }

  return (
    <Widget variant='border' style={{ position: 'relative', overflowX: 'auto' }}>
      <table>

        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    // : flexRender(
                    //     header.column.columnDef.header,
                    //     header.getContext()
                    //   )
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
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </Flex>
                    )
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row, index: number) => (

            <React.Fragment key={row.id}>
              <tr onClick={ () => selectedRowIndex === index ? setSelectedRowIndex(-1) : setSelectedRowIndex(index) } style={{ 'cursor': 'pointer' }}>
                {row.getVisibleCells().map(cell => (
                  <Cell key={cell.id} textAlign='center'>
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
  table: Table<Txn>
};

function Filter({
  column,
  table,
}: FilterProps) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  let sortedUniqueValues = React.useMemo(
    () =>
      column.id === "confirmations"
      ? ["Pending", "Confirmed"]
      : typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);

  const columnDef = (column.columnDef as CustomColumnDef<Txn>);

  return columnDef.fieldType === "select"
  ? (
    <div>
      <Select
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
          type="number"
          width={{base: '100px', md: '125px'}}
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          width={{base: '100px', md: '125px'}}
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
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
        propsConfigs={{
          inputProps: {
            width: '225px'
          }
        }}
        selectedDates={selectedDates}
        onDateChange={(selectedDates: Date[]) => {

          let dates = selectedDates;

          if(selectedDates.length === 1) {
            dates = [selectedDates[0], new Date()];
          }

          column.setFilterValue(() => dates.map((date: Date) => (date.valueOf()/1000)));
          setSelectedDates(selectedDates);
        }}
      />
      <div className="h-1" />
    </div>
  ) : (
    <div style={{ marginLeft: '20px', marginRight: '20px' }}>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
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

// A debounced input react component
type DebouncedInputProps = PropsWithChildren & Omit<InputProps, 'onChange' | 'width'> & {
  value: string | number
  onChange: (value: string | number) => void,
  width?: any,
  debounce?: number
};

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps ) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}


const BitcoinTxnTableWithErrorBoundary = withErrorBoundary(BitcoinTxnTable, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Transaction table' />)
});

export default BitcoinTxnTableWithErrorBoundary;
