import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Box, chakra, Flex, Icon, Select, useBreakpoint } from "@chakra-ui/react";
import { Column, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Row, SortingState, Table, useReactTable } from "@tanstack/react-table";
import { IoChevronUpCircle, IoChevronDownCircle, IoChevronDownCircleOutline } from "react-icons/io5";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { Cell, Widget } from "@shared/components/index";
import { ClientCustomColumnDef, CustomColumnDef } from "@shared/types";

import { SkeletonTable } from "@shared/components/SkeletonTable";
import ClientDataTableFilter from "./Filter";
import Paginator from "./Paginator";

export type DetailProps<T> = PropsWithChildren & {
  row: Row<T>,
  closeHandler: () => void,
}

export type DetailCompProps<T> = (props: DetailProps<T>) => JSX.Element;

export type ClientDataTableProps<T> = PropsWithChildren & {
  data: Array<T>,
  columnDef: ClientCustomColumnDef<T>[],
  isLoading?: boolean,
  detailComp?: DetailCompProps<T>,
  columnsToHideInMobile?: Array<string>,
};

const emptyArray: any = [];

export default function ClientDataTable<T>({
  data,
  columnDef,
  isLoading,
  columnsToHideInMobile = [],
  detailComp: DetailComp,
}: ClientDataTableProps<T>) {
  console.log('Render: ClientDataTable', data.length);

  const breakpoint = useBreakpoint({ssr: false});

  const [sorting, setSorting] = React.useState<SortingState>(emptyArray);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(emptyArray);

  const columns = useMemo<CustomColumnDef<T>[]>(() => [
    ...columnDef,
  ], [selectedRowIndex]);

  if(DetailComp) {
    columns.push({
      id: 'actions',
      cell: (props: any) => props.row.index === selectedRowIndex ? <Icon as={MdExpandMore} w={6} h={6} />: <Icon as={MdExpandLess} w={6} h={6} />,
      width: '50px'
    });
  }

    /*
  useEffect(() => {
    console.log(sorting);
    console.log(selectedRowIndex);
    console.log(columnFilters);
  }, [sorting, selectedRowIndex, columnFilters]);
     */

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

  const emptyValues = useMemo(() => columns.reduce((prev, cur ) => {
    prev[cur.id!] = '';
    return prev;
  }, {} as any), [columns]);

  const dummyDataForSkeleton = useMemo(() => new Array(10).fill(emptyValues), [emptyValues]);

  const table = useReactTable({
    data: isLoading ? dummyDataForSkeleton: data,
    columns,
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Widget
      variant='border'
      position='relative'
      overflowX='auto'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      minHeight={{
        base: '750px',
        md: '500px',
      }}
    >
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
                            style={{textAlign: 'center', minWidth: columnDef.width}}
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
                        {
                          header.column.getCanFilter()
                          ? (
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                              <ClientDataTableFilter column={header.column} loading={isLoading} />
                            </div>
                          )
                          : <Box height='40px' />
                        }
                      </Flex>
                    )
                    }
                  </th>
                )})}
              </tr>
          ))}
        </thead>

        {
          isLoading
          ?
          <SkeletonTable table={table} />
          :
          <tbody>

            {table.getRowModel().rows.length === 0 ? <tr> <chakra.th colSpan={5} textAlign="center" pt={12} pb={8}>
              <h2> Empty results </h2> 
              <h6> Refine your filters </h6> 
            </chakra.th> </tr> : null }

            {table
              .getRowModel()
              .rows
              .map((row, index) => {
                
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

                  { DetailComp && index === selectedRowIndex ? <tr>
                    <td colSpan={5}>
                      <DetailComp row={row} closeHandler={() => setSelectedRowIndex(-1)} />
                    </td>
                </tr>: null}

              </React.Fragment>
            );
              })}
            </tbody>
        }

      </table>

      { useMemo(() => <Paginator loading={isLoading} table={table} />, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize]) }

    </Widget>
  );
}
