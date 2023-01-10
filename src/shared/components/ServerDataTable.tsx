import React, { ReactNode, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';

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
  SortingState,
} from '@tanstack/react-table';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';

import { Widget, Cell } from '@shared/components/index';
import { CustomColumnDef } from '@shared/types';
import { dummyTxnDataForSkeleton } from '@shared/constants';

import { LoadingTable } from './bitcoin/TxnLoadingTable';

export type FilterProps<T> = PropsWithChildren & {
  column: Column<any, unknown>,
  table: Table<T>,
  selectedDates: Date[],
  setSelectedDates: Function,
  loading?: boolean
};

export type ServerDataTableProps<T> = PropsWithChildren & {

  // TODO: Make the type such that it should have a 'row' property
  DetailComp: any,

  data: Array<T>,
  columnDef: CustomColumnDef<T>[],
  filers?: any
  paginationConfig?: any,
  isLoading: boolean,
  columnsToHideInMobile?: Array<string>,

  columnFilters: ColumnFiltersState
  pageIndex: number,
  pageSize: number,
  sorting: SortingState,

  onColumnFiltersChange: any,
  onPaginationChange: any,
  onSortingChange: any,
};

// export const ServerDataTable = ({
export default function ServerDataTable<T>({
  DetailComp,

  data,
  columnDef,
  isLoading,
  columnsToHideInMobile = [],

  columnFilters,
  pageIndex,
  pageSize,
  sorting,

  onColumnFiltersChange,
  onPaginationChange,
  onSortingChange,

}: ServerDataTableProps<T>) {

  console.log('Render: ServerDataTable');

  const [ pageCount, setPageCount ] = useState(0);

  const breakpoint = useBreakpoint({ssr: false});
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);

  const columns = useMemo<CustomColumnDef<T>[]>(() => [
    ...columnDef,
    {
      id: 'actions',
      cell: props => props.row.index === selectedRowIndex ? <Icon as={MdExpandMore} w={6} h={6} />: <Icon as={MdExpandLess} w={6} h={6} />,
      width: '50px'
    }
  ], [selectedRowIndex]);

  useEffect(() => {
    if (columnsToHideInMobile.length === 0) return;

    if(['base', 'sm', 'md'].includes(breakpoint)) {
      table.getAllColumns().map(column => {
        if(columnsToHideInMobile.includes(column.id)) {
          column.toggleVisibility(false);
        }
      });
    } else {
      table.getAllColumns().map(column => {
        if(columnsToHideInMobile.includes(column.id)) {
          column.toggleVisibility(true);
        }
      });
    }
  }, [breakpoint]);


  const table = useReactTable({
    data: isLoading ? dummyTxnDataForSkeleton: data,
    columns,
    state: {
      columnFilters,
      pagination: { pageIndex, pageSize },
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: onColumnFiltersChange,
    onPaginationChange: onPaginationChange,
    onSortingChange: onSortingChange,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount,
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
                const columnDef = (header.column.columnDef as CustomColumnDef<any>);
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
                              Filter
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
          !hydrated.current || isLoading
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
                    <DetailComp row={row} />
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
  table: Table<any>
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
