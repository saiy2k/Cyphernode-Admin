import React, { ReactNode, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';

import {
  chakra,
  Flex,
  Icon,
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
  Row,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table';

import { Widget, Cell } from '@shared/components/index';
import { CustomColumnDef } from '@shared/types';

import { SkeletonTable } from '@shared/components/SkeletonTable';
import { Paginator } from '@shared/components/ServerDataTable/Paginator';

export type FilterProps<T> = PropsWithChildren & {
  column: Column<any, unknown>,
  table: Table<T>,
  selectedDates: Date[],
  setSelectedDates: Function,
  loading?: boolean
};

export type DetailProps<T> = PropsWithChildren & {
  row: Row<T>
}

export type DetailCompProps<T> = (props: DetailProps<T>) => JSX.Element;
export type FilterControlProps<T> = (props: FilterProps<T>) => JSX.Element;

export type ServerDataTableProps<T> = PropsWithChildren & {

  DetailComp: DetailCompProps<T>,

  data: Array<T>,
  dummyDataForSkeleton: Array<T>,
  columnDef: CustomColumnDef<T>[],
  paginationConfig?: any,
  isLoading: boolean,
  columnsToHideInMobile?: Array<string>,
  pageCount: number,

  FilterControl?: FilterControlProps<T>,
  columnFilters?: ColumnFiltersState
  pageIndex: number,
  pageSize: number,
  sorting?: SortingState,

  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>,
  onPaginationChange: OnChangeFn<PaginationState>,
  onSortingChange?: OnChangeFn<SortingState>,
};

export default function ServerDataTable<T>({
  DetailComp,

  data,
  dummyDataForSkeleton,
  columnDef,
  isLoading,
  columnsToHideInMobile = [],
  pageCount,

  FilterControl,
  columnFilters,
  pageIndex,
  pageSize,
  sorting,

  onColumnFiltersChange,
  onPaginationChange,
  onSortingChange,

}: ServerDataTableProps<T>) {

  console.log('Render: ServerDataTable', data.length);

  const breakpoint = useBreakpoint({ssr: false});
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);

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
    data: isLoading ? dummyDataForSkeleton: data,
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
                          {FilterControl && header.column.getCanFilter() ? (
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                              <FilterControl selectedDates={selectedDates} setSelectedDates={setSelectedDates} column={header.column} table={table} loading={!hydrated.current || isLoading} />
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
            <SkeletonTable table={table} />
          :
            <tbody>

            {table.getRowModel().rows.length === 0 ? <tr> <chakra.th colSpan={5} textAlign="center" pt={12} pb={8}>
              <h2> Empty results </h2> 
              <h6> Refine your filters </h6> 
            </chakra.th> </tr> : null }

            {table.getCoreRowModel().rows.map((row, index: number) => {

            const onRowClick = DetailComp === undefined
            ? undefined
            : () => selectedRowIndex === index
              ? setSelectedRowIndex(-1)
              : setSelectedRowIndex(index);

            return (
              <React.Fragment key={row.id}>
                <tr onClick={ onRowClick } style={{ 'cursor': 'pointer' }}>
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

            )})}
          </tbody>
        }

      </table>

      <Paginator loading={isLoading} table={table} />

    </Widget>
  )
}
