import React, { useEffect, useMemo, useState } from 'react';
import {
  chakra,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  Select,
  useToast,
  useBreakpointValue,
  useBreakpoint,
  InputProps,
} from '@chakra-ui/react';

import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { IoChevronDownCircleOutline, IoChevronDownCircle, IoChevronUpCircle } from 'react-icons/io5';

import {
  Column,
  ColumnDef,
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
} from '@tanstack/react-table';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';

import { Widget, Cell, LoaderOverlay, ErrorOverlay } from '@shared/components/index';
import { CustomColumnDef, Txn } from '@shared/types';
import { TxnDetail } from './TxnTableDetail';

export const BitcoinTxnTable = ({data}: {data: Txn[]}) => {

  const breakpoint = useBreakpoint({ssr: false});
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<CustomColumnDef<Txn>[]>(() => [{
    id: 'type',
    accessorKey: 'category',
    header: () => <chakra.span> Type </chakra.span>,
    cell: info => info.getValue(),
    fieldType: 'select'
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
    fieldType: 'select'
  }, {
    id: 'actions',
    cell: props => props.row.index === selectedRowIndex ? <Icon as={MdExpandMore} w={6} h={6} />: <Icon as={MdExpandLess} w={6} h={6} />

  }], [selectedRowIndex]);

  const toast = useToast();

  const onClipboardCopy = () => {
    toast({
      title: 'Copied...',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  useEffect(() => {
    console.log('breakposit: ', breakpoint);
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
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

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

const Paginator = ({table}: {table: Table<any>}) => {
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
          {[2, 3, 5, 10, 20, 30, 40, 50].map(pageSize => (
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


function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>
  table: Table<any>
}) {
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

  return (column.columnDef as CustomColumnDef<Txn>).fieldType === "select"
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
          sortedUniqueValues.map(value => <option key={value}>{value}</option>)
        }
      </Select>
    </div>
  )
  : typeof firstValue === 'number' && !(["confirmations", "time"].includes(column.id)) ? (
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
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void,
  width?: any,
  debounce?: number
} & Omit<InputProps, 'onChange' | 'width'>) {
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
